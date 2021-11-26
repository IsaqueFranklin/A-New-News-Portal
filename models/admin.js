const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema({
    nome: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    senha: {
        type: String,
        required: true,
    },

    eAdmin: {
        type: Number,
        default: 1,
    }
})

mongoose.model('admins', Admin)