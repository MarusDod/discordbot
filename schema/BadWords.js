const mongoose = require('mongoose')

const wordsSchema = new mongoose.Schema({
    desconto: Number,
    words: [String],
})

const BadWords = mongoose.model('badWords',wordsSchema,'badWords')

module.exports = BadWords