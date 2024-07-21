const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.WH_PORT || 3002;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const branch = req.body.ref.split('/').pop();
  console.log(`Received push event for branch: ${branch}`);

  let deployCommand;

  if (branch === 'dev') {
    deployCommand = `
      cd /mnt/d/Linux/Aka/Tuta &&
      git pull origin dev &&
      npm install &&
      pm2 reload ecosystem.config.js --env uat &&
      pm2 save
    `;
  } else if (branch === 'uat') {
    deployCommand = 'pm2 deploy ecosystem.config.js prod';
  } else {
    console.log('No deployment triggered for this branch');
    return res.status(200).send('No deployment triggered');
  }

  console.log(`Executing deployment command: ${deployCommand}`);
  
  // Send response before executing the command
  res.status(200).send('Deployment started');

  exec(deployCommand, (error, stdout, stderr) => {
    console.log(`Deployment stdout: ${stdout}`);

    if (error) {
      console.error(`Deployment error: ${error.message}`);
      console.error(`stderr: ${stderr}`);
    } else {
      console.log('Deployment completed successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});
