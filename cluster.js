var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var start = new Date();
var count = [];
var max = 100

function ping(times){
    for(var i=0; i<times; i++){
        http.get('http://localhost:8000/')
    }
}

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  setTimeout(function(){
    start = new Date();
    count = 0;
    ping(max);
  },1000);

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    var msg = "worker #"+cluster.worker.id;
    var entry = { 
        timestamp: (new Date()) - start,
        worker: cluster.worker.id
    };

    res.writeHead(200);
    res.end(msg);
    

    count.push(entry);

    if (count.length === max) 
        console.log('ALL DONE!', count.length, entry.timestamp);
    else
        console.log(msg, count.length, elapsed);

  }).listen(8000, function(){
    console.log('Server instance '+ cluster.worker.id + ' is available');
  });
}
