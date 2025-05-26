const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require('../config');

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
                    const commandKey = `${folder}/${file}`;
                    console.log(chalk.yellowBright.bold('COMMAND  '), chalk.white('-'), chalk.gray(`Successfully loaded command named`), chalk.greenBright(file));
                    commands.set(command.name.toLowerCase(), command);
                    loadedCommands.push(commandKey);
                }
            } catch (err) {
                console.log(chalk.yellowBright.bold('COMMAND  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`Failed to load command named`), chalk.greenBright(file));
            }
        }
    }

    bot.on('message', async (msg) => {
        if (!msg.text || !msg.text.startsWith('/')) return;

        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text.split(' ')[0];
        const commandName = text.slice(1).split('@')[0].toLowerCase();

        const command = commands.get(commandName);
        if (!command) {
            const sentMsg = await bot.sendMessage(chatId, 'Sepertinya tidak ada perintah yang kamu berikan.', { reply_to_message_id: msg.message_id });
            setTimeout(() => {
                bot.deleteMessage(chatId, sentMsg.message_id).catch(() => { });
            }, 10000); return;
        }

        if (command.isAdmin && userId !== config.client.owner) {
            const ownerMsg = await bot.sendMessage(chatId, 'Sepertinya perintah yang kamu jalankan hanya bisa digunakan oleh owner bot ini.', { reply_to_message_id: msg.message_id });
            setTimeout(() => {
                bot.deleteMessage(chatId, ownerMsg.message_id).catch(() => { });
            }, 10000); return;
        }

        try {
            await command.execute(bot, msg, { parse_mode: 'HTML', reply_to_message_id: msg.message_id });
        } catch (error) {
            console.log(chalk.yellowBright.bold('COMMAND  '), chalk.white('-'), chalk.bgRed('[ERROR]'), chalk.gray(`${command.name} - ${error.message}`));
            const errorMsg = await bot.sendMessage(chatId, 'Terjadi kesalahan saat mencoba menjalankan perintah yang kamu berikan.', { reply_to_message_id: msg.message_id });
             setTimeout(() => {
                bot.deleteMessage(chatId, errorMsg.message_id).catch(() => { });
            }, 10000); return;
        }
    });

    return loadedCommands;
}

module.exports = { handleCommands };
