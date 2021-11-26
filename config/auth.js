const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model de usuário
require('../models/admin')
const Admin = mongoose.model('admins')

module.exports = function(passport){

  passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, function(email, senha, done){
    Admin.findOne({email: email}).lean().then(function(usuario){
      if(!usuario){
        return done(null, false, {message: "Esta conta não existe."})
      }

      bcrypt.compare(senha, usuario.senha, function(erro, batem){
        if(batem){
          return done(null, usuario)
        }else{
          return done(null, false, {message: 'Senha incorreta.'})
        }
      })
    })
  }))

  passport.serializeUser(function(usuario, done){
    done(null, usuario._id);
  });

  passport.deserializeUser(function(id, done){
    Admin.findById(id, function(err, usuario){
      done(err, usuario);
    });
  })
}
