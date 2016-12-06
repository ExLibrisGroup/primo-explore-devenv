var browserSync = require('browser-sync');


module.exports = {
    closeServer: closeServer,
    reloadServer: reloadServer,
    streamToServer: streamToServer,
    startServer: startServer,
};

function closeServer(label) {
   browserSync.get(label).exit();
}

function reloadServer(label) {
    return browserSync.get('production').reload();
}

function streamToServer() {
    return browserSync.get('production').stream();
}

function startServer(args) {
    var label = args.label;
    var port = args.port;
    var baseDir = args.baseDir;
    var middleware = args.middleware;
    var open = args.open;

    var server = browserSync.create(label);
    var conf = {
        port: port,
        server: {
            baseDir: baseDir
        },
        open:open
    };
    if(middleware) {
        conf.middleware = args.middleware;
    }
    server.init(conf);

}