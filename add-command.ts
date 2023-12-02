import fs = require("fs");
import { REST, Routes } from 'discord.js';

require('dotenv').config();

const GUILD_ID = process.env.GUILD_ID || "11111111";
const CLIENT_ID = process.env.CLIENT_ID || "22222222";

const adminCommandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".ts"));
const adminCommands: any[] = [];
const commands: any[] = [];

const TOKEN = process.env.TOKEN || 'aaaaaaaaa';

const rest = new REST({ version: '10' }).setToken(TOKEN);

for (const file of adminCommandFiles) {//GuildCommandをJSON化
    const command = require(`./commands/${file}`);
    adminCommands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log(`${adminCommands.length}個のコマンドを読み込み中`);
        const adminData = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: adminCommands },
        );
        console.log(`[GuildCommand]個のコマンドを読み込み完了`);

    } catch (error) {
        console.error(error);
    }
})();