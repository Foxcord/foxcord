<p align="center">
    <img src="https://media.discordapp.net/attachments/774598287712845864/867789487664005140/foxcord-text.png" alt="Foxcord logo" width="80%" height="80%"></img>
    <br>
    <a href="https://www.npmjs.com/package/foxcord"><img src="https://img.shields.io/npm/dt/foxcord.svg?maxAge=3600" alt="NPM downloads" /></a>
<br>
<img src="https://forthebadge.com/images/badges/made-with-typescript.svg" alt="Made with Typescript"></img>
</p>
<br>

# ❓ What's Foxcord ?

<h2>Foxcord is a modern and simple way to interact with the Discord API !</h2>
<h3>In addition to a classic library, Foxcord includes slash commands, selection menus, buttons, and soon a fully integrated voice system!</h3>

*Note: The project is in alpha version and still under development, so it is perfectly normal that you have many errors, we advise you to wait for a stable version before using it for your bot.*

# 🔑 Features
- Easy to use
- Latest Discord API version and latest additions 
- Discord support
- Lightweight


# 🪓 Installation

**Node.Js v12.0.0 is required at least**

```
$ npm install foxcord@latest
```


# 💾 Code example

<p align="center">

```js
const { Client } = require('foxcord');

const client = new Client({
    device: 'MOBILE',
    intents: ['ALL'],
    reconnect: true
});

client.on('READY', () => {
    client.setGame('powered by Foxcord');
    console.log(client.user.tag + ' is online!');
})

client.on('MESSAGE', (message) => {
    if(message.author.bot) return;
    if(message.content === 'ping') return message.channel.send('🏓 Pong, my ping is ' + client.ping + 'ms!');
})

client.connect('token');
```

```js
const { WebhookClient } = require('foxcord');

const webhookClient = new WebhookClient();

let webhookSettings = {
    url: 'some webhook URL',
    username: 'Captain Webhook',
    avatarURL: 'some cool image URL'
}

webhookClient.send('Cool message!', { ...webhookSettings }).then(async webhook => {
    await webhookClient.send(webhook.avatarURL(), { ...webhookSettings })
})
```

</p>

# 🔗 Links

- [Github](https://github.com/Foxcord/foxcord)
- [NPM](https://www.npmjs.com/package/foxcord)
- [Website](https://foxcord.xyz/)
- [Discord server](https://discord.gg/sTahUmwTsr)

**The documentation is coming very soon, In order to have more information about Foxcord, you can join the [Discord server](https://discord.gg/sTahUmwTsr) !**


# 🚀 Other

**This project is under `Apache-2.0` license**

*Note: This package is not affiliated with Discord Inc*

[![Discord invite link](https://media.discordapp.net/attachments/774598287712845864/870975617003315230/2021-07-31_12h26_02.png)](https://discord.gg/sTahUmwTsr)

**You can join the Foxcord official Discord server using [this link](https://discord.gg/sTahUmwTsr)**
