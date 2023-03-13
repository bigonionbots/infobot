const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://bitoreum.exchange',
	bots: [ 'pricebot' ],
	timer: 60,
	group_fetch: false,
	getUpdate: async (params) => {
		const { botData } = params || {};
		const { apiId, currPair, decimals } = botData || {};

                const response = await fetchRetry(`https://www.bitoreum.exchange/api/v2/peatio/public/markets/${apiId.toLowerCase()}${currPair.toLowerCase()}/tickers`)
			.catch(e=>errorReport(e));
                const res = await response.json();

		let currPrice = res.ticker.avg_price*1;
		let priceChange = currPrice * (res.ticker.price_change_percent.slice(0,-1)/100);
		let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
		let username_str = (botData.showToken)?(botData.apiId.toUpperCase() + ' $' + currPrice.toFixed(decimals)):('$' + currPrice.toFixed(decimals));
		return { username: username_str, status: status_str };
	},
};
