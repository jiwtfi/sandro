const { exec } = require('child_process');

const deployProcess = exec('firebase deploy --only functions');

deployProcess.stdout.pipe(process.stdout);
deployProcess.stderr.pipe(process.stderr);