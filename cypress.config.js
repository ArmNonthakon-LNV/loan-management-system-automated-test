const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();
const { recordTestEvident } = require('./cypress/tools/recordTestEvident');

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 90000,
  responseTimeout: 90000,
  e2e: {
    setupNodeEvents(on, config) {
      const ENV_CONFIG = config.env.configFile || process.env.ENV || "test";
      
      // อ่าน config จาก file (ไม่มี credentials database)
      var configure = getConfigurationByFile(ENV_CONFIG);

      // ใช้ ENV ในการเลือก suffix สำหรับตัวแปร .env (เช่น TEST, DEV)
      const envSuffix = ENV_CONFIG.toUpperCase();

      // ตรวจสอบ DB LNV credentials
      const dbLnvConfig = getLnvDbConfig();
      if (!dbLnvConfig.host || !dbLnvConfig.user || !dbLnvConfig.password) {
        console.warn(`⚠️  Missing DB_LNV credentials — queryDbLNV task will not work.`);
      }

      // อ่าน endpoint และ testedBy จาก .env หรือ config file
      const endpoint = process.env[`ENDPOINT_${envSuffix}`] || process.env.ENDPOINT || configure.env?.endPoint;
      const testedBy = process.env.TESTED_BY || '';

      // รวม configuration
      configure.env = {
        ...configure.env,
        ENV_CONFIG,
        ENV_SUFFIX: envSuffix,
        endPoint: endpoint,
        testedBy: testedBy,
        makerUsername: process.env.MAKER_USERNAME,
        makerPassword: process.env.MAKER_PASSWORD,
        checkerUsername: process.env.CHECKER_USERNAME,
        checkerPassword: process.env.CHECKER_PASSWORD
      };

      config = { ...config, ...configure };

      // สร้าง Excel reporter สำหรับบันทึกผล validation ลงไฟล์ evident-*.xlsx
      const excelReporter = recordTestEvident({
        reportDir: path.join(process.cwd(), 'cypress', 'reports', 'evidents'),
      });

      // Reset version tracking เมื่อเริ่ม run ใหม่
      on('before:run', () => {
        excelReporter.reset();
      });

      on('task', {
        queryDbLNV(query) {
          return dbLnv(query)
        },
        appendToValidationErrorReport(payload) {
          if (!payload || typeof payload.testTitle !== 'string') return null;
          excelReporter.append(payload);
          return null
        }
      })
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: "other/path/to/**/*.js",
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: false,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },
    video: true,
    videosFolder: 'cypress/results',
  }
});

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress", "config", `${file}.json`);
  if (!fs.existsSync(pathToConfigFile)) {
    return {};
  }
  return fs.readJSONSync(pathToConfigFile);
}

function getLnvDbConfig() {
  return {
    host: process.env.DB_LNV_HOST,
    user: process.env.DB_LNV_USER,
    password: process.env.DB_LNV_PASSWORD,
    port: parseInt(process.env.DB_LNV_PORT) || 5434,
    database: process.env.DB_LNV_NAME,
    schema: process.env.DB_LNV_SCHEMA_NAME
  };
}

function dbLnv(query) {
  const config = getLnvDbConfig();
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  return client.connect()
    .then(() => {
      return client.query(`SET search_path TO "${config.schema}"`);
    })
    .then(() => {
      return client.query(query);
    })
    .then((result) => {
      client.end();
      return result.rows;
    })
    .catch((error) => {
      client.end();
      throw error;
    });
}
