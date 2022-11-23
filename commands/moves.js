const {successReply} = require("../utils/reply");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moves")
        .setDescription("複数人のユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption(
            option => option
                .setName("移動先チャンネル")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption(
            option => option
                .setName("1")
                .setDescription("移動するユーザーの名前1")
                .setRequired(true)
        ).addUserOption(
            option => option
                .setName("2")
                .setDescription("移動するユーザーの名前2")
        ).addUserOption(
            option => option
                .setName("3")
                .setDescription("移動するユーザーの名前3")
        ).addUserOption(
            option => option
                .setName("4")
                .setDescription("移動するユーザーの名前4")
        ).addUserOption(
            option => option
                .setName("5")
                .setDescription("移動するユーザーの名前5")
        ),

    async execute(interaction) {
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

        for (const member of members.values()) {
            await member.voice.setChannel(channel);
        }
        await successReply(interaction, members.toJSON(), channel);
    }
}