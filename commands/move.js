const {successReply} = require("../utils/reply");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("ユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption(
            option => option
                .setName("移動先チャンネル")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption(
            option => option
                .setName("ユーザー名")
                .setDescription("移動するユーザーの名前（例. @VCチャンネル移動bot）")
                .setRequired(true)
        ),

    async execute(interaction) {
        const channel = Object(interaction.options.getChannel("移動先チャンネル"));
        const user = Object(interaction.options.getUser("ユーザー名"));

        const allMembers = await interaction.guild.members.fetch();
        const member = allMembers.filter(m => m.id === user.id).first();

        await member.voice.setChannel(channel);
        await successReply(interaction, member, channel);
    }
}