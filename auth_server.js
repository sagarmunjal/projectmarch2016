var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var mongoStore = require('connect-mongo')({session:expressSession})
var mongoose = require('mongoose')

require('./models/users_model.js')
var conn = mongoose.connect('mongodb://127.0.0.1/astro')
var app = express()
app.engine('.html',require('ejs').__express)
app.set('views',__dirname + '/views')
app.set('view engine','html')
app.use(bodyParser.json())
app.use(expressSession({
	resave: true,
    saveUninitialized: true,
	secret:'SECRET',
	cookie:{maxAge:60*60*1000},
	store: new mongoStore({
		url: 'mongodb://localhost/astro' ,
		collection: 'sessions'
	})

}))
require('./routes')(app)
app.listen(8080)