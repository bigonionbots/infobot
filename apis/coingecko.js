const { errorReport, fetchRetry } = require('../lib/utils.js');

// global coingecko pricedata
const cgPriceData = {};

async function updateCoinArray(args) {
	const { botData, bot } = args || {};

	// get list of currencies from db entries
	const currList = [...new Set(botData.filter(i=>i.api=='coingecko').map(o=>o.currPair))];
	const coinArray = [...new Set(botData.filter(i=>i.api=='coingecko').map(o=>o.apiId))];

	const priceData = {};

	for (currPair of currList) { 
		let coinList = coinArray.join('%2C');
	        const response = await fetchRetry(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currPair}&ids=${coinList}`)
			.catch(e=>errorReport(e));
		const data = await response.json();
        	cgPriceData[currPair] = data;
	}

	console.log(`${bot} | Updated cgPriceData for ${coinArray.length} coins from coingecko API`);

}

module.exports = {
	site: 'https://coingecko.com',
	bots: [ 'pricebot' ],
	timer: 60,
	status: true,
	group_fetch: true,
	group_timer: 30,
	groupUpdate: async (args) => {
		// passes entire bot list
		await updateCoinArray(args);
	},
	getUpdate: async (args) => {
		const { botData } = args || {};
		const { decimals} = botData || {};

		const res = cgPriceData[botData.currPair].find(c => c.id === botData.apiId);

		let priceChange = ((typeof(res.price_change_24h) != 'undefined') && (res.price_change_24h != null)) ? res.price_change_24h : 0;
		let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
		let username_str = (botData.showToken)?(res.symbol.toUpperCase() + ' $' + res.current_price):('$' + res.current_price);
		return { username: username_str, status: status_str };
	},
};
