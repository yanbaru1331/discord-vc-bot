const {Client, GatewayIntentBits, SlashCommandBuilder, DiscordAPIError} = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
    const move = new SlashCommandBuilder()
        .setName("move")
        .setDescription("ユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption(option => option
            .setName("移動先チャンネル")
            .setDescription("移動先チャンネルの名称（例. 一般）")
            .addChannelTypes(2)
            .setRequired(true)
        ).addUserOption(option => option
            .setName("ユーザー名")
            .setDescription("移動するユーザーの名前（例. @VCチャンネル移動bot）")
            .setRequired(true)
        );

    const moves = new SlashCommandBuilder()
        .setName("moves")
        .setDescription("複数人のユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption(option => option
            .setName("移動先チャンネル")
            .setDescription("移動先チャンネルの名称（例. 一般）")
            .addChannelTypes(2)
            .setRequired(true)
        ).addUserOption(option => option
            .setName("1")
            .setDescription("移動するユーザーの名前1")
            .setRequired(true)
        ).addUserOption(option => option
            .setName("2")
            .setDescription("移動するユーザーの名前2")
        ).addUserOption(option => option
            .setName("3")
            .setDescription("移動するユーザーの名前3")
        ).addUserOption(option => option
            .setName("4")
            .setDescription("移動するユーザーの名前4")
        ).addUserOption(option => option
            .setName("5")
            .setDescription("移動するユーザーの名前5")
        );

    await client.application.commands.set([move, moves], process.env.SERVER_ID);
    console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN).then();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === "move") {
        const channel = Object(interaction.options.getChannel("移動先チャンネル"));
        const user = Object(interaction.options.getUser("ユーザー名"));

        const allMembers = await interaction.guild.members.fetch();
        const member = allMembers.filter(m => m.id === user.id).first();

        try {
            await member.voice.setChannel(channel);
            await successReply(member, channel);
        } catch (e) {
            await errorReply(e)
        }
    }

    if (interaction.commandName === "moves") {
        const channel = Object(interaction.options.getChannel("移動先チャンネル"));

        const getUser = (n) => Object(interaction.options.getUser(n.toString()))
        const users = {
            [getUser(1).id]: getUser(1),
            [getUser(2).id]: getUser(2),
            [getUser(3).id]: getUser(3),
            [getUser(4).id]: getUser(4),
            [getUser(5).id]: getUser(5),
        };

        const allMembers = await interaction.guild.members.fetch();
        const members = allMembers.filter(m => m.id in users);

        try {
            for (const member of members.values()) {
                await member.voice.setChannel(channel);
            }
            await successReply(members.toJSON(), channel);
        } catch (e) {
            await errorReply(e);
        }
    }

    async function successReply(member, channel) {
        await interaction.reply([member] + " を " + [channel] + " チャンネルに移動しました" + ", ");
    }

    async function errorReply(e) {
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
});