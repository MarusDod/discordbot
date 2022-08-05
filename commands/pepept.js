const { time } = require('console');
const fs = require('fs');
const path = require('path');
const DropBoxIterator = require('../dropbox')
const {AttachmentBuilder} = require("discord.js");

var memesPath = '/pepespt'

module.exports = {
    name: 'pepept',
    description: 'ywnbaw!',
    async execute(message, args) {

        let db = await (new DropBoxIterator(memesPath)).fetchFolder()
        let {buffer,fileName} = await db.DownloadRandomFile()
        const attachment = new AttachmentBuilder(buffer,{name: fileName})

        await message.channel.send({files: [attachment]});

    },
};
