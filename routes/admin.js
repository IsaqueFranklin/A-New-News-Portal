const express = require('express')
const router = express.Router()
const path = require('path')
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const passport = require('passport')
const { eUser } = require('../helpers/eUser')

const moment = require('moment')

require('../models/admin')
const Admin = mongoose.model('admins')

require('../models/posts')
const Post = mongoose.model('posts')


router.get('/singup', (req, res) => {
    res.render('admin/singup')
})

router.post('/singup', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido."})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida."})
    }

    if(req.body.senha.lenght < 8){
        erros.push({texto: "Senha muito curta, mínimo de 8 caracteres."})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas não batem."})
    }

    if(erros.length > 0){
        res.render('admin/registro', {erros: erros})

    }else{
        Admin.findOne({email: req.body.email}).then(function(admin){
            if(admin){
                req.flash("error_msg", "Já existe uma conta com esse email")
                res.redirect('/start/registro')
            }else{
                const novoAdmin = new Admin({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoAdmin.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento.')
                            res.redirect('/start/registro')
                        }

                        novoAdmin.senha = hash

                        novoAdmin.save().then(function(){
                            req.flash('success_msg', 'Usuário criado com sucesso!')
                            res.redirect('/admin/login')
                        }).catch(function(err){
                            req.flash('error_msg', 'Houve um erro ao criar usuário, tente novamente.')
                            res.redirect('/admin/registro')
                        })
                    })
                })
            }
        }).catch(function(err){
            req.flash('error_msg', "Houve um erro interno.")
            res.redirect('/')
        })
    }
})

router.get('/login', function(req, res){
    res.render('admin/login')
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/admin/painel',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', eUser, function(req, res){
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso.')
    res.redirect('/')
})

router.get('/publish', eUser, (req, res)=>{
    res.render('admin/publish')
})

router.post('/publish', eUser, (req, res)=>{
    var erros = []

    if(!req.body.editor || typeof req.body.editor == undefined || req.body.editor == null){
        erros.push({texto: 'Post inválido.'})
    }

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: 'Post inválido.'})
    }

    if(erros.length > 0){
        res.render('admin/publish', {erros: erros})
    }else{

        let now = new Date();

        var dateString = moment(now).format('DD/MM/YYYY');

        const novoPost = {
            conteudo: req.body.editor,
            autor: req.user.nome,
            titulo: req.body.titulo,
            data: dateString,
            thumb: req.body.thumb,
            category: req.body.category
        };

        new Post(novoPost).save().then(function(){
            req.flash('success_msg', 'Postado!');
            res.redirect('/admin/painel');
        }).catch(function(){
            req.flash('error_msg', 'Houve um erro!');
            res.redirect('/admin/publicar');
        })
    }
})

router.get('/painel', eUser, (req, res)=>{
    Post.find({ autor: req.user.nome }).sort({_id: -1}).lean().then((posts)=>{
        res.render('admin/posts', {posts: posts})
    })
})

router.get('/excluir/:id', eUser, (req, res)=>{
    Post.remove({_id: req.params.id}).lean().then(()=>{
        req.flash('success_msg', 'Deletado com sucesso.')
        res.redirect('/admin/painel')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar.')
        res.redirect('/admin/painel')
    })
})

router.get('/editar/:id', eUser, (req, res)=>{
    Post.findOne({_id: req.params.id}).lean().then((posts)=>{
        res.render('admin/editar', {posts: posts})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve algum erro.')
        res.redirect('/admin/painel')
    })
})

router.post('/editing', eUser, (req, res)=>{
    Post.findOne({_id: req.body.id}).then((posts)=>{
        posts.titulo = req.body.titulo;
        posts.conteudo = req.body.editor;
        posts.thumb = req.body.thumb;

        posts.save().lean().then(()=>{
            req.flash('success_msg', 'Perfil editado com sucesso.')
            res.redirect('/admin/painel')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro interno')
            res.redirect('/admin/painel')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a edição.')
        res.redirect('/admin/painel')
    })
})

module.exports = router