const { errorReport, fetchRetry } = require('../lib/utils.js');
const config = require('../config.json');

module.exports = {
	site: 'https://gasprice.io',
	bots: [ 'gasbot' ],
	timer: 30,
	status: true,
	getUpdate: async () => {
                const response = await fetchRetry('https://api.gasprice.io/v1/estimates')
			.catch(error=>errorReport('Error:'+error));
                const res = await response.json();


                let status_str = '🚶 ' + Math.round(res['result'].fast.feeCap) + ' 🐌 ' + Math.round(res['result'].eco.feeCap);
                let username_str = '⚡ ' + Math.round(res['result'].instant.feeCap) + ' gwei';

		return { username: username_str, status: status_str };
	},
};
