var path = require('path');
var Parallel = require(path.join(__dirname, '../', 'node_modules', 'parallel.js', 'lib', 'parallel.js'));

module.exports = function (options) {

    return function (req, res, next) {
        var text = req.params.input || 'forwards';
        
        var p = new Parallel(text);
        
        var log = function(data) { 
            res.send(data);
            console.log("%s -> %s", text, data);
        };

        function child(data) {
          data = data.split('').reverse().join('');
          return data;
        }

        // Spawn a remote job
        p.spawn(child).then(log);
    };
};