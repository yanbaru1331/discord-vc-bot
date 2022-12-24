import {SlashCommandBuilder, CommandInteraction, CommandInteractionOptionResolver, VoiceBasedChannel} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";

import {errorChannelReply, successChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("ボイスチャンネルを指定して、その中にいるメンバー全員を移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("どこに")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("どこから")
                .setDescription("移動元チャンネルの名称（例. ロビー）")
                .addChannelTypes(2)
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const channelTo = options.getChannel("どこに") as VoiceBasedChannel;
        let channelFrom = options.getChannel("どこから") as VoiceBasedChannel;

        if (channelFrom == null) {
            const currentChannel = (interaction.member as any).voice.channel;
            if (currentChannel == null) {
                await errorChannelReply(interaction)
                return;
            } else {
                channelFrom = currentChannel;
            }
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