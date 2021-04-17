const { getAllLogs, storeLogs, deleteLogs } = require('../helpers/helpers');
const Queue = require('../helpers/queue');
const { io } = require('../../config');

const loggerController = {};
const queue = new Queue();

loggerController.getAllLogs = async () => {
  // Get all the logs
  console.log('testing from inside log controller');
  const data = { allLogs: await getAllLogs() };
  // Send them to the FE
  // console.log('data', data)
  io.emit('display-logs', data);
};

loggerController.storeLogs = async (logs) => {
  // Adding a queue with a 1 second delay to facilitate animations
  queue.enqueue(() => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // Store the new logs
        const data = { allLogs: await storeLogs(logs) };
        // Send the new logs to the FE
        io.emit('display-logs', data);
        // Send the new logs to the cmd app
        io.emit('print-logs', logs);
        // Let users project know logs have been successfully stored
        io.emit('store-logs', 'success');
        resolve('OK');
      }, 1000);
    });
  });
};

loggerController.deleteLogs = async () => {
  // Delete the logs
  const data = { allLogs: await deleteLogs() };
  // Update the FE accordingly
  io.emit('display-logs', data);
};

module.exports = loggerController;
