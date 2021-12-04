const express = require('express')
const router = express.Router()
const path = require('path')
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/admin')
const Admin = mongoose.model('admins')


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
        successRedirect: '/',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', function(req, res){
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso.')
    res.redirect('/')
})

module.exports = router