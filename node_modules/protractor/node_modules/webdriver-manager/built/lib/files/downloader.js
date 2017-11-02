"use strict";
const fs = require("fs");
const path = require("path");
const request = require("request");
const url = require("url");
const cli_1 = require("../cli");
const config_1 = require("../config");
let logger = new cli_1.Logger('downloader');
/**
 * The file downloader.
 */
class Downloader {
    /**
     * Resolves proxy based on values set
     * @param fileUrl The url to download the file.
     * @param opt_proxy The proxy to connect to to download files.
     * @return Either undefined or the proxy.
     */
    static resolveProxy_(fileUrl, opt_proxy) {
        let protocol = url.parse(fileUrl).protocol;
        let hostname = url.parse(fileUrl).hostname;
        if (opt_proxy) {
            return opt_proxy;
        }
        else {
            // If the NO_PROXY environment variable exists and matches the host name,
            // to ignore the resolve proxy.
            // the checks to see if it exists and equal to empty string is to help with testing
            let noProxy = config_1.Config.noProxy();
            if (noProxy) {
                // array of hostnames/domain names listed in the NO_PROXY environment variable
                let noProxyTokens = noProxy.split(',');
                // check if the fileUrl hostname part does not end with one of the
                // NO_PROXY environment variable's hostnames/domain names
                for (let noProxyToken of noProxyTokens) {
                    if (hostname.indexOf(noProxyToken) !== -1) {
                        return undefined;
                    }
                }
            }
            // If the HTTPS_PROXY and HTTP_PROXY environment variable is set, use that as the proxy
            if (protocol === 'https:') {
                return config_1.Config.httpsProxy() || config_1.Config.httpProxy();
            }
            else if (protocol === 'http:') {
                return config_1.Config.httpProxy();
            }
        }
        return undefined;
    }
    /**
     * Http get the file. Check the content length of the file before writing the file.
     * If the content length does not match, remove it and download the file.
     *
     * @param binary The binary of interest.
     * @param fileName The file name.
     * @param outputDir The directory where files are downloaded and stored.
     * @param contentLength The content length of the existing file.
     * @param opt_proxy The proxy for downloading files.
     * @param opt_ignoreSSL Should the downloader ignore SSL.
     * @param opt_callback Callback method to be executed after the file is downloaded.
     * @returns Promise<any> Resolves true = downloaded. Resolves false = not downloaded.
     *          Rejected with an error.
     */
    static getFile(binary, fileUrl, fileName, outputDir, contentLength, opt_proxy, opt_ignoreSSL, callback) {
        let filePath = path.resolve(outputDir, fileName);
        let file;
        let options = {
            url: fileUrl,
            // default Linux can be anywhere from 20-120 seconds
            // increasing this arbitrarily to 4 minutes
            timeout: 240000
        };
        if (opt_ignoreSSL) {
            logger.info('ignoring SSL certificate');
            options.strictSSL = !opt_ignoreSSL;
            options.rejectUnauthorized = !opt_ignoreSSL;
        }
        if (opt_proxy) {
            options.proxy = Downloader.resolveProxy_(fileUrl, opt_proxy);
            if (url.parse(options.url).protocol === 'https:') {
                options.url = options.url.replace('https:', 'http:');
            }
        }
        let req = null;
        let resContentLength;
        return new Promise((resolve, reject) => {
            req = request(options);
            req.on('response', response => {
                if (response.statusCode === 200) {
                    resContentLength = +response.headers['content-length'];
                    if (contentLength === resContentLength) {
                        // if the size is the same, do not download and stop here
                        response.destroy();
                        resolve(false);
                    }
                    else {
                        if (opt_proxy) {
                            let pathUrl = url.parse(options.url).path;
                            let host = url.parse(options.url).host;
                            let newFileUrl = url.resolve(opt_proxy, pathUrl);
                            logger.info('curl -o ' + outputDir + '/' + fileName + ' \'' + newFileUrl +
                                '\' -H \'host:' + host + '\'');
                        }
                        else {
                            logger.info('curl -o ' + outputDir + '/' + fileName + ' ' + fileUrl);
                        }
                        // only pipe if the headers are different length
                        file = fs.createWriteStream(filePath);
                        req.pipe(file);
                        file.on('close', () => {
                            fs.stat(filePath, (error, stats) => {
                                if (error) {
                                    error.msg = 'Error: Got error ' + error + ' from ' + fileUrl;
                                    return reject(error);
                                }
                                if (stats.size != resContentLength) {
                                    error.msg = 'Error: corrupt download for ' + fileName +
                                        '. Please re-run webdriver-manager update';
                                    fs.unlinkSync(filePath);
                                    reject(error);
                                }
                                if (callback) {
                                    callback(binary, outputDir, fileName);
                                }
                                resolve(true);
                            });
                        });
                    }
                }
                else {
                    let error = new Error();
                    error.msg =
                        'Expected response code 200, received: ' + response.statusCode;
                    reject(error);
                }
            });
            req.on('error', error => {
                if (error.code === 'ETIMEDOUT') {
                    error.msg = 'Connection timeout downloading: ' + fileUrl +
                        '. Default timeout is 4 minutes.';
                }
                else if (error.connect) {
                    error.msg = 'Could not connect to the server to download: ' + fileUrl;
                }
                reject(error);
            });
        })
            .catch(error => {
            logger.error(error.msg);
        });
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=downloader.js.map