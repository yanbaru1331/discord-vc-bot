import {
    SlashCommandBuilder,
    CommandInteraction,
    CommandInteractionOptionResolver,
    VoiceBasedChannel,
    ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder
} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";

import {errorChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teams")
        .setDescription("チーム分けをしてボイスチャンネルを移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("チーム1")
                .setDescription("チーム1の移動先チャンネル（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("チーム2")
                .setDescription("チーム2の移動先チャンネル（例. ロビー）")
                .addChannelTypes(2)
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const channel1 = options.getChannel("チーム1") as VoiceBasedChannel;
        const channel2 = options.getChannel("チーム2") as VoiceBasedChannel;
        let currentChannel = (interaction.member as any).voice.channel;

        if (currentChannel == null) {
            await errorChannelReply(interaction)
            return;
        }

        const shuffleMembers = shuffle((currentChannel.members.values()))
        const half = splitHalf(shuffleMembers);

        const embed1 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(channel1.toString())
            .setDescription(half[0].toString());

        const embed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(channel2.toString())
            .setDescription(half[1].toString());

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("moveChannel")
                    .setLabel("チャンネルを移動する")
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({
            embeds: [embed1, embed2],
            components: [row as any],
        });
    },
}

function shuffle(array: any): Array<any> {
    const out = Array.from(array);
    for (let i = out.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[r];
        out[r] = tmp;
    }
    return out;
}

function splitHalf(array: any): Array<any> {
    const half = Math.ceil(array.length / 2);
    const firstHalf = array.splice(0, half);
    const secondHalf = array.splice(-half);
    return [firstHalf, secondHalf];
}