const { time } = require('console');
const fs = require('fs');
const path = require('path');
const DropBoxIterator = require('../dropbox')
const {AttachmentBuilder} = require("discord.js");

const memesPath = '/PepeZip'

const db = (new DropBoxIterator(memesPath)).fetchFolder()

module.exports = {
    name: 'pepe',
    description: 'ywnbaw!',
    async execute(message, args) {
        try{
            //await message.delete()
        }
        catch(e){
            console.error(e)
        }

        let {buffer,fileName} = await (await db).DownloadRandomFile()
        const attachment = new AttachmentBuilder(buffer,{name: fileName})

        await message.channel.send({files: [attachment]});

    }
}
