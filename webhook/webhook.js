const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.WH_PORT || 3002;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const branch = req.body.ref.split('/').pop();
  console.log(`Received push event for branch: ${branch}`);

  let deployCommand;
  let args;

  if (branch === 'dev') {
    deployCommand = 'sh';
    args = ['-c', `
      cd /mnt/d/Linux/Aka/Tuta &&
      git pull origin dev &&
      npm install &&
      (pm2 reload ecosystem.config.js --env uat || (sleep 6 && pm2 reload ecosystem.config.js --env uat --force)) &&
      pm2 save
    `];
  } else if (branch === 'uat') {
    deployCommand = 'pm2';
    args = ['deploy', 'ecosystem.config.js', 'prod'];
  } else {
    console.log('No deployment triggered for this branch');
    return res.status(200).send('No deployment triggered');
  }

  console.log(`Executing deployment command: ${deployCommand} ${args.join(' ')}`);

  const deployProcess = spawn(deployCommand, args, { shell: true });

  let stdoutData = '';
  let stderrData = '';

  deployProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  deployProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  deployProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`Deployment successful\nstdout: ${stdoutData}\nstderr: ${stderrData}`);
      res.status(200).send('Deployment successful');
    } else {
      console.error(`Deployment failed with code ${code}\nstderr: ${stderrData}`);
      res.status(500).send('Deployment failed');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});
