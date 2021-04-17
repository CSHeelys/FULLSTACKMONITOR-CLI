/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
// import { render } from "enzyme";
import { Chart } from "chart.js";
import React, { Component } from "react";

function replaceGlobally(original, searchTxt, replaceTxt) {
  const regex = new RegExp(searchTxt, 'g');
  return original.replace(regex, replaceTxt);
}
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      times: [],
      dataClient: [],
      dataServer: [],
      dataRequests: [],
      dataCPU: [],
      dataMem: [],
      aggdata: {},
      cursorLogs: 0,
      cursorHardware: 0,
      coeff: 60000,
    };

    let logsChart;
    let CPUChart;

    this.initializeData = this.initializeData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.createGraphs = this.createGraphs.bind(this);
  }

  componentDidMount() {
    this.initializeData();
    // this.updateData();
    window.setInterval(this.updateData, 2000);
  }

  // componentDidUpdate() {
  //   console.log('change occurred');
  //   if (this.props.logs.length > this.state.cursor) {
  //     this.updateData();
  //   }
  // }

  initializeData() {
    // creating first set of 30 timestamps
    const tempTimes = [];
    const currentTimeUnrounded = new Date(
      new Date().toISOString().split("T").join(" ")
        .slice(0, -1)
    );
    let currentTime = new Date(
      Math.floor(currentTimeUnrounded.getTime() / this.state.coeff)
        * this.state.coeff
    );

    for (let i = 0; i < 30; i++) {
      tempTimes.unshift(currentTime);
      currentTime = new Date(currentTime.getTime() - this.state.coeff);
    }

    // aggregating log data
    const transformedData = {};

    for (let i = 0; i < this.props.logs.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(this.props.logs[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );
      if (!transformedData[timestamp]) {
        // client, server, request, cpu, mem, totalcpu, totalmem, hardware count
        transformedData[timestamp] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      if (this.props.logs[i].class === "client") {
        transformedData[timestamp][0] += 1;
      } else if (this.props.logs[i].class === "server") {
        transformedData[timestamp][1] += 1;
      } else if (this.props.logs[i].class === "request") {
        transformedData[timestamp][2] += 1;
      }
    }

    // creating last 30 min of data
    const tempDataClient = [];
    const tempDataServer = [];
    const tempDataRequests = [];
    const tempDataCPU = [];
    const tempDataMem = [];

    for (let i = 0; i < tempTimes.length; i++) {
      if (!transformedData[tempTimes[i]]) {
        tempDataClient.push(0);
        tempDataServer.push(0);
        tempDataRequests.push(0);
      } else {
        tempDataClient.push(transformedData[tempTimes[i]][0]);
        tempDataServer.push(transformedData[tempTimes[i]][1]);
        tempDataRequests.push(transformedData[tempTimes[i]][2]);
      }

      tempDataCPU.push(0);
      tempDataMem.push(0);
    }

    // update state
    this.setState(
      {
        times: tempTimes,
        dataClient: tempDataClient,
        dataServer: tempDataServer,
        dataRequests: tempDataRequests,
        dataCPU: tempDataCPU,
        dataMem: tempDataMem,
        aggdata: transformedData,
        cursorLogs: this.props.logs.length,
      },
      () => {
        this.createGraphs();
      }
    );
  }

  updateData() {
    // get current timestamp
    const currentTimeUnrounded = new Date(
      new Date().toISOString().split("T").join(" ")
        .slice(0, -1)
    );
    const currentTime = new Date(Math.floor(currentTimeUnrounded.getTime() / this.state.coeff) * this.state.coeff);

    const {
      times,
      dataClient,
      dataServer,
      dataRequests,
      dataCPU,
      dataMem,
      aggdata,
      cpuTotal,
      memTotal,
      hardwareCount
    } = this.state;

    // const times = this.state.times;
    const lastTime = times[times.length - 1];

    // console.log('logs: ', this.props.logs);

    // const dataClient = this.state.dataClient;
    // const dataServer = this.state.dataServer;
    // const dataRequests = this.state.dataRequests;
    // const dataCPU = this.state.dataCPU;
    // const dataMem = this.state.dataMem;

    // const aggdata = this.state.aggdata;

    // const cpuTotal = this.state.cpuTotal;
    // const memTotal = this.state.memTotal;
    // const hardwareCount = this.state.hardwareCount;

    // sort reverse
    const logsCopy = [...this.props.logs];

    logsCopy.sort((a, b) => {
      const hourA = `${replaceGlobally(
        a.timestamp.slice(-12),
        ':',
        ''
      )}`;
      const hourB = `${replaceGlobally(
        b.timestamp.slice(-12),
        ':',
        ''
      )}`;
      return hourA - hourB;
    });

    console.log('logsCopy: ', logsCopy);

    // get latest logs
    for (let i = this.state.cursorLogs; i < logsCopy.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(logsCopy[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );

      if (!aggdata[timestamp]) {
        // client, server, request, cpu, mem, totalcpu, totalmem, hardware count
        aggdata[timestamp] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      if (logsCopy[i].class === "client") {
        aggdata[timestamp][0] += 1;
      } else if (logsCopy[i].class === "server") {
        aggdata[timestamp][1] += 1;
      } else if (logsCopy[i].class === "request") {
        aggdata[timestamp][2] += 1;
      }
    }

    // get latest hardware info
    for (let i = this.state.cursorHardware; i < this.props.hardwareInfo.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(this.props.hardwareInfo[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );

      if (!aggdata[timestamp]) {
        // client, server, request, cpu, mem, totalcpu, totalmem, hardware count
        aggdata[timestamp] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      aggdata[timestamp][5] += this.props.hardwareInfo[i].cpuUsage;
      aggdata[timestamp][6] += this.props.hardwareInfo[i].memPercent;
      aggdata[timestamp][7] += 1;
      aggdata[timestamp][3] = aggdata[timestamp][5] / aggdata[timestamp][7];
      aggdata[timestamp][4] = aggdata[timestamp][6] / aggdata[timestamp][7];
    }

    // compare if another minute has passed yet
    // TODO: refactor, see if there's a better way than regenerating
    if (currentTime > lastTime) {
      times.push(currentTime);
      times.shift();

      if (!aggdata[currentTime]) {
        dataClient.push(0);
        dataServer.push(0);
        dataRequests.push(0);
        dataCPU.push(0);
        dataMem.push(0);
      } else {
        dataClient.push(aggdata[currentTime][0]);
        dataServer.push(aggdata[currentTime][1]);
        dataRequests.push(aggdata[currentTime][2]);
        dataCPU.push(aggdata[currentTime][3]);
        dataMem.push(aggdata[currentTime][4]);
      }

      dataClient.shift();
      dataServer.shift();
      dataRequests.shift();
      dataCPU.shift();
      dataMem.shift();
    } else if (aggdata[lastTime]) {
      dataClient[dataClient.length - 1] = aggdata[lastTime][0];
      dataServer[dataServer.length - 1] = aggdata[lastTime][1];
      dataRequests[dataRequests.length - 1] = aggdata[lastTime][2];
      dataCPU[dataCPU.length - 1] = aggdata[lastTime][3];
      dataMem[dataMem.length - 1] = aggdata[lastTime][4];
    }

    // console.log('transformedData: ', transformedData);

    // update state
    this.setState(
      {
        times,
        dataClient,
        dataServer,
        dataRequests,
        dataCPU,
        dataMem,
        aggdata,
        cursorLogs: logsCopy.length,
        cursorHardware: this.props.hardwareInfo.length,
      },
      () => {
        this.logsChart.update();
        this.CPUChart.update();
      }
    );
  }

  createGraphs() {
    const ctxlogs = document.getElementById("logs-graph").getContext("2d");

    this.logsChart = new Chart(ctxlogs, {
      type: "line",
      data: {
        labels: this.state.times,
        datasets: [
          {
            label: "Client",
            backgroundColor: "#f9aeae62",
            borderColor: "#FF6384",
            data: this.state.dataClient,
          },
          {
            label: "Server",
            backgroundColor: "#99ccff",
            borderColor: "#3399ff",
            data: this.state.dataServer,
          },
          {
            label: "Requests",
            backgroundColor: "#ffeecc",
            borderColor: "#ffcc66",
            data: this.state.dataRequests,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
            },
          ],
        },
        animation: {
          duration: 0,
        },
        title: {
          display: true,
          position: "top",
          text: "Logs and Requests in the Last 30 Minutes (UTC)",
          fontSize: 20,
        },
      },
    });

    const ctxcpu = document.getElementById("cpu-graph").getContext("2d");

    this.CPUChart = new Chart(ctxcpu, {
      type: "line",
      data: {
        labels: this.state.times,
        datasets: [
          {
            label: "CPU",
            backgroundColor: "#f9aeae62",
            borderColor: "#FF6384",
            data: this.state.dataCPU,
          },
          {
            label: "Memory",
            backgroundColor: "#99ccff",
            borderColor: "#3399ff",
            data: this.state.dataMem,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
            },
          ],
          yAxes: [
            {
              min: 0,
              max: 1
            }
          ]
        },
        animation: {
          duration: 0,
        },
        title: {
          display: true,
          position: "top",
          text: "CPU and Memory Usage in the Last 30 Minutes (UTC)",
          fontSize: 20,
        },
      },
    });
  }

  render() {
    return (
      <div className="dashboard">
        <div className="graph">
          <canvas id="logs-graph" />
        </div>
        <div className="graph">
          <canvas id="cpu-graph" />
        </div>
      </div>
    );
  }
}

export default Dashboard;
