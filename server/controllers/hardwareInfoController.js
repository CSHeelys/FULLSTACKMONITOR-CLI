const os = require('os-utils')
const { io } = require("../../config");

const hardwareInfoController = {}

hardwareInfoController.getCPUInfo = async () => {
  const stats = {}
  setInterval(() => {
    os.cpuUsage(v => {
      const stats = {
        cpuUsage: v,
        cpuCount: os.cpuCount(),
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        memPercent: (1 - (os.freemem() / os.totalmem())) * 100
      }
      io.emit('send-hardware-info', stats)
    })
  }, 2000)
}

hardwareInfoController.getMemInfo = async () => {

}

module.exports = hardwareInfoController