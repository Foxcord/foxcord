import { WebhookClient, DiscordEmbed } from '../src/index';

const webhookClient = new WebhookClient();

const embed = new DiscordEmbed()
    .setColor('#ba180d')
    .setThumbnail('some cool image URL')
    .setDescription('wow this is a description');

let webhookSettings = {
    url: 'some webhook URL',
    username: 'Captain Webhook',
    avatarURL: 'some cool image URL'
}

webhookClient.send(embed, { ...webhookSettings }).then(async webhook => {
    await webhookClient.send(webhook.avatarURL(), { ...webhookSettings })
})