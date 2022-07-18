const Telegram = require('node-telegram-bot-api');
const { time } = require('console');
const fs = require('fs');
const DropBoxIterator = require('./dropbox')

const Promise = require('bluebird');
  Promise.config({
    cancellation: true
  });

const dotenv = require('dotenv').config();



const token = process.env.telegramtoken
const bot = new Telegram(token,{polling:true})


bot.onText(/pepept|pepe/,async (msg,match) => {
    const chatid = msg.chat.id

    console.log(match[0])
    const memesPath = match[0] == 'pepe' ? '/PepeZip' : '/pepespt';

    try{

        let db = await (new DropBoxIterator(memesPath)).fetchFolder()
        let {buffer,fileName} = await db.DownloadRandomFile()

        await bot.sendPhoto(msg.chat.id,buffer)
    }
    catch(err){
        console.error(err)
    }



})
