// Generated by CoffeeScript 1.3.3
var Ping, emitter, http,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

http = require('http');

emitter = require('emitter');

Ping = (function(_super) {

  __extends(Ping, _super);

  function Ping(options) {
    this.options = options || {};
    this.exeCount = this.options.times || 10;
    this.url = this.options.url || 'google.com';
  }

  Ping.prototype.start = function() {
    /*
            for(var i=0; i<times; i++){
                http.get('http://localhost:8000/')
            }
    */

  };

  return Ping;

})(emitter);
