const {Client, GatewayIntentBits} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const {errorReply} = require("./utils/reply");

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command
}

client.once("ready", async () => {
    const data = []
    for (const commandName in commands) {
        data.push(commands[commandName].data)
    }
    await client.application.commands.set(data, process.env.SERVER_ID);
    console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN).then();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    try {
        const command = commands[interaction.commandName];
        await command.execute(interaction);
    } catch (e) {
        await errorReply(interaction, e);
    }
});