const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://hotbit.io/',
	timer: 60,
	status: true,
	getUpdate: async (params) => {
                const { botData } = params || {};
                const { apiId, currPair, decimals } = botData || {};

		const response = await fetchRetry(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.hotbit.io/api/v1/market.status?market=' + apiId.toUpperCase() + currPair.toUpperCase() + '&period=86400')}`)
                  .catch(error => errorReport("Error: " + botData.api_id + ": " + error));
                const resp = await response.json();
		const res = JSON.parse(resp.contents);

		let changePerc = parseFloat(res.result.change)/100;
		let price = parseFloat(res.result.last);
		let priceChange = price * changePerc;
		let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
		let username_str = (botData.showToken)?(botData.apiId.toUpperCase() + ' $' + price.toFixed(decimals)):('$' + price.toFixed(decimals));
		return { username: username_str, status: status_str };
	},
};
