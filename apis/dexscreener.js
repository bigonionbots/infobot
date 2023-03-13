const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://dexscreener.com',
	timer: 60,
	status: true,
	group_fetch: false,
	getUpdate: async (params) => {
	                const { botData } = params || {};
	                const { apiId, currPair, decimals } = botData || {};

			const response = await fetchRetry(`https://api.dexscreener.io/latest/dex/pairs/${apiId}`).catch(e=>errorReport(e));
			const res = await response.json();

			let priceChangePerc = res.pair.priceChange.h24/100;
			let currPrice = ((res.pair[currPair])?(res.pair[currPair]):(res.pair.priceNative))*1;
			let priceChange = currPrice - (currPrice)/(1+priceChangePerc);

			let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
			let username_str = (botData.showToken)?(res.pairs[0].baseToken.symbol.toUpperCase() 
				+ ' $' + currPrice.toFixed(decimals)):('$' + currPrice.toFixed(decimals));
			return { username: username_str, status: status_str };
		},
};
