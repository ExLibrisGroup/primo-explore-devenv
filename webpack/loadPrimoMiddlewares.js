const { VIEW, VE, PROXY_SERVER, SAML, CAS } = process.env;
const { proxy_function, primoCustomizationsMiddleware } = require('../gulp/primoProxy');
const origConfig = require('../gulp/config');

const config = Object.assign(
  {},
  origConfig,
  // uses environment variables instead of
  {
    getVe: () => VE === 'true',
    getSaml: () => SAML === 'true',
    getCas: () => CAS === 'true',
    view: () => VIEW,
    PROXY_SERVER,
  }
);

module.exports = function loadMiddlewares(app) {
  app.use(primoCustomizationsMiddleware('primo-explore', config));
  app.use(proxy_function(config));
};