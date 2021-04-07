const io = require('socket.io-client')
const assert = require('assert')
const expect = require('expect.js');


describe('Websocket tests', () => {
  var socket;

  beforeEach(function(done) {
      // Setup
      socket = io.connect('http://localhost:4732', {
          'reconnection delay' : 0
          , 'reopen delay' : 0
          , 'force new connection' : true
      });
      socket.on('connect', function() {
        console.log('worked...');
        done();
      });
      socket.on('disconnect', function() {
        console.log('disconnected...');
      })
  });

  afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

  describe('testing test', () => {
    it('Doing some things with indexOf()', function(done) {
      expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
      expect([1, 2, 3].indexOf(0)).to.be.equal(-1);
      done();
    });
  })
})
