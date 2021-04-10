const {io} = require('socket.io-client')
const expect = require('expect');

describe('Websocket tests', () => {
  var socket;

  beforeAll(function(done) {
    process.env.NODE_ENV = 'test'
    
    done();
  })

  beforeEach(function(done) {
      // Setup
      socket = io('http://localhost:3861', {
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
    it('Should add a general data record', (done) => {
      const data = {
        class: 'server',
        type: '2',
        timestamp: 'time',
        log: 'test456',
        stack: [],
      };

      socket.emit('store-logs', data);

      socket.emit('get-initial-logs');

      socket.on('display-logs', (message) => {
        expect(message.allLogs[message.allLogs.length-1]).toEqual(data);
        done();
      })
    })
    
    it('Should add a new record for console log', (done) => {
      const log = {
        type: 'log',
        args: 'ComponentMounted',
        stack: ['ComponentMounted', 'MountedFromTesting'],
        timestamp: 'Sat, 10 Apr 2021 20:32:13 GMT',
      };

      socket.emit('store-logs', log); 

      socket.emit('get-initial-logs');

      socket.on('display-logs', (message) => {
        expect(message.allLogs[message.allLogs.length - 1].type).toEqual('log');
        expect(message.allLogs[message.allLogs.length - 1].log).toEqual('setup');
      });
      
      done();
    });

    it('Should add a new record for a request', (done) => {
        const req = [
            {
              class: 'request',
              timestamp: 'Sat, 10 Apr 2021 20:32:13 GMT',
              fromIP: '13.66.139.159',
              method: 'GET',
              originalUri: '/api/',
              uri: '/api/',
              requestData: { filter: 'test' },
            },
            {
              class: 'response',
              timestamp: 'Sat, 10 Apr 2021 20:32:30 GMT',
              responseData: { 'data' : 'test' },
              responseStatus: 200,
              referer: '',
            },
          ];

      socket.emit('store-logs', req); 

      socket.emit('get-initial-logs');

      socket.on('display-logs', (message) => {
        expect(message.allLogs[message.allLogs.length - 1].type).toEqual('log');
        expect(message.allLogs[message.allLogs.length - 1].log).toEqual('setup');
      });

      done();
    });

    it('Should delete logs', (done) => {
      socket.emit('delete-logs');

      socket.on('display-logs', (message) => {
        expect(message.allLogs.length).toBe(0);
        done();
      })
    });
  })
})
