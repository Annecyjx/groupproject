var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://' + 
	process.env.POSTGRES_USER + ':' + 
	process.env.POSTGRES_PASSWORD + '@localhost/groupproject'); 

var User = sequelize.define('user', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	country: Sequelize.STRING
})

var Roads = sequelize.define('road', {
	routename: Sequelize.STRING,
	rating: Sequelize.INTEGER,
	description: Sequelize.STRING(1000),
	country: Sequelize.STRING,
	pointAlat: Sequelize.FLOAT,
	pointAlng: Sequelize.FLOAT,
	pointBlat: Sequelize.FLOAT,
	pointBlng: Sequelize.FLOAT
})