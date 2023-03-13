const config = require('../config.json');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const RETRY_COUNT = 5;

module.exports = { 
	delay: (ms) => { return new Promise(r => setTimeout(r.ms*1000)) },
	truncate: (str,n) => { return (str.length > n) ? str.slice(0,n-1) : str },
	broadcastMsg: (msg,err) => {
	        if (err) {
	                console.error(msg);
	                //module.exports.sendWebhook(config.bot_name + ' Error: ' + msg);
	        } else {
	                console.log(msg);
	                module.exports.sendWebhook(config.bot_name + ': ' + msg);
	        }
	},
	hash: (value) => {
		let prefixArray=["","K","M","G","T","P"];
		let prefixCounter = 0;
		while (value>1000) {
			prefixCounter++;
			value = value/1000;
			if (prefixCounter===prefixArray.length-1) {
				break;
			}
		}
		if (value == -1) { return "0 " } else {
			if (value < 1)  {
				return (value+" "+prefixArray[prefixCounter]);
			} else {
				return (Math.round(value*100+Number.EPSILON)/100)+" "+prefixArray[prefixCounter];
			}
		}
	},
	filterObject: (obj,field,val) => {
		const res = {};
		for (const key in obj) {
			const entry = obj[key];
			if (entry[field] === val) { res[key] = entry }
		}
		return res;
	},
	errorReport: (msg) => { module.exports.broadcastMsg(msg,true) },
	sendWebhook: (webhookMsg) => {
	        const params = { content: webhookMsg }
	        module.exports.fetch(config.webhookURL, {
	                method: "POST",
	                headers: { 'Content-type': 'application/json' },
	                body: JSON.stringify(params)
	        }).then(res => {
			// uncommend below for debugging webhook issues
	                //console.log('Webhook message successful: ' + webhookMsg);
	        }).catch(error => module.exports.errorReport('Error on Webhook:' + error));
	},
	fetch: require('node-fetch'),
	fetchRetry: async (...args) => {
		let count = RETRY_COUNT;
		while(count > 0) {
			try {
				return await module.exports.fetch(...args, {
					agent: httpsAgent });
			} catch(error) {
				module.exports.errorReport(error);
			}
			console.log('Fetch ' + args + ' failed, retrying.');
			count -= 1;
		}
		module.exports.errorReport('Exceeded ' + RETRY_COUNT + ' retries');
	},
	loadCommands: (bot) => {

	        bot.commands = new Collection();

	        const commandsPath = path.join(__dirname, 'commands');
	        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	        for (const file of commandFiles) {
	                const filePath = path.join(commandsPath, file);
	                const command = require(filePath);
	                bot.commands.set(command.data.name, command);
	        }
	},
};


