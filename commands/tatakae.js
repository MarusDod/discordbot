const fs = require('fs');
const path = require('path');
const {MessageAttachment} = require("discord.js");

const imgUrl = 'https://preview.redd.it/985fgxrmjd381.jpg?auto=webp&s=9a2192cd7095ab64132b6c82c07be637968acf7d'

module.exports = {
    name: 'tatakae',
    description: 'ereh',
    async execute(message, args) {

        await message.channel.send(imgUrl);

    },
};
