require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

// 以下は変更なし
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`${commands.length} 個のアプリケーションコマンドを登録します。`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
    } catch (error) {
        console.error(error);
    }
})();

