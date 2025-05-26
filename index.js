const TelegramBot = require('node-telegram-bot-api');
const { handleEvents } = require('./handler/handleEvents');
const { handleCommands } = require('./handler/handleCommands');
const config = require('./config');
const chalk = require('chalk');
const connectDB = require('./database/connect');

const bot = new TelegramBot(config.client.token, { polling: true });

connectDB();
handleEvents(bot);
handleCommands(bot);

bot.on('polling_error', (error) => { console.log(chalk.yellowBright.bold('POLLING  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(error.message)); });
bot.on('webhook_error', (error) => { console.log(chalk.yellowBright.bold('WEBHOOK  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(error.message)); });

bot.getMe().then(botInfo => {
    console.log(chalk.yellowBright.bold('CLIENT   '), chalk.white('-'), chalk.gray(`Successfully logged in to the client named`), chalk.greenBright(botInfo.first_name));
}).catch(err => {
    console.log(chalk.yellowBright.bold('CLIENT   '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`Failed to retrieve running bot data`));
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(reason));
});

process.on('rejectionHandled', (promise) => {
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(promise));
});

process.on('uncaughtException', (err) => {
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(err));
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(err));
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(origin));
});

process.on('warning', (warning) => {
    console.log(chalk.yellowBright.bold('ANTICRASH'), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(warning.message));
});