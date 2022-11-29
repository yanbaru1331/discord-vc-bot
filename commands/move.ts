import {
    SlashCommandBuilder,
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    VoiceBasedChannel
} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";
import {successReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("ユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption((option: SlashCommandChannelOption) => option
            .setName("移動先チャンネル")
            .setDescription("移動先チャンネルの名称（例. 一般）")
            .addChannelTypes(2)
            .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) => option
            .setName("ユーザー名")
            .setDescription("移動するユーザーの名前（例. @VCチャンネル移動bot）")
            .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const channel = options.getChannel("移動先チャンネル") as VoiceBasedChannel;
        const user = Object(interaction.options.getUser("ユーザー名"));

        const allMembers = await interaction.guild!.members.fetch();
        const member = allMembers.filter(m => m.id === user.id).first();

        await member!.voice.setChannel(channel);
        await successReply(interaction, member!, channel);
    }
}