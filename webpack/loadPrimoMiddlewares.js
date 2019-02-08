const { VIEW, VE, PROXY_SERVER } = process.env;
const primoProxy = require('../gulp/primoProxy');

const config = {
  getVe: () => VE,
  view: () => VIEW,
  PROXY_SERVER,
};

function primoFirstMiddleware(req, res, next) {
  const http = require('http');
  const https = require('https');

  let confPath = config.getVe() ? '/primaws/rest/pub/configuration' : '/primo_library/libweb/webservices/rest/v1/configuration';
  let confAsJsPath = '/primo-explore/config_';

  let fixConfiguration = function (res, res1, isConfByFile) {

    let body = '';

    res1.setEncoding('utf8');

    res1.on("data", function (chunk) {
      body = body + chunk;
    });

    res1.on("end", function () {
      let vid = config.view() || '';
      let customizationProxy = primoProxy.getCustimazationObject(vid, 'primo-explore');

      if (isConfByFile) {
        res.end('');

      } else {
        let jsonBody = JSON.parse(body);
        let newBodyObject = jsonBody;

        newBodyObject.customization = customizationProxy;
        let newBody = JSON.stringify(newBodyObject);

        res.body = newBody;

        /*console.log('newBody: ' +newBody);*/
        res.end(newBody);
      }


    });
  };

  if (req.url.startsWith(confAsJsPath) || req.url.startsWith(confPath)) {
    let isConfByFile = false;
    if (req.url.startsWith(confAsJsPath)) {
      isConfByFile = true;
    }

    let url = config.PROXY_SERVER + req.url;
    let base = config.PROXY_SERVER.replace('http:\/\/', '').replace('https:\/\/', '');
    let method = config.PROXY_SERVER.split('://')[0];
    let parts = base.split(':');
    let hostname = parts[0];
    let port = parts[1];


    let options = {
      hostname: hostname,
      port: port,
      path: req.url,
      method: 'GET',
      headers: {
        'X-From-ExL-API-Gateway': '1'
      }
    };
    let requestObject = http;
    if (method === 'https') {
      requestObject = https;
    }
    let req2 = requestObject.request(options, (res1) => {
      fixConfiguration(res, res1, isConfByFile);
    });
    req2.on('error', (e) => {
      next();
    });

    req2.write('');
    req2.end();

  } else {
    next();
  }
}

module.exports = function loadMiddlewares(app) {
  app.use(primoFirstMiddleware);
  app.use(primoProxy.proxy_function());
};