// import { render } from "enzyme";
import { Chart } from "chart.js";
import React, { Component } from "react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };

    this.aggregateData = this.aggregateData.bind(this);
    this.createGraph = this.createGraph.bind(this);
  }

  componentDidMount() {
    this.aggregateData();
    this.createGraph();

    console.log('logs: ', this.props.logs);
  }

  aggregateData() {
    const transformedData = {};

    this.props.logs.forEach((data) => {
      if (!transformedData[data.timestamp]) {
        transformedData[data.timestamp] = 1;
      } else {
        transformedData[data.timestamp] += 1;
      }
    });

    this.setState({
      data: transformedData,
    });

    console.log('transformed data: ', transformedData);
  }

  createGraph() {
    const ctx = document.getElementById("line-graph").getContext("2d");

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Time'],
        datasets: [{
          label: 'Logs',
          backgroundColor: '#f9aeae62',
          borderColor: '#FF6384',
          data: this.state.data,
        }]
      },
      options: {}
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
