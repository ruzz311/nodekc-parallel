var fs          = require('fs'),
    cluster     = require('cluster'),
    http        = require('http'),
    maxWorkers  = require('os').cpus().length,
    restify     = require('restify'),
    port        = process.env.PORT || 8080,
    numReqs     = 0,
    example     = {
        'base': '/examples',
        'files': fs.readdirSync('./examples')
    };

// Ping GET requests to the server
function ping (times) {
    for (var i = 0; i < times; i++) {
        http.get('http://0.0.0.0:8080/');
    }
}

// Count the number of properties on an object
function objLen (obj) {
    var count = 0;
    Object.keys(obj).forEach(function (id) { count++; });
    return count;
}

function fileList (req, res, next) {
    res.send(example);

    process.send({ 
        cmd     : 'notifyRequest', 
        worker  : cluster.worker.id,
        req     : {
            url     : req.url,
            method  : req.method
        }
    });
}

// Listen for message events from children 
function messageHandler (msg) {
    console.log('Request [%s] "%s" (worker #%s)', msg.req.method, msg.req.url, msg.worker);

    if (msg.cmd && msg.cmd === 'notifyRequest') {
        numReqs += 1;
    }
}

if (cluster.isMaster) {

    var workerCount = 0,
        i           = 0;

    cluster.on('exit', function(worker, code, signal) {
        workerCount--;
        console.log('worker %s died with signal %s:', worker.process.pid, signal);
        console.log('    current workers : %s', objLen(cluster.workers));
        console.log('    max workers     : %s', maxWorkers);
        console.log('    restarting worker with new fork!');
        //cluster.fork();
    });

    // attach cluster events as the worker is available
    // using `process.send({ ... })` would trigger the messageHandler
    cluster.on('listening', function(worker, address) {
        workerCount++;

        cluster.workers[worker.id].on('message', messageHandler);

        if( workerCount === maxWorkers ){
            console.log("Cluster Size: %s", workerCount);
            console.log('ALL WORKERS LISTENING');

            ping(10000);
            ping(10000);
        }
    });

    // After attaching events on the cluster / process Start forking 
    for (i; i < maxWorkers; i++) { cluster.fork(); }

} else {

    var server = restify.createServer();
        server.use(restify.queryParser());
        server.use(restify.jsonp());
        server.use(restify.gzipResponse());

    // A reminder of available routes
    server.get('/', fileList);

    // ALL OV ZE FILES... RET DEM
    for (var i in example.files) {
        var file        = example.files[i];
        var url         = example.base+'/'+file;
        var exampleFile = require('.'+url);
        server.get(url, exampleFile());
    }

    server.listen( port, function () {
        process.send({ 
            cmd     : 'serverReady', 
            worker  : cluster.worker.id,
            server  : {
                name    : server.name,
                url     : server.url
            }
        });
        console.log('%s listening at %s (worker #%s)', server.name, server.url, cluster.worker.id);
    });

    return server;

}