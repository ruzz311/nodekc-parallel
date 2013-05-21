var path = require('path');
var Parallel = require(path.join(__dirname, '../', 'node_modules', 'parallel.js', 'lib', 'parallel.js'));

module.exports = function (options) {

    return function (req, res, next) {
        var p = new Parallel([0, 1, 2, 3, 4, 5, 6]);
        
        var log = function() { 
            res.send(arguments);
            console.log(arguments); 
        };

        // One gotcha: anonymous functions cannot be serialzed
        // If you want to do recursion, make sure the function
        // is named appropriately
        function fib (n) {
            return n < 2 ? 1 : fib(n - 1) + fib(n - 2);
        }

        p.map(fib).then(log);

        // Logs the first 7 Fibonnaci numbers, woot!
    };
};
