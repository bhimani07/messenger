const Sequelize = require("sequelize");

const dbHost = process.env.POSTGRES_HOST;
const dbPort = process.env.POSTGRES_PORT;
const dbUserName = process.env.POSTGRES_USERNAME;
const dbPassword = process.env.POSTGRES_PASSWORD;

const db = new Sequelize(process.env.DATABASE_URL || `postgres://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/messenger`, {
  logging: false
});

module.exports = db;
