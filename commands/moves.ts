import {SlashCommandBuilder} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";
import {
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    User,
    VoiceBasedChannel
} from "discord.js";

const {successReply} = require("../utils/reply");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moves")
        .setDescription("複数人のユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("移動先チャンネル")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("1")
                .setDescription("移動するユーザーの名前1")
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("2")
                .setDescription("移動するユーザーの名前2")
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("3")
                .setDescription("移動するユーザーの名前3")
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("4")
                .setDescription("移動するユーザーの名前4")
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("5")
                .setDescription("移動するユーザーの名前5")
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const channel = options.getChannel("移動先チャンネル") as VoiceBasedChannel;

        const getUser = (n: number) => options.getUser(n.toString());
        let users: { [p: string]: User | null } = {};

        for (let i = 1; i <= 5; i++) {
            const user = getUser(i);
            if (user != null) users[user.id] = user;
        }

        const allMembers = await interaction.guild!.members.fetch();
        const members = allMembers.filter(m => m.id in users);

        for (const member of members.values()) {
            await member.voice.setChannel(channel);
        }
        await successReply(interaction, members.toJSON(), channel);
    }
}