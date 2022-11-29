import {CommandInteraction, GuildMember, VoiceBasedChannel} from "discord.js";
import {DiscordAPIError} from "discord.js";

module.exports = {
    async successReply(interaction: CommandInteraction, member: GuildMember, channel: VoiceBasedChannel) {
        await interaction.reply(`${[member]} を ${[channel]} チャンネルに移動しました`);
    },
    async successChannelReply(interaction: CommandInteraction, channelFrom: VoiceBasedChannel, channelTo: VoiceBasedChannel) {
        await interaction.reply(`${[channelFrom]} から ${[channelTo]} チャンネルに移動しました`);
    },
    async errorReply(interaction: CommandInteraction, e: any) {
        console.error(e);
        if (e instanceof DiscordAPIError) {
            if (e.code === 40032) {
                await interaction.reply({
                    content: `エラー (${e.code})： 対象ユーザーがボイスチャンネルに接続されていません`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `エラー (${e.code})： ボイスチャンネルの移動に失敗しました`,
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                content: "エラー (-1)： ボイスチャンネルの移動に失敗しました",
                ephemeral: true
            });
        }
    },
    async errorChannelReply(interaction: CommandInteraction) {
        await interaction.reply({
            content: "エラー (40000)： ボイスチャンネルに接続する必要があります",
            ephemeral: true
        });
    }
}