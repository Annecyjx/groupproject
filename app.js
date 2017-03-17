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
	latA: Sequelize.DECIMAL,
	lngA: Sequelize.DECIMAL,
	latB: Sequelize.DECIMAL,
	lngB: Sequelize.DECIMAL,
})

app.get('/', (req, res) => {
	Roads.findAll()
	.then(function(result){
		console.log('result is:')
		console.log(result)
		res.render('index', {roads: result})
	})
});


app.post('/', (req, res)=> {
	console.log('console.logging value')
	console.log(req.body.value)
	console.log('req.body is:')
	console.log(req.body)
	var thisCountry = req.body.value
	if (thisCountry === "all") {
		Roads.findAll()
		.then((result) => {
			// console.log('result is:')
			// console.log(result)
			res.send({roads: result})
		})
	} else {
		Roads.findAll({
			where: {
				country: thisCountry
			}
		})
		.then((result) => {
			//console.log('spcRoad result is:')
			//console.log(result)		
			res.send({roads: result})
		})
	}
})



app.get('/specroute',(req,res)=>{
	if (req.query.countryName =='all'){
		Roads.findAll()
		.then((result)=>{
			res.send(result)
		})
	}
	else{
			Roads.findAll({
		where: {
			country: req.query.countryName
		}
	})
	.then((result) => {
		// console.log('req.query is:')
		// console.log(req.query)
		res.send(result)
	})
	}

})

app.post('/login', (req, res) => {
	//console.log(req.body.username)
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
		//console.log(user)
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
	//console.log('signup post request is working')  //testing purposes
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
		//Route Germany Stuttgart to Bazel  
		Roads.create({
			routename: "The Romantic Route",
			rating: 4,
			description: "This road will take you to beautiful views in the southern Germany. The recommend tour duration is one day. Like castles? Like mountains and rivers? Take this one!",
			country: "Germany",
			latA:48.775814,
			lngA:9.182862,
			latB:47.559602,
			lngB:7.588579,
		})
	.then(() => {
		//Route Ireland, Glassamucky Mountain to Laragh East 
		Roads.create({
			routename: "The Scenic Route",
			rating: 5,
			description: "Ireland's one of the most picturesque drives. Discover Ireland’s most scenic stretches of asphalt. ",
			country: "Ireland",
			latA:53.221087,
			lngA:-6.313617,
			latB:53.016564,
			lngB:-6.301745,

		})
	})
	.then(() => {
		//Route Bosnia & Herzegovina:  Toplica to Zavidovići 
		Roads.create({
			routename: "The dynamic Route",
			rating: 3,
			description: "What makes the route unique is that no other place in Europe has such a harmonious mix of styles, cultures and religions.",
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
			routename: "The Exploration Route",
			rating: 3,
			description: "Please enjoy stunning nature scenery along the national tourist route in Northern Europe and find hidden gems along the way.",
			country: "Norway",
			latA:61.571045,
			lngA:6.480814,
			latB:62.926029,
			lngB:11.139721,
		})
	})
	.then(() => {
		//Route Spain:  Asturias to Gipuzkoa
		Roads.create({
			routename: "The perfect Northern Spain Route",
			rating: 3,
			description: "This epic driving adventure takes you through cool Spanish cities, historic villages, soaring mountains and a dramatic coastline. Northern Spain is fantastic choice!",
			country: "Spain",
			latA:43.563207,
			lngA:-6.931862,
			latB:43.310456,
			lngB:-1.886157,
		})
	})
	.then(() => {
		//Route Italy: Fiastra to Amendolea
		Roads.create({
			routename: "Need to know Route",
			rating: 3,
			description: "You cannot miss Italy which offers you plenty of epic driving.Discover what makes them so special and kick your trip.",
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
			routename: "The amazing Route",
			rating: 3,
			description: "Romania offers countless breathtaking views from the road, from the high-altitude mountains roads to those that follow river valleys and long defiles. When it comes to spectacular roads, Romania occupies one of the first places in Europe",
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
			routename: "The Bluesky Route",
			rating: 3,
			description: "Driving in Austria is simple as there are fast and well-maintained motorways through all over the country. You will see fantastic sky ever during journey.",
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
	app.listen(3000, () => {
		console.log('server has started');
	});
})

