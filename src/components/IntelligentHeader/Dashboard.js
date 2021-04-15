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
    // setInterval(this.updateData, 10000);
    this.updateData();

    console.log('logs: ', this.props.logs);
  }

  updateData() {
    const transformedData = {};
    let minTime = '';
    let maxTime = '';
    const tempTimes = this.state.times;
    const tempDataClient = this.state.dataClient;
    const tempDataServer = this.state.dataServer;
    const tempDataRequests = this.state.dataRequests;

    // this.state.logs[0].timestamp.substring(13, 18)

    // get starting time
    if (this.state.times === []) {
      minTime = new Date(this.state.logs[0].timestamp.replace(" - ", " "));
      transformedData[minTime] = [0, 0, 0];
    }

    maxTime = this.props.logs[this.props.logs.length - 1].timestamp.substring(13, 18);

    // aggregate data
    for (let i = this.state.cursor; i < this.props.logs.length - 1; i++) {
      const timestamp = new Date(this.props.logs[i].timestamp.replace(" - ", " "));
      console.log('time: ', timestamp);
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

    console.log('transformed data: ', transformedData);

    // update into intervals
    // for (let i = 0, i < maxTime; i++) {

    // }

    this.setState({
      times: tempTimes.concat(Object.keys(transformedData)),
      dataClient: tempDataClient.concat(Object.values(transformedData).map((el) => el[0])),
      dataServer: tempDataServer.concat(Object.values(transformedData).map((el) => el[1])),
      dataRequests: tempDataRequests.concat(Object.values(transformedData).map((el) => el[2])),
      // cursor: this.props.logs.length - 1,
    }, () => { this.createGraph(); });
  }

  createGraph() {
    const ctx = document.getElementById("line-graph").getContext("2d");

    console.log('state: ', this.state);

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
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date",
            }
          }],
        },
        animation: {
          duration: 0, // general animation time
        },
      }
    });
  }

  render() {
    return (
      <div>
        <canvas id="line-graph" />
      </div>
    );
  }
}

export default Dashboard;
