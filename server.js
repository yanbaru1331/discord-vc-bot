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
            .setName("移動先チャンネル")
            .setDescription("移動先チャンネルの名称（例. 一般）")
            .addChannelTypes(2)
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
        const channelId = interaction.options.getChannel("移動先チャンネル");
        const mention = "<@" + memberId + ">";

        const channels = await interaction.guild.channels.fetch();
        const channel = channels.filter(c => c.type === 2 && c.name === channelId.name);

        if (channel.size >= 0) {
            await interaction.reply(mention + " を " + channel.toJSON() + " チャンネルに移動しました");
        } else {
            await interaction.reply("エラー: vcチャンネルが存在しません");
        }
    }
});