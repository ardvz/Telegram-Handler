const mongoose = require('mongoose');
const config = require('../config');
const chalk = require('chalk');

async function connectDB() {
    try {
        await mongoose.connect(config.database.mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(chalk.yellowBright.bold('DATABASE '), chalk.white('-'), chalk.gray(`Successfully connected client to`), chalk.greenBright(`Mongo Database`));
    } catch (error) {
        console.log(chalk.yellowBright.bold('DATABASE '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`Failed to connect client to`), chalk.greenBright(`Mongo Database`));
    }
}

module.exports = connectDB;