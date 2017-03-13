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
const bcrypt = require('bcrypt');

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
		res.render('index', {roads: result, user: req.session.user})
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

app.post('/login', bodyParser.urlencoded({extended: true}), function (request, response) {
	if(request.body.email.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(request.body.password.length === 0) {
		response.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	User.findOne({
		where: {
			email: request.body.email
		}
	}).then(function (user) {
		if(user === null) {
			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		}
		else {
		bcrypt.compare(request.body.password, user.password, (err, result)=>{
			if (err) throw err;
			if (user !== null && result) {
				request.session.user = user;
				response.redirect('/');
			}
			else {
				response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
			}
		})
		}
	}, function (error) {
		response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	});
});

app.post('/signup', (req, res) => {
	console.log('the signup post is working')
	let userInputUsername = req.body.username;
	let userInputEmail = req.body.email;
	let userInputPassword = req.body.password;

	bcrypt.hash(userInputPassword, 8, (err,hash) =>{
		if (err) throw err

			return User.create({
				username: userInputUsername,
				email: userInputEmail,
				password: hash
			})

		.then(function() {
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
sequelize.sync(/*{force:true}*/)
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

