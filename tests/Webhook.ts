import { WebhookClient, DiscordEmbed } from '../src/index';

const webhookClient = new WebhookClient();

const embed = new DiscordEmbed()
    .setColor('#ba180d')
    .setThumbnail('https://images6.alphacoders.com/922/thumb-1920-922275.png')
    .setDescription('ceci est un test');

let webhookSettings = {
    url: 'some webhook URL',
    username: 'Captain Webhook',
    avatarURL: 'some cool image URL'
}

webhookClient.send(embed, { ...webhookSettings }).then(async webhook => {
    await webhookClient.send(webhook.avatarURL(), { ...webhookSettings })
})
