const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose')

//Config

app.use(session({
    secret: 'something',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

//Middleware

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//BodyParser

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Handlebars

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//Mongoose    

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/news').then(function(){
    console.log('Conectado ao mongo...')
}).catch(function(err){
    console.log('Erro ao conectar com mongo.')
})


//public

app.use(express.static(path.join(__dirname, 'public')))

//Routes

app.get('/', (req, res) => {
    res.render('index')
})

//Starting server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor online...')
})