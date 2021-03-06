const { io } = require('../../config');
const loggerController = require('../controllers/loggerController');
const hardwareInfoController = require('../controllers/hardwareInfoController');

function socketRouter() {
  // Setup socket routes on initial connection with client
  io.on('connection', (socket) => {
    // Send logs to FE on first page load
    socket.on('get-initial-logs', loggerController.getAllLogs);

    // Store logs
    socket.on('store-logs', loggerController.storeLogs);

    // Delete logs
    socket.on('delete-logs', loggerController.deleteLogs);

    // Kill server
    socket.on('kill-server', loggerController.killServer);

    // Pause server
    socket.on('toggle-pause', loggerController.togglePause);

    // Get Hardware stats
    socket.on('get-cpu-info', hardwareInfoController.getCPUInfo);
  });
}

module.exports = socketRouter;
