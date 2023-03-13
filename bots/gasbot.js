const { sequelize, Sequelize, QueryTypes } = require('../lib/db.js');
const config  = require('../config.json');

module.exports = {
	status: true,
	name: 'Gasbot',

	Bot: sequelize.define('gasbot', {
		gasbotId: Sequelize.STRING,
	        botToken: { type: Sequelize.STRING, unique: true, allowNull: false, field: 'bot_token' },
	        api: { type: Sequelize.STRING, allowNull: false },
	        apiId: { type: Sequelize.STRING, allowNull: false, field: 'api_id' },
	        chain: Sequelize.STRING,
	        botStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, field: 'bot_status' },
	        username: { type: Sequelize.STRING, allowNull: false, defaultValue: 'usd %COIN% %CURRSYM%%PRICE%', field: 'username' },
	        status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'usd %COIN% %CURRSYM%%PRICE%', field: 'status' },
		notes: Sequelize.STRING
	},{
                timestamps: true,
	}),

};
