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
const math = require('mathjs')

app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(express.static('static/js'));
app.use(cookieParser())

// setting up the session
app.use(session({
	secret: 'wind through your hair woosh',
	resave: true,
	saveUninitialized: false
}));

// defining tables with sequelize
const User = sequelize.define('user', {
	username: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	country: Sequelize.STRING
})

const Roads = sequelize.define('road', {
	routename: Sequelize.STRING,
	description: Sequelize.STRING(1000),
	country: Sequelize.STRING,
	latA: Sequelize.DECIMAL,
	lngA: Sequelize.DECIMAL,
	latB: Sequelize.DECIMAL,
	lngB: Sequelize.DECIMAL
})

var Rating = sequelize.define('rating', {
	value: Sequelize.INTEGER
})

// relations between tables
Rating.belongsTo(Roads);
Roads.hasMany(Rating);

// get original homepage with all roads and ratings.
app.get('/', (req, res) => {
	Roads.findAll()
	.then(function(allRoads){
		let ratingPromises = [];
		for (var i = 0; i < allRoads.length; i++) {
			let avgRating = Rating.findAll({
				where: { "roadId": allRoads[i].id}
			})
			.then(function(allRatingsOfOneRoad){
				var averageOfOneRating = []
				for(var j = 0; j < allRatingsOfOneRoad.length; j++){
					averageOfOneRating.push(allRatingsOfOneRoad[j].dataValues.value)
				}
				return math.mean(averageOfOneRating).toFixed(2)
			})

			ratingPromises.push(Promise.all([Promise.resolve(allRoads[i]), avgRating]))
		}
		const allRoadsPromise = Promise.resolve(allRoads)
		ratingPromises.push(allRoadsPromise)
		return Promise.all(ratingPromises)
	})
	.then(function(data){
		const allRoads = data.pop()
		const roadsAndRatings = data
		const wegenEnBeoordelingen = []
		for (var i = 0; i < roadsAndRatings.length; i++) {
			const roadAndRatingObj = {
				road: roadsAndRatings[i][0],
				rating: roadsAndRatings[i][1]
			}
			wegenEnBeoordelingen.push(roadAndRatingObj)
		}
		res.render('index', {roads: allRoads, ratings: wegenEnBeoordelingen, user: req.session.user})
	})
});

// post request route for search result
app.post('/specroute', (req, res)=>{
	// console.log('console.logging value')
	// console.log(req.body.value)
	var thisCountry = req.body.value
	if (thisCountry === "all") {
		Roads.findAll()
		.then(function(allRoads){
			let ratingPromises = [];
			for (var i = 0; i < allRoads.length; i++) {
				let avgRating = Rating.findAll({
					where: { "roadId": allRoads[i].id}
				})
				.then(function(allRatingsOfOneRoad){
					var averageOfOneRating = []
					for(var j = 0; j < allRatingsOfOneRoad.length; j++){
						averageOfOneRating.push(allRatingsOfOneRoad[j].dataValues.value)
					}
					return math.mean(averageOfOneRating).toFixed(2)
				})

				ratingPromises.push(Promise.all([Promise.resolve(allRoads[i]), avgRating]))
			}
			const allRoadsPromise = Promise.resolve(allRoads)
			ratingPromises.push(allRoadsPromise)
			return Promise.all(ratingPromises)
		})
		.then(function(data){
			const allRoads = data.pop()
			const roadsAndRatings = data
			const wegenEnBeoordelingen = []
			for (var i = 0; i < roadsAndRatings.length; i++) {
				const roadAndRatingObj = {
					road: roadsAndRatings[i][0],
					rating: roadsAndRatings[i][1]
				}
				wegenEnBeoordelingen.push(roadAndRatingObj)
			}
			res.send({roads: allRoads, ratings: wegenEnBeoordelingen, user: req.session.user})
		})
	} else {
		Roads.findAll({
			where: {
				country: thisCountry
			}
		})
		.then(function(allRoads){
			let ratingPromises = [];
			for (var i = 0; i < allRoads.length; i++) {
				let avgRating = Rating.findAll({
					where: { "roadId": allRoads[i].id}
				})
				.then(function(allRatingsOfOneRoad){
					var averageOfOneRating = []
					for(var j = 0; j < allRatingsOfOneRoad.length; j++){
						averageOfOneRating.push(allRatingsOfOneRoad[j].dataValues.value)
					}
					return math.mean(averageOfOneRating).toFixed(2)
				})

				ratingPromises.push(Promise.all([Promise.resolve(allRoads[i]), avgRating]))
			}
			const allRoadsPromise = Promise.resolve(allRoads)
			ratingPromises.push(allRoadsPromise)
			return Promise.all(ratingPromises)
		})
		.then(function(data){
			const allRoads = data.pop()
			const roadsAndRatings = data
			const wegenEnBeoordelingen = []
			for (var i = 0; i < roadsAndRatings.length; i++) {
				const roadAndRatingObj = {
					road: roadsAndRatings[i][0],
					rating: roadsAndRatings[i][1]
				}
				wegenEnBeoordelingen.push(roadAndRatingObj)
			}
			res.send({roads: allRoads, ratings: wegenEnBeoordelingen, user: req.session.user})
		})
	}
})

