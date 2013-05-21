http    = require 'http'
events  = require('events').EventEmitter

class Ping extends events.EventEmitter
    
    constructor: (options)->
        @options    = options or {}
        @exeCount   = @options.times || 10
        @url        = @options.url   || 'google.com'
    
    start: ()->
        for i in [0...@exeCount]
            http.get('http://localhost:8000/')
        ###
        for(var i=0; i<times; i++){
            http.get('http://localhost:8000/')
        }
        ###