const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const config = require('./config');
const connectDatabase = require('./database');
const animeCommand = require('./commands/anime');
const interactionEvent = require('./events/interactionCreate');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.commands.set(animeCommand.data.name, animeCommand);

async function bootstrap() {
    await connectDatabase();

    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('🔄 Registering Slash Commands...');
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [animeCommand.data.toJSON()] }
        );
        console.log('✅ Slash Commands registered successfully.');
    } catch (error) {
        console.error('❌ Error registering Slash Commands:', error);
    }

    client.on('interactionCreate', (interaction) => interactionEvent.execute(interaction));

    client.once('ready', () => {
        console.log(`🤖 Bot running successfully as ${client.user.tag}`);
    });

    client.login(config.token);
}

bootstrap();
