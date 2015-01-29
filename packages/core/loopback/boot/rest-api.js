module.exports = function mountRestApi(server) {
  var restApiRoot = server.get('restApiRoot');
  var restMiddleware = server.loopback.rest();
  server.use(restApiRoot, restMiddleware);
};
