# Discord VCチャンネル移動bot
ユーザーを指定してボイスチャンネルを移動することができるDiscordボットです。  
複数ユーザーやチャンネルごとの移動にも対応しています。  

[→ Discordに追加する](https://discord.com/api/oauth2/authorize?client_id=1044007415680598068&permissions=16780288&scope=bot%20applications.commands)  

![vc-bot](https://user-images.githubusercontent.com/53967490/204147634-c96a0a1c-a938-457f-afda-93d12533b453.gif)

# 使い方

> ユーザーを指定してボイスチャンネルを移動
```
/move (移動先チャンネル) (ユーザー名)
```

> 複数人のユーザーを指定してボイスチャンネルを移動
```
/moves (移動先チャンネル) (ユーザー1) (ユーザー2) ・・・
```

> ボイスチャンネルを指定してその中にいるメンバー全員を移動
```
/channel (移動先チャンネル)
```

# カスタマイズする場合
※ Node v16.9.0 以降が必要です。

```
git clone https://github.com/sakusaku3939/discord-vc-bot.git
cd discord-vc-bot
```
```
npm install
```

[Discord Developer Portal](https://discord.com/developers/applications) から新しいアプリケーションを作成し、トークンを `DISCORD_TOKEN` に貼り付けます。
```
echo 'DISCORD_TOKEN="(BOTトークン)"' > .env
```
以下のコマンドで開始できます。
```
node server.js
```

# License
[MIT](https://github.com/sakusaku3939/remove-slideshare-limit/blob/master/LICENSE)
