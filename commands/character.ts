import {
    SlashCommandBuilder,
    CommandInteraction,
    CommandInteractionOptionResolver,
    ButtonStyle, EmbedBuilder, SlashCommandNumberOption
} from "discord.js";
import {shuffle} from "../utils/shuffle";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("スマブラSPのキャラクターをランダムに選びます")
        .addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("キャラクター数1")
                .setDescription("チーム1のキャラクター数")
                .setRequired(true)
        ).addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("キャラクター数2")
                .setDescription("チーム2のキャラクター数")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const num1 = options.getNumber("キャラクター数1");
        const num2 = options.getNumber("キャラクター数2");

        const characters = ['マリオ', 'ドンキーコング', 'リンク', 'サムス', 'ダークサムス', 'ヨッシー', 'カービィ', 'フォックス', 'ピカチュウ', 'ルイージ', 'ネス', 'キャプテン・ファルコン', 'プリン', 'ピーチ', 'デイジー', 'クッパ', 'アイスクライマー', 'シーク', 'ゼルダ', 'ドクターマリオ', 'ピチュー', 'ファルコ', 'マルス', 'ルキナ', 'こどもリンク', 'ガノンドロフ', 'ミュウツー', 'ロイ', 'クロム', 'Mr.ゲーム＆ウォッチ', 'メタナイト', 'ピット', 'ブラックピット', 'ゼロスーツサムス', 'ワリオ', 'スネーク', 'アイク', 'ポケモントレーナー', 'ディディーコング', 'リュカ', 'ソニック', 'デデデ', 'ピクミン＆オリマー', 'ルカリオ', 'ロボット', 'トゥーンリンク', 'ウルフ', 'むらびと', 'ロックマン', 'WiiFitトレーナー', 'ロゼッタ＆チコ', 'リトル・マック', 'ゲッコウガ', 'Miiファイター格闘', 'Miiファイター剣術', 'Miiファイター射撃', 'パルテナ', 'パックマン', 'ルフレ', 'シュルク', 'クッパJr.', 'ダックハント', 'リュウ', 'ケン', 'クラウド', 'カムイ', 'ベヨネッタ', 'インクリング', 'リドリー', 'シモン', 'リヒター', 'キングクルール', 'しずえ', 'ガオガエン', 'パックンフラワー', 'ジョーカー', '勇者', 'バンジョー＆カズーイ', 'テリー', 'ベレト', 'ミェンミェン', 'スティーブ', 'セフィロス', 'ホムラ／ヒカリ', 'カズヤ', 'ソラ']

        const shuffle1 = shuffle(characters).slice(0, num1!);
        const shuffle2 = shuffle(characters).slice(0, num2!);

        const embed1 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("チーム1")
            .setDescription(shuffle1.toString().replaceAll(",", ", "));

        const embed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("チーム2")
            .setDescription(shuffle2.toString().replaceAll(",", ", "));

        await interaction.reply({
            embeds: [embed1, embed2],
        });
    },
}
