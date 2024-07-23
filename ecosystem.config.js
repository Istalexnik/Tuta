const appName = 'Tuta';
const appEnv = process.env.NODE_ENV || process.env.APP_ENV || 'dev';

// Define the environments with the correct SV_PORT for each
const environments = {
  dev: {
    NODE_ENV: 'dev',
    DB_HOST: process.env.DEV_DB_HOST || 'localhost',
    DB_PORT: process.env.DEV_DB_PORT || 5432,
    DB_USER: process.env.DEV_DB_USER || 'myuser',
    DB_PASS: process.env.DEV_DB_PASS || 'mypassword',
    DB_NAME: process.env.DEV_DB_NAME || 'mydatabase',
    SV_PORT: 2000,
    watch: true,  // Enable watching
  },
  uat: {
    NODE_ENV: 'uat',
    DB_HOST: process.env.UAT_DB_HOST || 'localhost',
    DB_PORT: process.env.UAT_DB_PORT || 5432,
    DB_USER: process.env.UAT_DB_USER || 'myuser',
    DB_PASS: process.env.UAT_DB_PASS || 'mypassword',
    DB_NAME: process.env.UAT_DB_NAME || 'mydatabase',
    SV_PORT: 2002,
    watch: false,
  },
  prod: {
    NODE_ENV: 'prod',
    DB_HOST: process.env.PROD_DB_HOST || 'localhost',
    DB_PORT: process.env.PROD_DB_PORT || 5432,
    DB_USER: process.env.PROD_DB_USER || 'myuser',
    DB_PASS: process.env.PROD_DB_PASS || 'mypassword',
    DB_NAME: process.env.PROD_DB_NAME || 'mydatabase',
    SV_PORT: 2005,
    watch: false,
  },
};

module.exports = {
  apps: [
  name: appName,
  script: 'server.js',
  exec_mode: 'cluster',
  instances: 1,
  watch: environments[appEnv].watch,  // Use the correct watch setting based on the environment
  ignore_watch: ['**/node_modules', '**/.git', '**/logs'], 
  log_date_format: 'YYYY-MM-DD HH:mm:ss',
  log_file: 'logs/combined.log',
  out_file: 'logs/out.log',
  error_file: 'logs/err.log',
  env: environments[appEnv], // Use the correct environment configuration based on appEnv
],

  deploy: {
    uat: {
      user: 'istalexnik',
      host: '172.23.187.82',
      ref: 'origin/dev',
      repo: `git@github.com:Istalexnik/${appName}.git`,
      path: `/mnt/d/Linux/Aka/${appName}`,
      'pre-setup': 'echo "This is the local pre-setup command"',
      'pre-deploy-local': "echo 'This is a local executed command'",
      'pre-deploy': `cd /mnt/d/Linux/Aka/${appName} && git fetch origin dev && git reset --hard origin/dev && git clean -fd`,
      'post-deploy': `cd /mnt/d/Linux/Aka/${appName} && npm install && pm2 reload ecosystem.config.js --env uat && pm2 save && echo "Deployment to UAT complete"`,
      env: environments.uat,
    },
    prod: {
      user: 'istalexnik',
      host: '8.tcp.ngrok.io',
	  port: '16266',
      ref: 'origin/uat',
      repo: `git@github.com:Istalexnik/${appName}.git`,
      path: `/mnt/d/Linux/Aka/${appName}`,
      'pre-setup': 'echo "This is the local pre-setup command"',
      'pre-deploy-local': "echo 'This is a local executed command'",
      'pre-deploy': `cd /mnt/d/Linux/Aka/${appName} && git fetch origin uat && git reset --hard origin/uat && git clean -fd`,
      'post-deploy': `cd /mnt/d/Linux/Aka/${appName} && npm install && pm2 reload ecosystem.config.js --env prod && pm2 save && echo "Deployment to PROD complete"`,
      env: environments.prod,
    },
  },
}