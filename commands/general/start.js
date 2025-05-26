module.exports = {
    name: 'start',
    isAdmin: false,

    async execute(bot, msg, options) {
        bot.sendMessage(msg.chat.id, options, 'Telegram Bot sudah aktif! Handler dibuat oleh Shirayuki.');
    }
};
