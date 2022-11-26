const {Client, GatewayIntentBits, Collection, Events} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const {errorReply} = require("./utils/reply");
const path = require("path");

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once(Events.ClientReady, c => {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        await errorReply(interaction, e);
    }
});

client.login(process.env.DISCORD_TOKEN).then();