// app.get('/specroute',(req,res)=>{
// 	if (req.query.countryName =='all'){
// 		Roads.findAll()
// 		.then((result)=>{
// 			res.send(result)
// 		})
// 	}
// 	else{
// 			Roads.findAll({
// 		where: {
// 			country: req.query.countryName
// 		}
// 	})
// 	.then((result) => {

// 		res.send(result)
// 	})
// 	}

// })

// ajax post request route for login
app.post('/login', (req, res) => {
	if (req.body.loginEmailInput.length === 0) {
		res.send('emailempty');
		return;
	} else if(req.body.loginPasswordInput.length === 0) {
		res.send('passwordempty');
		return;
	}
	User.findOne({
		where: {
			email: req.body.loginEmailInput
		}
	}).then((user) => {
		if(user === null) {
			res.send('error');
			return;
		}
		else {
			bcrypt.compare(req.body.loginPasswordInput, user.password, (err, result)=>{
				if (err) throw err;
				if (user !== null && result) {
					req.session.user = user;
					res.send({user: req.session.user});
					return;
				}
				else {
					res.send('error');
					return;
				}
			})
		} 
	}) 
})

// ajax post request route for logout
app.get('/logout', function (req, res) {
  req.session.destroy(function (error) {
    if(error) {
        throw error;
    }
    console.log('destroyed session');
    res.redirect('/');
  })
})

// ajax post request route for signup
app.post('/signup', (req, res) => {
	console.log('the signup post is working');
	if (req.body.signupEmailInput.length === 0) {
		res.send('emailempty');
		return;
	} else if(req.body.signupPasswordInput.length === 0) {
		res.send('passwordempty');
		return;
	}
	bcrypt.hash(req.body.signupPasswordInput, 8, (err,hash) =>{
		if (err) throw err
			return User.create({
				email: req.body.signupEmailInput,
				password: hash
			})
		.then(function() {
			res.redirect('/');
		})
	})	
});

// ajax post request route for updating rating
 app.post('/rating', function(req, res){
 	console.log(req.body.thisRoad)
 	Rating.create({
 		value: req.body.addRating,
 		roadId: req.body.thisRoad
 	})
 	.then(function(){
 		Rating.findAll({
 			where: {
 				roadId: req.body.thisRoad
 			}
 		})
 		.then(function(result) {
 			var avgOfThis = []
 			for (var i = 0; i < result.length; i++) {
 				avgOfThis.push(result[i].dataValues.value)
 			}
 			var average = math.mean(avgOfThis).toFixed(2)
 			console.log(average)
 			return average
 		})
 		.then(function(average){
 			res.send({average:average, roadId:req.body.thisRoad, user: req.session.user})
 		})
 	})
});

