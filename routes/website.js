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

router.get('/categoria/:titulo', (req, res) => {
    Post.find({category: req.params.titulo}).sort({_id: -1}).limit(30).lean().then((posts) => {
        Post.find({category: req.params.titulo}).sort({_id: -1}).limit(6).lean().then((post) => {
            Post.find({category: req.params.titulo}).sort({_id: -1}).limit(1).lean().then((category) => {
                res.render('website/categorias', {posts: posts, post: post, category: category})
            })
        })
    })
})

module.exports = router