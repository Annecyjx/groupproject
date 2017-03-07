const express = require('express');
const app = express();
const fs = require('fs');
const pug = require('pug');

app.use(express.static('static'));
//app.use(bodyParser.urlencoded( { extended: true }  ));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');


app.get('/', (request, response) => {
	response.render('index')
})

app.listen(3000, () => {
	console.log('////////////////////Server has started///////////////////////')
})