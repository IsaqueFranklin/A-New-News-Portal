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


router.get('/ler/:titulo', (req, res)=>{
    Post.findOne({titulo: req.params.titulo}).lean().then((posts)=>{
        Post.find().lean().sort({_id: -1}).limit(3).then((post)=>{
            res.render('website/ler', {posts: posts, post: post})
        })
    })
})

module.exports = router