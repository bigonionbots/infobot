const { Sequelize, QueryTypes } = require('sequelize');
const config  = require('../config.json');

module.exports = {
	Sequelize: Sequelize,
	QueryTypes: QueryTypes,
	sequelize: new Sequelize(config.db.database,config.db.user,config.db.password,
	        { host: config.db.host, dialect: config.db.dialect, logging: config.db.logging,
	          storage: config.db.storage, define: { freezeTableName: true }
        }),
};
