const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose')
const website = require('./routes/website')
const admin = require('./routes/admin')
const passport = require('passport')
require('./config/auth')(passport)

import { important } from '.env';

require('./models/posts')
const Post = mongoose.model('posts')

//Config

app.use(session({
    secret: 'something',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null;
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
mongoose.connect(important).then(function(){
    console.log('Conectado ao mongo...')
}).catch(function(err){
    console.log('Erro ao conectar com mongo.')
})


//public

app.use(express.static(path.join(__dirname, 'public')))

//Routes

app.route('/website', website)
app.route('/admin', admin)

app.get('/', (req, res) => {
    Post.find().sort({_id: -1}).limit(10).lean().then((posts)=>{
        Post.find().sort({_id: -1}).limit(5).lean().then((post)=>{
            res.render('index', {posts: posts, post: post})
        })
    })
})

app.get('/Artigo', (req, res)=>{
    Post.find({category: 'Artigo'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Artigo"}).sort({_id: -1}).limit(5).then().then((post)=>{
            res.render('website/artigos', {posts: posts, post: post})
        })
    })
})

app.get('/Noticia', (req, res)=>{
    Post.find({category: 'Noticia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Noticia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/noticias', {posts: posts, post: post})
        })
    })
})

app.get('/Literatura', (req, res)=>{
    Post.find({category: 'Literatura'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Literatura"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/literatura', {posts: posts, post: post})
        })
    })
})

app.get('/Economia', (req, res)=>{
    Post.find({category: 'Economia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Economia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/economia', {posts: posts, post: post})
        })
    })
})

app.get('/Tecnologia', (req, res)=>{
    Post.find({category: 'Tecnologia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Tecnologia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/tecnologia', {posts: posts, post: post})
        })
    })
})

app.get('/Empreededorismo', (req, res)=>{
    Post.find({category: 'Empreendedorismo'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Empreendedorismo"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/empreededorismo', {posts: posts, post: post})
        })
    })
})

//Starting server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor online...')
})