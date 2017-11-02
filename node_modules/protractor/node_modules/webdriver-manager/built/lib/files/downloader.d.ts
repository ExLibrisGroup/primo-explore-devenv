import { Binary } from '../binaries/binary';
/**
 * The file downloader.
 */
export declare class Downloader {
    /**
     * Resolves proxy based on values set
     * @param fileUrl The url to download the file.
     * @param opt_proxy The proxy to connect to to download files.
     * @return Either undefined or the proxy.
     */
    static resolveProxy_(fileUrl: string, opt_proxy?: string): string;
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
    static getFile(binary: Binary, fileUrl: string, fileName: string, outputDir: string, contentLength: number, opt_proxy?: string, opt_ignoreSSL?: boolean, callback?: Function): Promise<any>;
}
