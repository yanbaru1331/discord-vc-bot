const {successChannelReply, errorChannelReply} = require("../utils/reply");
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("ボイスチャンネルを指定して、その中にいるメンバー全員を移動します。")
        .addChannelOption(
            option => option
                .setName("移動先")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ),
    async execute(interaction) {
        let channelFrom = interaction.member.voice.channel;
        const channelTo = Object(interaction.options.getChannel("移動先"));

        if (channelFrom == null) {
            await errorChannelReply(interaction)
            return;
        }

        const channelMembers = channelFrom.members;
        let peopleCount = 0;

        for (const member of channelMembers.values()) {
            await member.voice.setChannel(channelTo);
            peopleCount++;
        }
        await successChannelReply(interaction, channelFrom, channelTo);
    },
}