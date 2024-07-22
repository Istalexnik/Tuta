// Define the environments with the correct configurations for each
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
    watch: false,  // Disable watching
  },
  prod: {
    NODE_ENV: 'prod',
    DB_HOST: process.env.PROD_DB_HOST || 'localhost',
    DB_PORT: process.env.PROD_DB_PORT || 5432,
    DB_USER: process.env.PROD_DB_USER || 'myuser',
    DB_PASS: process.env.PROD_DB_PASS || 'mypassword',
    DB_NAME: process.env.PROD_DB_NAME || 'mydatabase',
    SV_PORT: 2005,
    watch: false,  // Disable watching
  },
};

module.exports = {
  apps: [
    {
      name: 'Tuta',
      script: 'server.js',
      exec_mode: 'cluster',  // Cluster mode for multiple instances
      instances: 1,  // Number of instances to run
      watch: environments[process.env.NODE_ENV || 'dev'].watch,  // Watch files if enabled in environment config
      ignore_watch: ['node_modules', '.git', 'logs'],  // Directories to ignore
      log_date_format: 'YYYY-MM-DD HH:mm:ss',  // Log date format
      log_file: 'logs/combined.log',  // Combined log file
      out_file: 'logs/out.log',  // Out log file
      error_file: 'logs/err.log',  // Error log file
      env: environments.dev,  // Default environment settings
      env_uat: environments.uat,  // UAT environment settings
      env_prod: environments.prod,  // Production environment settings
    },
  ],
};
