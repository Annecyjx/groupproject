const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://' + 
	process.env.POSTGRES_USER + ':' + 
	process.env.POSTGRES_PASSWORD + '@localhost/groupproject'); 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(express.static('static/js'));

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
	// pointA: Sequelize.
})

app.get('/', (req, res) => {
	Roads.findAll()
	.then(function(result){
		res.render('ajax-group', {roads: result})
	})
});

app.post('/', (req, res)=>{
	// console.log('console.logging value')
	// console.log(req.body.value)
	var thisCountry = req.body.value
	if (thisCountry === "all") {
		Roads.findAll()
		.then(function(result){
			console.log(result)
			res.send({roads: result})
		})
	} else {
		Roads.findAll({
			where: {
				country: thisCountry
			}
		})
		.then(function(result){
			console.log(result)
			res.send({roads: result})
		})
	}
})

//server
sequelize.sync({force:true})
	.then(function(){
		Roads.create({
			routename: "Awesome road",
			rating: 4,
			description: "This road will take you to beautiful waterfalls and mind-blowing views in the French mountains.",
			country: "France"
		})
	.then(function(){
		Roads.create({
			routename: "Route 123588",
			rating: 5,
			description: "In Europe, we don't have route 88. We do however have route 123588.",
			country: "France"
		})
	})
	.then(function(){
		Roads.create({
			routename: "Atlantic road",
			rating: 3,
			description: "Drive on the coast of the UK",
			country: "UK"
		})
	})
	app.listen(3000, () => {
		console.log('server has started');
	});
})

