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
      aggdata: {},
      cursor: 0,
      coeff: 60000,
    };

    this.initializeData = this.initializeData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.createGraph = this.createGraph.bind(this);
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
    // TODO: feature for CPU / memory use
    const transformedData = {};

    for (let i = 0; i < this.props.logs.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(this.props.logs[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );
      if (!transformedData[timestamp]) {
        transformedData[timestamp] = [0, 0, 0];
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
    // const tempCPUUsage = [];

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
    }

    // update state
    this.setState(
      {
        times: tempTimes,
        dataClient: tempDataClient,
        dataServer: tempDataServer,
        dataRequests: tempDataRequests,
        aggdata: transformedData,
        cursor: this.props.logs.length,
      },
      () => {
        this.createGraph();
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

    const transformedData = this.state.aggdata;

    // get latest logs
    for (let i = this.state.cursor; i < this.props.logs.length; i++) {
      const timestamp = new Date(
        Math.floor(
          new Date(this.props.logs[i].timestamp.replace(" - ", " ")).getTime()
            / this.state.coeff
        ) * this.state.coeff
      );

      if (!transformedData[timestamp]) {
        transformedData[timestamp] = [0, 0, 0];
      }

      if (this.props.logs[i].class === "client") {
        transformedData[timestamp][0] += 1;
      } else if (this.props.logs[i].class === "server") {
        transformedData[timestamp][1] += 1;
      } else if (this.props.logs[i].class === "request") {
        transformedData[timestamp][2] += 1;
      }
    }

    // compare if another minute has passed yet
    // TODO: see if there's a better way than regenerating
    if (currentTime > lastTime) {
      tempTimes.push(currentTime);
      tempTimes.shift();

      if (!transformedData[currentTime]) {
        tempDataClient.push(0);
        tempDataServer.push(0);
        tempDataRequests.push(0);
      } else {
        tempDataClient.push(transformedData[currentTime][0]);
        tempDataServer.push(transformedData[currentTime][1]);
        tempDataRequests.push(transformedData[currentTime][2]);
      }

      tempDataClient.shift();
      tempDataServer.shift();
      tempDataRequests.shift();
    } else if (transformedData[lastTime]) {
      tempDataClient[tempDataClient.length - 1] = transformedData[lastTime][0];
      tempDataServer[tempDataServer.length - 1] = transformedData[lastTime][1];
      tempDataRequests[tempDataRequests.length - 1] = transformedData[lastTime][2];
    }

    // update state
    this.setState(
      {
        times: tempTimes,
        dataClient: tempDataClient,
        dataServer: tempDataServer,
        dataRequests: tempDataRequests,
        aggdata: transformedData,
        cursor: this.props.logs.length,
      },
      () => {
        this.createGraph();
      }
    );
  }

  createGraph() {
    const ctx = document.getElementById("line-graph").getContext("2d");

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
          text: "Logs and Requests in the Last 30 Minutes",
          fontSize: 20,
        },
      },
    });
  }

  render() {
    return (
      <div className="dashboard">
        <canvas id="line-graph" />
      </div>
    );
  }
}

export default Dashboard;
