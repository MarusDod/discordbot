const fs = require('fs');
const path = require('path');
const DropBoxIterator = require('../dropbox')
const {AttachmentBuilder} = require("discord.js");

//manda foder este
var memesPath = '/Pintassilgo'
var meme = memesPath + 'pintassilgoestudeiro.png'

let id = '244228141441089547'

module.exports = {
    name: 'pintassilgo',
    description: 'ywnbaw!',
    async execute(message, args) {

        let db = await (new DropBoxIterator(memesPath)).fetchFolder()
        let {buffer,fileName} = await db.DownloadRandomFile()
        const attachment = new AttachmentBuilder(buffer,{name: fileName})

        message.channel.send({content: `<@${id}>`,files: [attachment] });

    },
};
