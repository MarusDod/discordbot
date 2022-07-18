const mongoose = require('mongoose')

const cidadaoSchema = new mongoose.Schema({
    userID: String,
    channelID: String,
    credito: Number,
})

const Cidadao = mongoose.model('Cidadao',cidadaoSchema)

module.exports = Cidadao
