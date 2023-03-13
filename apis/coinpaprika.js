const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://coinpaprika.com',
	timer: 120,
	getUpdate: async (params) => {
                const { botData } = params || {};
                const { apiId, currPair, decimals } = botData || {};

		const response = await fetchRetry('https://api.coinpaprika.com/v1/tickers/' + apiId).catch(e=>errorReport(e));
		const res = await response.json();

		let priceChangePerc = ((typeof(res.price_change_24h) != 'undefined') && (res.price_change_24h != null)) ? res.quotes[currPair.toUpperCase()].price_change_24h*1 : 0;
		let priceChange = priceChangePerc/100 * res.quotes[currPair.toUpperCase()].price*1;
		let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
		let username_str = (botData.showToken)?(res.symbol.toUpperCase() + ' $' + res.quotes[currPair.toUpperCase()].price.toFixed(decimals)):('$' + res.quotes[currPair.toUpperCase()].price.toFixed(decimals));
		return { username: username_str, status: status_str };
	},
};
