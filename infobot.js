const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { loadCommands, broadcastMsg, errorReport, filterObject } = require('./lib/utils.js');
const config = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// Global object that will store all APIs used by bots
const api = {};

// Global object that will store all bots (Discord applications) handled
const bot = {};


async function initApis() {
	const apiPath = path.join(__dirname, 'apis');
	const apiFiles = await fs.readdirSync(apiPath).filter(file=> file.endsWith('.js'));

	for (const file of apiFiles) {
		const filePath = path.join(apiPath, file);
		const name = file.replace(/\.js$/,'');
		api[name] = require(filePath);
	}
}


async function initBots() {
	const botPath = path.join(__dirname, 'bots');
	const botFiles = await fs.readdirSync(botPath).filter(file=> file.endsWith('.js'));

	for (const file of botFiles) {
		const filePath = path.join(botPath, file);
		const name = file.replace(/\.js$/,'');
		const botReview = require(filePath);
		if (botReview.status === true) { bot[name] = require(filePath) }
	}

	/* loads bot definitions from bots/ directory
	   requires Sequelize model definition, name, and status
	*/

	if (bot == {}) {
		errorReport('No active bots. Shutting down.');
	} else {
		const groupCalls = filterObject(filterObject(api,'status',true),'group_fetch',true);

		for (const [ key ] of Object.entries(bot)) {
			console.log(`Bot Handler: Starting up ${key} ...`);

			const botData = await bot[key].Bot.findAll();

			for (const [ gKey ] of Object.entries(groupCalls)) {
				if (api[gKey].bots.indexOf(key)>=0) {
					console.log(`${bot[key].name} | Calling groupUpdate for ${gKey} API definition`);
					await api[gKey].groupUpdate({ botData: botData, bot: bot[key].name });

					setInterval(async () => {
						console.log(`${bot[key].name} | Calling groupUpdate for ${gKey} API definition`);
						await api[gKey].groupUpdate({ botData: botData, bot: bot[key].name });
					}, (api[gKey].group_timer*1000));
				}
			}

			runBot(key,botData);
		}
	}

}


async function runBot(type,botData) {
	// for each bot, login using the Discord bot token
	// use api definitions to establish the refresh rate in seconds and pass back the username and status to update the nickname with
	for (const Bots of botData) {
		const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });

		client.login(Bots.botToken);
		// uncomment for added discord API logging
		//client.on('debug', debug => console.log(debug));
		client.on('rateLimit',(data) => console.error('Ratelimit Error: ' + JSON.stringify(data)));
		client.on('ready', () => {
			console.log(`${bot[type].name} | Connected, logged in as: ${client.user.tag} (${client.user.id})`);

			setInterval(async () => {
				const updateObj = await api[Bots.api].getUpdate( { botData: Bots, bot: bot[type].name });
				let botCount = 0;

				client.user.setActivity(updateObj.status, { type: ActivityType.Watching });
				client.guilds.cache.map((guild) => {
					guild.members.cache.get(client.user.id).setNickname(updateObj.username)
						.catch(error=>errorReport(error));
					botCount++;
				});

				console.log(`${bot[type].name} | ${client.user.tag}: Updated username to [${updateObj.username}] and status to [${updateObj.status}] on ${botCount} servers`);
			}, (api[Bots.api].timer*1000));

		});
	}


}

async function main() {
	await initApis();
	await initBots();
}

main();
