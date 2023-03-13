const { sequelize, Sequelize, QueryTypes } = require('../lib/db.js');
const config  = require('../config.json');

module.exports = {

	status: true,
	name: 'Pricebot',

	Bot: sequelize.define('pricebot', {
                coinId: Sequelize.STRING,
                botToken: { type: Sequelize.STRING, unique: true, allowNull: false, field: 'bot_token' },
                api: { type: Sequelize.STRING, allowNull: false },
                apiId: { type: Sequelize.STRING, allowNull: false, field: 'api_id' },
                tokenOverride: { type: Sequelize.STRING, allowNull: true, field: 'token_override' },
                showToken: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, field: 'show_token' },
                botStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, field: 'bot_status' },
                username: { type: Sequelize.STRING, allowNull: false, defaultValue: 'usd %COIN% %CURRSYM%%PRICE%', field: 'username' },
                status: { type: Sequelize.STRING, allowNull: false, defaultValue: '24h %ARROW(+,-)%%CURRSYM%', field: 'status' },
		decimals: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 6 },
		currPair: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 'usd' },
		notes: Sequelize.STRING
	},{
                timestamps: true,
	}),

};
