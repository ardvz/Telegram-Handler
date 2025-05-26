const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function handleCommands(bot) {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(commandsPath).filter(folder => {
        return fs.statSync(path.join(commandsPath, folder)).isDirectory();
    });

    const commands = new Map();
    const loadedCommands = [];

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(path.join(folderPath, file));
                if (command.name && typeof command.execute === 'function') {
                    const commandKey = `${folder}/${file}`
                    console.log(chalk.yellowBright.bold('COMMAND  '), chalk.white('-'), chalk.gray(`Successfully loaded command named`), chalk.greenBright(file));
                    commands.set(command.name.toLowerCase(), command.execute);
                    loadedCommands.push(commandKey);
                }
            } catch (err) {
                console.log(chalk.yellowBright.bold('COMMAND  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`Failed to load command named`), chalk.greenBright(file));
            }
        }
    }

    bot.on('message', (msg) => {
        if (!msg.text || !msg.text.startsWith('/')) return;

        const chatId = msg.chat.id;
        const commandName = msg.text.split(' ')[0].slice(1).toLowerCase();

        if (commands.has(commandName)) {
            try {
                commands.get(commandName)(bot, msg, { reply_to_message_id: msg.message_id });
            } catch (error) {
                bot.sendMessage(chatId, 'Terjadi kesalahan saat menjalankan perintah.', { reply_to_message_id: msg.message_id });
                console.log(chalk.yellowBright.bold('COMMAND '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray.bgWhite(error));
            }
        } else {
            bot.sendMessage(chatId, `Perintah /${commandName} tidak dikenali.`, { reply_to_message_id: msg.message_id });
        }
    });

    return loadedCommands;
}

module.exports = { handleCommands };
