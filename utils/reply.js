const {DiscordAPIError} = require("discord.js");

module.exports = {
    async successReply(interaction, member, channel) {
        await interaction.reply(`${[member]} を ${[channel]} チャンネルに移動しました`);
    },
    async successChannelReply(interaction, channelFrom, channelTo) {
        await interaction.reply(`${[channelFrom]} から ${[channelTo]} チャンネルに移動しました`);
    },
    async errorReply(interaction, e) {
        console.error(e);
        if (e instanceof DiscordAPIError) {
            if (e.rawError.code === 40032) {
                await interaction.reply({
                    content: `エラー (${e.rawError.code})： 対象ユーザーがボイスチャンネルに接続されていません`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `エラー (${e.rawError.code})： ボイスチャンネルの移動に失敗しました`,
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
    async errorChannelReply(interaction) {
        await interaction.reply({
            content: "エラー (40000)： ボイスチャンネルに接続する必要があります",
            ephemeral: true
        });
    }
}