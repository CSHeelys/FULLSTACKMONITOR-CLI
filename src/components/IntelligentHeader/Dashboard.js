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
      cursor: 0,
    };

    this.updateData = this.updateData.bind(this);
    this.createGraph = this.createGraph.bind(this);
  }

  componentDidMount() {
    // TODO: make dynamically generating
    // setInterval(this.updateData, 120000);
    this.updateData();
  }

  updateData() {
    // set times to be current minute minus 30
    // TODO: see if there's a better way than regenerating
    const tempTimes = [];
    const currentTimeUnrounded = new Date(new Date().toISOString().split('T').join(' ')
      .slice(0, -1));
    const coeff = 1000 * 60 * 1;
    let currentTime = new Date(Math.floor(currentTimeUnrounded.getTime() / coeff) * coeff);

    for (let i = 0; i < 30; i++) {
      tempTimes.unshift(currentTime);
      currentTime = new Date(currentTime.getTime() - coeff);
    }

    // console.log('temptimes: ', tempTimes);

    // aggregating log data
    // TODO: feature for CPU / memory use
    const transformedData = {};

    for (let i = this.state.cursor; i < this.props.logs.length - 1; i++) {
      const timestamp = new Date(Math.floor(new Date(this.props.logs[i].timestamp.replace(" - ", " ")).getTime() / coeff) * coeff);
      if (!transformedData[timestamp]) {
        transformedData[timestamp] = [0, 0, 0];
      }

      if (this.props.logs[i].class === 'client') {
        transformedData[timestamp][0] += 1;
      } else if (this.props.logs[i].class === 'server') {
        transformedData[timestamp][1] += 1;
      } else if (this.props.logs[i].class === 'request') {
        transformedData[timestamp][2] += 1;
      }
    }

    // creating last 30 min of data
    const tempDataClient = []; // this.state.dataClient;
    const tempDataServer = []; // this.state.dataServer;
    const tempDataRequests = []; // this.state.dataRequests;

    for (let i = 0; i < tempTimes.length - 1; i++) {
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
    this.setState({
      times: tempTimes,
      dataClient: tempDataClient,
      dataServer: tempDataServer,
      dataRequests: tempDataRequests,
      cursor: this.props.logs.length,
    }, () => { this.createGraph(); });
  }

  createGraph() {
    const ctx = document.getElementById("line-graph").getContext("2d");

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.state.times,
        datasets: [{
          label: 'Client',
          backgroundColor: '#f9aeae62',
          borderColor: '#FF6384',
          data: this.state.dataClient,
        }, {
          label: 'Server',
          backgroundColor: '#99ccff',
          borderColor: '#3399ff',
          data: this.state.dataServer,
        }, {
          label: 'Requests',
          backgroundColor: '#ffeecc',
          borderColor: '#ffcc66',
          data: this.state.dataRequests,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time'
          }],
        },
        animation: {
          duration: 0,
        },
        title: {
          display: true,
          position: 'top',
          text: 'Logs and Requests in the Last 30 Minutes',
          fontSize: 20
        },
      }
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
