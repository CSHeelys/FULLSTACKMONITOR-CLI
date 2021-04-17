/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
// import { render } from "enzyme";
import { Chart } from "chart.js";
import React, { Component } from "react";

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

    this.initializeData = this.initializeData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.createGraphs = this.createGraphs.bind(this);
  }

  componentDidMount() {
    this.initializeData();
    window.setInterval(this.updateData, 1000);
  }

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
    const currentTime = new Date(
      Math.floor(currentTimeUnrounded.getTime() / this.state.coeff)
        * this.state.coeff
    );

    const tempTimes = this.state.times;
    const lastTime = tempTimes[tempTimes.length - 1];

    const tempDataClient = this.state.dataClient;
    const tempDataServer = this.state.dataServer;
    const tempDataRequests = this.state.dataRequests;
    const tempDataCPU = this.state.dataCPU;
    const tempDataMem = this.state.dataMem;

    const transformedData = this.state.aggdata;

    const tempCPUTotal = this.state.cpuTotal;
    const tempMemTotal = this.state.memTotal;
    const tempHardwareCount = this.state.hardwareCount;

    // get latest logs
    for (let i = this.state.cursorLogs; i < this.props.logs.length; i++) {
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

    // get latest hardware info
    for (let i = this.state.cursorHardware; i < this.props.hardwareInfo.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(this.props.hardwareInfo[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );

      if (!transformedData[timestamp]) {
        // client, server, request, cpu, mem, totalcpu, totalmem, hardware count
        transformedData[timestamp] = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      console.log('cpu ', this.props.hardwareInfo[i].cpuUsage);
      console.log('mem ', this.props.hardwareInfo[i].memPercent);

      transformedData[timestamp][5] += this.props.hardwareInfo[i].cpuUsage;
      transformedData[timestamp][6] += this.props.hardwareInfo[i].memPercent;
      transformedData[timestamp][7] += 1;
      transformedData[timestamp][3] = transformedData[timestamp][5] / transformedData[timestamp][7];
      transformedData[timestamp][4] = transformedData[timestamp][6] / transformedData[timestamp][7];
    }

    // compare if another minute has passed yet
    // TODO: refactor, see if there's a better way than regenerating
    if (currentTime > lastTime) {
      tempTimes.push(currentTime);
      tempTimes.shift();

      if (!transformedData[currentTime]) {
        tempDataClient.push(0);
        tempDataServer.push(0);
        tempDataRequests.push(0);
        tempDataCPU.push(0);
        tempDataMem.push(0);
      } else {
        tempDataClient.push(transformedData[currentTime][0]);
        tempDataServer.push(transformedData[currentTime][1]);
        tempDataRequests.push(transformedData[currentTime][2]);
        tempDataCPU.push(transformedData[currentTime][3]);
        tempDataMem.push(transformedData[currentTime][4]);
      }

      tempDataClient.shift();
      tempDataServer.shift();
      tempDataRequests.shift();
      tempDataCPU.shift();
      tempDataMem.shift();
    } else if (transformedData[lastTime]) {
      tempDataClient[tempDataClient.length - 1] = transformedData[lastTime][0];
      tempDataServer[tempDataServer.length - 1] = transformedData[lastTime][1];
      tempDataRequests[tempDataRequests.length - 1] = transformedData[lastTime][2];
      tempDataCPU[tempDataCPU.length - 1] = transformedData[lastTime][3];
      tempDataMem[tempDataMem.length - 1] = transformedData[lastTime][4];
    }

    // console.log('transformedData: ', transformedData);

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
        cursorHardware: this.props.hardwareInfo.length,
      },
      () => {
        this.createGraphs();
      }
    );
  }

  createGraphs() {
    const ctx = document.getElementById("logs-graph").getContext("2d");

    const chart = new Chart(ctx, {
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

    const cty = document.getElementById("cpu-graph").getContext("2d");

    const charty = new Chart(cty, {
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
