const { time } = require('console');
const fs = require('fs');
const path = require('path');
const DropBoxIterator = require('../dropbox')
const {MessageAttachment} = require("discord.js");

var memesPath = '/pepespt'

module.exports = {
    name: 'pepept',
    description: 'ywnbaw!',
    async execute(message, args) {

        let db = await (new DropBoxIterator(memesPath)).fetchFolder()
        let {buffer,fileName} = await db.DownloadRandomFile()
        const attachment = new MessageAttachment(buffer,fileName)

        await message.channel.send(attachment);

    },
};
