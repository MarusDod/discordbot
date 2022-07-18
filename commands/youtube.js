const ytdl = require('ytdl-core-discord')
const voice = require('discord.js')
const fs = require('fs')

const Playlist = require('../playlist.js')


module.exports = {
    name: 'p',
    description: 'dar play de musicas e o crl!',
    guilds: [],
        //queue: [],
        //index: 0,
        //connection: null,
        //currentVoiceChannel: null,
    deletableMessages: [],
        //sentMessage
        //bot reply

    async execute(message, args) {
        let guild = message.guild.id
        let handler = this.guilds[guild]

        if(this.guilds[guild] == null){
            handler = this.guilds[guild] = {
                queue: [],
                index: 0,
                connection: null,
                currentVoiceChannel: null,
            }
        }

        switch (args[0]) {
            case 'help':
                await message.channel.send(`\`\`\`
                    !play 
                        <url> - "enqueues song in current voice channel"
                        <playlist> - "enqueues yt playlist in current voice channel and plays it"
                        stop - stops playing and dequeues every song
                        pause - pause
                        resume - resume
                        back - goes back one song
                        skip - goto next song
                        help - fuck you
                
                \`\`\``)
                return;
            case 'stop':
                handler.currentVoiceChannel?.leave()
                handler.currentVoiceChannel = null
                handler.queue = []
                handler.index = 0
                handler.connection = null

                return;
            case 'pause':
                await handler.connection.dispatcher?.pause()
                return;
            case 'resume':
                await handler.connection.dispatcher?.resume()
                return;
            case 'shuffle':
                let other = handler.queue.slice(handler.index+1).sort(() => Math.random() - 0.5)

                handler.queue.forEach((val,index) => {
                    if(index > handler.index){
                        handler.queue[index] = other[index-(handler.index + 1)]
                    }
                })
                return;
            case 'back':
                if(handler.index <= 0){
                    let msg = await message.channel.send("bruv, there's no previous song")

                    this.deletableMessages.push({
                        sentMessage: message.id,
                        botReply: msg.id,
                    })

                    return;
                }

                handler.index -=2;
                await handler.connection.dispatcher?.end()
                return
            case 'skip':
                await handler.connection.dispatcher?.end()
                return
            case null:
            case undefined:
            case '':
                let msg = await message.channel.send('no arguments bruv...')

                this.deletableMessages.push({
                    sentMessage: message.id,
                    botReply: msg.id,
                })
                delete msg

                return;
            default:

                const voiceChannel = message.member.voice.channel

                //const cookies = fs.readFileSync('./cookies.txt')

                if (!voiceChannel) {
                    let msg = await message.channel.send('you need to be in a voice channel for that bruv...')

                    this.deletableMessages.push({
                        sentMessage: message.id,
                        botReply: msg.id,
                    })

                    return;
                }

                const permissions = voiceChannel.permissionsFor(message.client.user)

                if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                    let msg = await message.channel.send('you dont have permission for that bruv...')

                    this.deletableMessages.push({
                        sentMessage: message.id,
                        botReply: msg.id,
                    })

                    return;
                }
                let songs = []

                let prevLength = handler.queue.length

                if (Playlist.isPlayList(args[0])) {
                    let playlist = await (new Playlist(args[0], process.env.youtubeapi)).fetch_playlist()
                    songs = await playlist.getAll()

                    let msg = await message.channel.send(`queued ${songs.length} songs bruv`)

                    this.deletableMessages.push({
                        sentMessage: message.id,
                        botReply: msg.id,
                    })
                } else {
                    songs = args
                }

                songs.forEach(song => {
                    handler.queue.push({
                        voiceChannel: voiceChannel,
                        song
                    })
                })

                if(prevLength === 0)
                    await this.worker(guild)
        }
    },

    async worker(guild){
        let handler = this.guilds[guild]

        if(handler.index === handler.queue.length ){
            handler.currentVoiceChannel?.leave()
            return
        }

        let voiceChannel = null
        let connection = null

        if(handler.queue[handler.index].voiceChannel.id === handler.currentVoiceChannel?.id){
            voiceChannel = handler.currentVoiceChannel
            connection = handler.connection
        }
        else{
            handler.currentVoiceChannel = voiceChannel = handler.queue[handler.index].voiceChannel
            connection = await voiceChannel.join()
            handler.connection = connection
            console.log(`joined channel ${voiceChannel.id}`);
        }

        let dispatcher = connection.play(await ytdl(handler.queue[handler.index].song, {
            filter: 'audioonly',
            headers: {
                //'Cookie': cookies,
            },
        }), {type: "opus"})

        //dispatcher.on('start', () => _)
        dispatcher.on('drain',() => undefined)
        dispatcher.on('finish', async () => {

            handler.index++
            await this.worker(guild)
        })
}

};
