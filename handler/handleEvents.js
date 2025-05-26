const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function handleEvents(bot) {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const eventName = file.split('.js')[0];
            const eventHandler = require(path.join(eventsPath, file));

            console.log(chalk.yellowBright.bold('HANDLER  '), chalk.white('-'), chalk.gray(`Successfully loaded event named`), chalk.greenBright(file));
            bot.on(eventName, (...args) => eventHandler(bot, ...args));
        } catch (err) {
            console.log(chalk.yellowBright.bold('HANDLER  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`Failed to load event named`), chalk.greenBright(file));
        }
    }

    return eventFiles.map(f => f.split('.js')[0]);
}

module.exports = { handleEvents };
