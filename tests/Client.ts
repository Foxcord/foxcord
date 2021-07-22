import * as Foxcord from '../src/index';

const client = new Foxcord.Client({ device: 'MOBILE', intents: ['ALL'] });

client.on('READY', async () => {
    client.setGame('powered by Foxcord !', { type: 'PLAYING' });
    console.log(client.user.tag + ' is online!');
});

client.on('MESSAGE', (message) => {
    if (message.content === 'ping') {
        return message.channel.send('🏓 pong!');
    }
});

client.connect('token');




























