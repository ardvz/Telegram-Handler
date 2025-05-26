module.exports = {
    name: 'whoami',
    isAdmin: false,

    async execute(bot, msg, options) {
        const userId = msg.from.id;
        const username = msg.from.username ? `@${msg.from.username}` : null;
        const firstName = msg.from.first_name || '';
        const lastName = msg.from.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        const reply =
            `<strong>INFO USER</strong>\n` +
            `- <strong>Name :</strong> ${fullName}\n` +
            `- <strong>Username :</strong> ${username}\n` +
            `- <strong>ID Telegram :</strong> ${userId}`;

        await bot.sendMessage(msg.chat.id, reply, options);
    }
};
