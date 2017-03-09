const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://' + 
	process.env.POSTGRES_USER + ':' + 
	process.env.POSTGRES_PASSWORD + '@localhost/groupproject'); 
const express = require('express');
const app = express();
const pg = require('pg');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(express.static('static/js'));
app.use(cookieParser())

app.use(session({
	secret: 'wind through your hair woosh',
	resave: true,
	saveUninitialized: false
}));

const User = sequelize.define('user', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	country: Sequelize.STRING
})

const Roads = sequelize.define('road', {
	routename: Sequelize.STRING,
	rating: Sequelize.INTEGER,
	description: Sequelize.STRING(1000),
	country: Sequelize.STRING,
	// pointA: Sequelize.
})

app.get('/', (req, res) => {
	Roads.findAll()
	.then(function(result){
		res.render('index', {roads: result})
	})
});

app.post('/', (req, res)=> {
	// console.log('console.logging value')
	// console.log(req.body.value)
	var thisCountry = req.body.value
	if (thisCountry === "all") {
		Roads.findAll()
		.then((result) => {
			console.log(result)
			res.send({roads: result})
		})
	} else {
		Roads.findAll({
			where: {
				country: thisCountry
			}
		})
		.then((result) => {
			console.log(result)
			res.send({roads: result})
		})
	}
})

app.post('/login', (req, res) => {
	console.log(req.body.username)
	if (req.body.username.length === 0){
		res.redirect('/login/?message=' + encodeURIComponent("Please fill out your username."))
	}
	if (req.body.password.length === 0){
		res.redirect('/login/?message=' + encodeURIComponent("Please fill out your password."))
	}

	User.findOne({
		where: {
			username: req.body.username
		}
	}).then((user) => {
		console.log(user)
		bcrypt.compare(req.body.password, user.password, function(err, result) {
			if(result === true) {
				req.session.user = user;
				res.redirect('/profile/'+user.username)
			} else {
				res.redirect('/login/?message=' + encodeURIComponent("Invalid username or password."))
			}
		})
	})
})


app.post('/signup', (req, res) => {
	console.log('signup post request is working')  //testing purposes
	bcrypt.hash(req.body.password, 8, function(err, hash) {

		User.create({ 
			username: req.body.username,
			password: hash,
			email: req.body.email
		})
	
	.then(()=> {
		res.redirect('/'); 
	})
	})
});


// // search
// app.post('/search', function(req, res){
//  	res.send();
// });

// // rating
// app.post('/rating', function(req, res){
//  	res.send();
// });

//server
sequelize.sync({force:true})
	.then(() => {
		Roads.create({
			routename: "Awesome road",
			rating: 4,
			description: "This road will take you to beautiful waterfalls and mind-blowing views in the French mountains.",
			country: "France"
		})
	.then(() => {
		Roads.create({
			routename: "Route 123588",
			rating: 5,
			description: "In Europe, we don't have route 88. We do however have route 123588.",
			country: "France"
		})
	})
	.then(() => {
		Roads.create({
			routename: "Atlantic road",
			rating: 3,
			description: "Drive on the coast of the UK",
			country: "UK"
		})
	})
	.then(() => {
		User.create({
			username: "Dummy",
			email: "dummy@dummy.com",
			password: "dummy"
		})
	})
	app.listen(3000, () => {
		console.log('server has started');
	});
})

