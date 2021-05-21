const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
})

sequelize
    .authenticate()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error(`Unable to connect DB:`, err));

module.exports = sequelize