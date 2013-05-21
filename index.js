var path = require('path'),
    Parallel = require(path.join(__dirname, 'node_modules', 'parallel.js', 'lib', 'parallel.js'));

function commonError(err){
    console.log(err);
}

// return the reverse of the input string
function reverseString (str, log) {
    var p = new Parallel(str || 'forwards');
    
    log = log || function (data) {
        console.log(data); 
    };

    function flipitandreverseit (data) {
        data = data.split('').reverse().join('');
        return data;
    }

    p.spawn(flipitandreverseit).then(log, commonError);
}

// Slow Square a number, eat up some time
function slowSquare (input, log) {
    var p = new Parallel(input || 100);
    
    log = log || function (data) {
        console.log(data);
    };
    
    function sqare(n) { 
        var i = 0; 
        while (++i < n * n) {}
        return i; 
    }

    // Spawn our slow function
    p.spawn(sqare).then(log, commonError);
}

module.exports = function(options){
    return {
        "slowSquare": slowSquare,
        "reverseString": reverseString
    };
};

//=============================================================== Try them out

    reverseString('PoopSmith', function(d){ console.log('you say "%s"', d); });
    reverseString('MothaLicka');

    slowSquare(10);
    slowSquare(100000);