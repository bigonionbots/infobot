const { sequelize, Sequelize, QueryTypes } = require('../lib/db.js');
const config  = require('../config.json');

module.exports = {

	status: true,
	name: 'Netbot',

	Bot: sequelize.define('netbot', {
		netbotId: Sequelize.STRING,
	        botToken: { type: Sequelize.STRING, unique: true, allowNull: false, field: 'bot_token' },
	        api: { type: Sequelize.STRING, allowNull: false },
	        apiId: { type: Sequelize.STRING, allowNull: false, field: 'api_id' },
		algo: { type: Sequelize.STRING, allowNull: false },
		hashval: { type: Sequelize.STRING, allowNull: false, defaultValue: 'H' },
	        botStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, field: 'bot_status' },
	        username: { type: Sequelize.STRING, allowNull: false, defaultValue: '', field: 'username' },
	        status: { type: Sequelize.STRING, allowNull: false, defaultValue: '', field: 'status' },
		notes: Sequelize.STRING
	},{
                timestamps: true,
	}),

};
