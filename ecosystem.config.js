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
    watch: ['Tuta'],
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

// Common application configuration for Tuta
const tutaConfig = {
  name: 'Tuta',
  script: 'server.js',
  exec_mode: 'cluster',
  instances: 1,
  ignore_watch: ['node_modules', '.git', 'logs'],
  log_date_format: 'YYYY-MM-DD HH:mm:ss',
  log_file: 'logs/combined.log',
  out_file: 'logs/out.log',
  error_file: 'logs/err.log',
  env: environments[appEnv], // Use the correct environment configuration based on appEnv
};

// Webhook configuration for UAT and production environments
const webhookConfig = {
  name: 'webhook',
  script: 'webhook/webhook.js',
  instances: 1,
  exec_mode: 'fork',
  watch: false,
  log_file: 'logs/webhook/combined.log',
  out_file: 'logs/webhook/out.log',
  error_file: 'logs/webhook/err.log',
  env: {
    NODE_ENV: appEnv,
    WH_PORT: process.env.WH_PORT || 3002,
  },
};

module.exports = {
  apps: [
    tutaConfig,
    webhookConfig,
  ],

  deploy: {
    uat: {
      user: 'node',
      host: 'uat-server',
      ref: 'origin/dev',
      repo: 'git@github.com:yourusername/yourrepo.git',
      path: '/var/www/yourapp',
      'post-deploy': `
        cd /mnt/d/Linux/Aka/Tuta &&
        npm install &&
        pm2 reload ecosystem.config.js --env uat &&
        pm2 save
      `,
      env: environments.uat,
    },
    prod: {
      user: 'node',
      host: 'prod-server',
      ref: 'origin/uat',
      repo: 'git@github.com:yourusername/yourrepo.git',
      path: '/var/www/yourapp',
      'post-deploy': `
        cd /var/www/yourapp/current &&
        npm install &&
        pm2 reload ecosystem.config.js --env prod &&
        pm2 save
      `,
      env: environments.prod,
    },
  },
};
