#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
const { http } = require('../config');
// const path = require('path');
// const { spawn } = require('child_process');
const args = process.argv.slice(2);

console.log('launch');

if (args.some((x) => x === '--help' || x === '--h')) {
  console.log(
    `The server runs on port 3861 by default.
    
    To log monitoring data on the server, you must install fullstack-monitor on one of your projects, using:
    
    npm install fullstack-monitor
    
    Then when you run that project and the fullstack-monitor-cli server at the same time, logging and request
    data will be stored on the fullstack-monitor-cli server, and viewable on the fullstack-monitor-cli clients.
    `
  );
}
if (args.some((x) => x === '--tutorial' || x === '--t')) {
  console.log(
    `- The basics -
    1. First start the server.
    2. Then listen to the server in the terminal.
    3. And/or listen to the server in the chrome browser.
    4. Then when you are done kill the server.

    fullstack-monitor-cli --start
    fullstack-monitor-cli --listen
    fullstack-monitor-cli --chrome
    fullstack-monitor-cli --kill

    - Start the server and listen in one command -
    1. Run the --start-listen command.

    fullstack-monitor-cli --start-listen
    OR
    fullstack-monitor-cli -sl`
  );
}

if (args.some((x) => x === '--listen' || x === '--l' || x === '--sl')) {
  console.log('listening');
  const cmdApp = require('../server/cmdApp/cmd');
  const server = require('../server/index');
// } else if (args.some((x) => x === '--k')) {
//   console.log('closed');
//   http.close();
} else if (args.some((x) => x === '--start' || x === '--s')) {
  console.log('not listening');
  const server = require('../server/index');
} else {
  console.log(`Usage: fullstack-monitor-cli [options]

  Options:

    -h, --help                        Output usage information
    -t, --tutorial                    View a brief tutorial
    -s, --start                       Start the server
    -l, --listen                      Listen to the traffic in the terminal
    -c, --chrome                      Listen to the traffic in the chrome
    -k, --kill                        Kill the server
    -r, --restart                     Restart the server
    -st, --status                     Check the server status
    -sl, --start-listen               Start the server and listen in the terminal
    -slc, --start-listen-chrome       Start the server and listen in the chrome browser
    -slb, --start-listen-both         Start the server and listen in the terminal and chrome browser
  `);
}

// pkill -f fullstack-monitor-cli
