const {io} = require('socket.io-client')
const assert = require('assert')
const expect = require('expect');
const fs = require('fs');

describe('Websocket tests', () => {
  var socket;
  var receiver;

  beforeAll(function(done) {
    process.env.NODE_ENV = 'test'
    // fs.writeFile('../server/data/allLogs.json', JSON.stringify([
    //   {
    //     class: 'server',
    //     type: '1',
    //     timestamp: 'time',
    //     log: 'test123',
    //     stack: [],
    //   }
    // ]), () => {
    //   db.reset();
    //   done();
    // });
    
    done();
  })

  beforeEach(function(done) {
      // Setup
      socket = io('http://localhost:3861', {
          transports: ['websocket']
      });
      receiver = io('http://localhost:3861', {
          transports: ['websocket']
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
        if(socket.connected || receiver.connected) {
            console.log('disconnecting...');
            socket.disconnect();
            receiver.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });

  describe('testing test', () => {
    it('Should add a record', (done) => {
      const data = {
        class: 'server',
        type: '2',
        timestamp: 'time',
        log: 'test456',
        stack: [],
      };

      console.log('inside add test')
      // socket.emit('display-logs')
      receiver.on('display-logs', (message) => {
        // console.log('message', message);
        expect(message.allLogs[message.allLogs.length-1]).toEqual(data);
        done();
      })
      socket.emit('store-logs', data)
    })
    
    it('Should delete logs', (done) => {
      console.log('inside delete test')
      // socket.emit('delete-logs')
      receiver.on('display-logs', (message) => {
        // console.log(message)
        expect(message.allLogs.length).toBe(0);
        done();
      })
      socket.emit('delete-logs');
    })
  })
})
