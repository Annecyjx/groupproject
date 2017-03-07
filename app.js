const 	express = require('express'),
		
		app = express(),

		pg = require('pg'),

		bodyParser = require('body-parser'),

		cookieParser = require('cookie-parser'),

		session = require('express-session'),

		bcrypt = require('bcrypt')


var Sequelize = require('sequelize');

// creating a new database called blogapplication
var sequelize = new Sequelize('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/groupproject'); 

app.use(express.static('static'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

//view engine setup
app.set('views', './views'); 
app.set('view engine', 'pug');

// renders corresponding index.pug file
app.get ('/', (request, response) => {
	response.render('index');
});

//posts request formulier naar database which is stored in sequelize.
app.post('/', function(req, res){
	console.log('signup post request is working')  //testing purposes
	bcrypt.hash(req.body.password, 8, function(err, hash) {

		User.create({ //changed to database name
			username: req.body.username,
			password: hash,
			email: req.body.email
		})
	
	.then(()=>{
		res.redirect('/login'); 
	})
	})
});


// login
app.post('/', (req, res) => {
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
	}).then(function(user){
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

// search
 app.post('/search', function(req, res){

});


// rating
 app.post('/rating', function(req, res){
 	
});





app.listen(3000, () => {

			console.log('server has started');

		});