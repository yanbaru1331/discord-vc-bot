const {Client, GatewayIntentBits, SlashCommandBuilder, DiscordAPIError} = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
    const data = new SlashCommandBuilder()
        .setName("move")
        .setDescription("ユーザーを指定してボイスチャンネルを移動します。")
        .addUserOption(option => option
            .setName("ユーザー名")
            .setDescription("移動するユーザーの名前（例. @VCチャンネル移動bot）")
            .setRequired(true)
        ).addChannelOption(option => option
            .setName("移動先チャンネル")
            .setDescription("移動先チャンネルの名称（例. 一般）")
            .addChannelTypes(2)
            .setRequired(true)
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
        const user = Object(interaction.options.getUser("ユーザー名"));
        const channel = Object(interaction.options.getChannel("移動先チャンネル"));

        const allMembers = await interaction.guild.members.fetch();
        const member = allMembers.filter(m => m.id === user.id).first();

        try {
            await member.voice.setChannel(channel);
            await interaction.reply([member] + " を " + [channel] + " チャンネルに移動しました" + ", ");
        } catch (e) {
            console.error(e);
            if (e instanceof DiscordAPIError) {
                if (e.rawError.code === 40032) {
                    await interaction.reply("エラー (" + e.rawError.code + ")： ユーザーがボイスチャンネル上に存在しません");
                } else {
                    await interaction.reply("エラー (" + e.rawError.code + ")： ボイスチャンネルの移動に失敗しました");
                }
            } else {
                await interaction.reply("エラー (-1)： ボイスチャンネルの移動に失敗しました");
            }
        }
    }
});