//server
sequelize.sync({force:true})
	.then(() => {
		//Route Germany Stuttgart to Bazel  
		Roads.create({
			routename: "Awesome Route",
			description: "This road will take you to beautiful waterfalls and mind-blowing views in the German mountains.",
			country: "Germany",
			latA:48.775814,
			lngA:9.182862,
			latB:47.559602,
			lngB:7.588579,
		})
	.then(() => {
		//Route Ireland, Glencullen to Glendalough 
		Roads.create({
			routename: "Experience Ireland",
			description: "In Europe, we don't have route 88. We do however have route 123588.",
			country: "Ireland",
			latA:53.222477,
			lngA:-6.216159,
			latB:53.012008,
			lngB:-6.329883,
		})
	})
	.then(() => {
		//Route Bosnia & Herzegovina:  Toplica to Zavidovići 
		Roads.create({
			routename: "Fun Route",
			description: "Drive on the coast of Bosnia and Herzegovina",
			country: "Bosnia and Herzegovina",
			latA:43.995644,
			lngA:19.443950,
			latB:44.439865,
			lngB:18.143814,
		})
	})
	.then(() => {
		//Route Norway: Skei to Haltdalen
		Roads.create({
			routename: "Explore Route",
			description: "Let us do something in Norway",
			country: "Norway",
			latA:61.571045,
			lngA:6.480814,
			latB:62.926029,
			lngB:11.139721,
		})
	})
	.then(() => {
		//Route Spain: A Coruña to Montjoi
		Roads.create({
			routename: "Southern Route",
			description: "Always give you summer feeling",
			country: "Spain",
			latA:43.362900,
			lngA:-8.413781,
			latB:42.251594,
			lngB:3.228310,
		})
	})
	.then(() => {
		//Route Italy: Fiastra to Amendolea
		Roads.create({
			routename: "Need to know Route",
			description: "You cannot miss Italy.",
			country: "Italy",
			latA:43.036775,
			lngA:13.154450,
			latB:37.988967,
			lngB:15.893165,
		})
	})
	.then(() => {
		//Route Romania: Sadova to Cerna Sat
		Roads.create({
			routename: "Moutain Route",
			description: "Life in Romania.",
			country: "Romania",
			latA:47.565367,
			lngA:25.475095,
			latB:45.128044,
			lngB:22.683342,
		})
	})
	.then(() => {
		//Route Austria: Garfrescha to Bruck an der Mur
		Roads.create({
			routename: "Bluesky Route",
			description: "See fantastic sky ever during journey.",
			country: "Austria",
			latA:47.003557,
			lngA:9.977634,
			latB:47.409415,
			lngB:15.273944,
		})
	})
	.then(() => {
		User.create({
			username: "Dummy",
			email: "dummy@dummy.com",
			password: "dummy"
		})
	})
	.then(function(){
		Rating.create({
			value: 5,
			roadId: 1
		})
	})
	.then(function(){
		Rating.create({
			value: 4,
			roadId: 1
		})
	})
	.then(function(){
		Rating.create({
			value: 2,
			roadId: 2
		})
	})
	.then(function(){
		Rating.create({
			value: 3,
			roadId: 2
		})
	})
	.then(function(){
		Rating.create({
			value: 3,
			roadId: 3
		})
	})
	.then(function(){
		Rating.create({
			value: 4,
			roadId: 3
		})
	})
	.then(function(){
		Rating.create({
			value: 5,
			roadId: 4
		})
	})
	.then(function(){
		Rating.create({
			value: 4,
			roadId: 4
		})
	})
	.then(function(){
		Rating.create({
			value: 5,
			roadId: 5
		})
	})
	.then(function(){
		Rating.create({
			value: 4,
			roadId: 5
		})
	})
	.then(function(){
		Rating.create({
			value: 4,
			roadId: 6
		})
	})
	.then(function(){
		Rating.create({
			value: 2,
			roadId: 6
		})
	})
	.then(function(){
		Rating.create({
			value: 2,
			roadId: 7
		})
	})
	.then(function(){
		Rating.create({
			value: 3,
			roadId: 7
		})
	})
	.then(function(){
		Rating.create({
			value: 3,
			roadId: 8
		})
	})
	.then(function(){
		Rating.create({
			value: 1,
			roadId: 8
		})
	})
	app.listen(3000, () => {
		console.log('server has started');
	});
})

