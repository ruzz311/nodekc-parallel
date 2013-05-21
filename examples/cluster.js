var path = require('path');
var Parallel = require(path.join(__dirname, '../', 'node_modules', 'parallel.js', 'lib', 'parallel.js'));

module.exports = function (options) {

    return function (req, res, next) {
        res.send(req.query);
    };
};