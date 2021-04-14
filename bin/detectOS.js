#!/usr/bin/env node

const { spawn } = require('child_process');

if (process.platform !== 'win32') {
  const shell = spawn(`bin/startApp`, [process.argv.slice(2)], { stdio: 'inherit' });
  shell.on('close', (code) => { console.log('[shell] terminated :', code); });
} else {
  require('./launch');
}