const { VIEW, VE, PROXY_SERVER } = process.env;
const { proxy_function, primoCustomizationsMiddleware } = require('../gulp/primoProxy');

const config = {
  getVe: () => VE,
  view: () => VIEW,
  PROXY_SERVER,
};

module.exports = function loadMiddlewares(app) {
  app.use(primoCustomizationsMiddleware(config, 'primo-explore'));
  app.use(proxy_function());
};