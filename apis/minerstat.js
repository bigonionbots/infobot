/*

API definition for using minerstat API for mining network information (hashrate and network difficulty)

group_fetch is used to get all coins using the minerstat API

*/

const { errorReport, fetchRetry, hash } = require('../lib/utils.js');

const msNetworkData = {};
var tick = 0;

async function updateNetworkData(args) {
	const { botData, bot } = args || {};

	const netArray = [...new Set(botData.filter(i=>i.api=='minerstat').map(o=>o.apiId))];

	let netList = netArray.join(',');
        let fetchUrl = `https://api.minerstat.com/v2/coins?list=${netList}`;
        const response = await fetchRetry(fetchUrl).catch(e=>errorReport(e));
	const data = await response.json();

	console.log(`${bot} | Updated msNetworkData for ${netArray.length} networks from minerstat API`);
	msNetworkData.res = data;

	if (tick == 1) { tick = 0 } 
	else { tick = 1 }
}

module.exports = {
	site: 'https://minerstat.com',
	bots: [ 'netbot' ],
	timer: 30,
	status: true,
	group_fetch: true,
	group_timer: 30,
	groupUpdate: async (args) => {
		// passes entire bot list
		await updateNetworkData(args);
	},
	getUpdate: async (args) => {
		const { botData } = args || {};
		const res = msNetworkData.res.find(c => c.id === botData.apiId);

		// find index in the array of objects matching Bots.coin and
                let idx = msNetworkData.res.findIndex(n => n.coin === botData.apiId.toUpperCase());
		let networkData = [];

                if (idx == -1) {
                        networkData = [ '0', '0' ];
                } else {
                        networkData = new Array(hash(msNetworkData.res[idx].difficulty),hash(msNetworkData.res[idx].network_hashrate)+botData.hashval+'/s');
                }

                const statusType = new Array('Difficulty','Hashrate');

		const updateObj = { username: networkData[tick] };
                if (idx == -1) { updateObj.status = 'no data' }
                else { updateObj.status = `${msNetworkData.res[idx].name} ${statusType[tick]}` }

		return updateObj;
	},
};
