const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 3002; // Ensure this port matches your PM2 ecosystem config if needed

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const payload = req.body;

  // Simple validation to ensure it's a GitHub push event
  if (payload.ref === 'refs/heads/main') {
    exec('powershell.exe -File D:/Aka/TutaProd/deploy.ps1', (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return res.status(500).send('Server error');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).send('Deployment script executed');
    });
  } else {
    res.status(400).send('Not a valid push event');
  }
});

app.listen(port, () => {
  console.log(`Webhook listener running on port ${port}`);
});
