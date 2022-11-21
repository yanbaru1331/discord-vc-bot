const {Client, GatewayIntentBits, SlashCommandBuilder} = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.once("ready", async () => {
    const data = new SlashCommandBuilder()
        .setName("move")
        .setDescription("メンバーを指定してvcチャンネルを移動します。")
        .addMentionableOption(option => option
            .setName("移動するメンバー")
            .setDescription("移動するメンバーの名前（例. @VCチャンネル移動bot）")
        ).addChannelOption(option => option
            .setName("移動するチャンネル")
            .setDescription("移動するチャンネルの名称（例. 一般）")
        );

    await client.application.commands.set([data], process.env.SERVER_ID);
    console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN).then();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "move") {
        const memberId = interaction.options.getMentionable("移動するメンバー");
        const channelId = interaction.options.getChannel("移動するチャンネル");
        const mention = "<@" + memberId + ">";

        await interaction.reply(mention + "を " + channelId.name + " チャンネルに移動しました");
    }
});