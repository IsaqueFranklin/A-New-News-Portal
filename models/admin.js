const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema({
    nome: {
        type: String,
    },

    email: {
        type: String,
    },

    senha: {
        type: String,
    },

    bio: {
        type: String
    },

    eAdmin: {
        type: Number,
        default: 1,
    }
})

mongoose.model('admins', Admin)