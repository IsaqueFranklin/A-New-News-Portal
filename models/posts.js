const { ObejctID } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    titulo: {
        type: String,
        required: true
    },
    data: {
        type: String
    },
    autor: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true  
    },
})

mongoose.model("posts", Post);