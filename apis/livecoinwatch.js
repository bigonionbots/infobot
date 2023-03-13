const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://livecoinwatch.com',
	timer: 60,
	status: true,
	getUpdate: async (params) => {
                const { botData } = params || {};
                const { apiId, currPair, decimals } = botData || {};

                let today = Math.round(new Date().getTime());
                let yesterday = today - (24*60*60*1000);
                const responses = await Promise.all([
                        fetchRetry("https://api.livecoinwatch.com/coins/single", {
                                method: "POST",
                                headers: {
                                        "content-type":"application/json",
                                        "x-api-key": config.lcwAPI,
                                },
                                body: JSON.stringify({
                                        currency: currPair.toUpperCase(),
                                        code: apiId.toUpperCase(),
                                        meta: true,
                                }),
                        }),
                        fetchRetry("https://api.livecoinwatch.com/coins/single/history", {
                                method: "POST",
                                headers: {
                                        "content-type":"application/json",
                                        "x-api-key": config.lcwAPI,
                                },
                                body: JSON.stringify({
                                        currency: currPair.toUpperCase(),
                                        code: apiId.toUpperCase(),
                                        start: yesterday,
                                        end: today,
                                        meta: true,
                                }),
                        }),
                ]).catch(e => errorReport("Error: " + botData.api_id + ": " + e));
                const res = await Promise.all(responses.map((response)=>response.json()));


		let priceChange = res[0].rate - res[1].history[res[1].history.length-1].rate;
		let status_str = (priceChange>=0)?('24h +$' + priceChange.toFixed(decimals)):('24h -$' + (priceChange.toFixed(decimals)*-1));
		let username_str = (botData.showToken)?(botData.apiId.toUpperCase() + ' $' + res[0].rate.toFixed(decimals)):('$' + res[0].rate.toFixed(decimals));
		return { username: username_str, status: status_str };
	},
};
