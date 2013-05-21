var path = require('path');
var Parallel = require(path.join(__dirname, '../', 'node_modules', 'parallel.js', 'lib', 'parallel.js'));

module.exports = function (options) {

    return function (req, res, next) {
        var query, input, p, log, slowSquare;

        query = req.query || {};
        input = Number(query.input);
        if(input === "NaN"){
            next("Input is not a valid number");
            return false;
        }

        
        p = new Parallel(input || 100000);
        
        log = function(data) { 
            console.log(data);
            res.send(data);
        };

        // increment from 0 until iterator == input * input
        // only doing this to chew up time.
        slowSquare = function(n) { 
            var i = 0; 
            while (++i < n * n) {}
            return i; 
        };
         
        // Spawn our slow function
        p.spawn(slowSquare).then(log);

    };
};
