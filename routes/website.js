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
    Post.findOne({_id: req.params.id}).lean().populate('post').then((posts)=>{
            res.render('website/ler', {posts: posts})
        
    })
})

module.exports = router