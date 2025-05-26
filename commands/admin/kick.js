module.exports = {
    name: 'kick',
    isAdmin: true, // Seting id admin / owner di config.js

    async execute(bot, msg, options) {
        bot.sendMessage(msg.chat.id, 'Telegram Bot sudah aktif! Handler dibuat oleh Shirayuki.', options);
    }
}