const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://vestige.fi',
	timer: 60,
	getUpdate: async (params) => {
                const { botData } = params || {};
                const { apiId, currPair, decimals } = botData || {};

                const responses = await Promise.all([
                        fetchRetry(`https://free-api.vestige.fi/asset/${apiId}/price?currency=${currPair.toUpperCase()}`),
                        fetchRetry(`https://free-api.vestige.fi/asset/${apiId}/prices/simple/1D`),
                        fetchRetry(`https://free-api.vestige.fi/asset/${apiId}`)
                ]).catch(error => errorReport("Error: " + coin + ": " + error));
                const res = await Promise.all(responses.map(function (response) {
                     return response.json();
                     } ));

		let username_str = (botData.showToken)?(res[2].ticker.toUpperCase() + ' $' + res[0].price.toFixed(decimals)):('$' + res[0].price.toFixed(decimals));
		return { username: username_str, status: '' };
	},
};
