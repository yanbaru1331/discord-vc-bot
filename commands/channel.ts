import {SlashCommandBuilder, CommandInteraction, CommandInteractionOptionResolver, VoiceBasedChannel} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";

import {successChannelReply, errorChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("ボイスチャンネルを指定して、その中にいるメンバー全員を移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("移動先")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        let channelFrom = (interaction.member as any).voice.channel;
        const options = interaction.options as CommandInteractionOptionResolver;
        const channelTo = options.getChannel("移動先") as VoiceBasedChannel;

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