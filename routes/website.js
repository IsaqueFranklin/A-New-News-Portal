const express = require('express')
const router = express.Router()
const path = require('path')
const mongoose = require('mongoose')

require('../models/admin')
const Admin = mongoose.model('admins')

require('../models/posts')
const Post = mongoose.model('posts')

const { post } = require('./admin')

const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/ler/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).lean().then((posts)=>{
        Post.find().lean().sort({_id: -1}).limit(3).then((post)=>{
            res.render('website/ler', {posts: posts, post: post})
        })
    })
})

router.get('/vertudo', (req, res)=>{
    Post.find().lean().sort({_id: -1}).limit(60).then((posts)=>{
        res.render('website/tudo', {posts: posts})
    })
})

router.get('/perfil/:email', (req, res)=>{
    Admin.findOne({email: req.params.email}).lean().then((users)=>{
        Post.find({email: req.params.email}).sort({_id: -1}).lean().then((posts)=>{
            res.render('website/perfil', {users: users, posts: posts})
        })
    })
})

router.get('/artigos', (req, res)=>{
    Post.find({category: 'Artigo'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Artigo"}).sort({_id: -1}).limit(5).then().then((post)=>{
            res.render('website/artigos', {posts: posts, post: post})
        })
    })
})

router.get('/noticias', (req, res)=>{
    Post.find({category: 'Noticia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Noticia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/noticias', {posts: posts, post: post})
        })
    })
})

router.get('/literatura', (req, res)=>{
    Post.find({category: 'Literatura'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Literatura"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/literatura', {posts: posts, post: post})
        })
    })
})

router.get('/economia', (req, res)=>{
    Post.find({category: 'Economia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Economia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/economia', {posts: posts, post: post})
        })
    })
})

router.get('/tecnologia', (req, res)=>{
    Post.find({category: 'Tecnologia'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Tecnologia"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/tecnologia', {posts: posts, post: post})
        })
    })
})

router.get('/empreededorismo', (req, res)=>{
    Post.find({category: 'Empreendedorismo'}).sort({_id: -1}).limit(20).lean().then((posts)=>{
        Post.find({category: "Empreendedorismo"}).sort({_id: -1}).limit(5).lean().then().then((post)=>{
            res.render('website/empreededorismo', {posts: posts, post: post})
        })
    })
})

router.get('/categoria/:titulo', (req, res) => {
    Post.find({category: req.params.titulo}).sort({_id: -1}).limit(30).lean().then((posts) => {
        Post.find({category: req.params.titulo}).sort({_id: -1}).limit(6).lean().then((post) => {
            res.render('website/categorias', {posts: posts, post: post})
        })
    })
})

module.exports = router