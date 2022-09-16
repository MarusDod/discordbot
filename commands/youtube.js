const ytdl = require('ytdl-core-discord')
const discord = require('discord.js')
const voice = require('@discordjs/voice');
const ytfps = require('ytfps');
const fs = require('fs')

const Playlist = require('../playlist.js')

module.exports = {
    name: 'p',
    description: 'dar play de musicas e o crl!',
    async execute(message, args) {
	const voiceChannel = message.member.voice.channel
	const voiceGuild = message.guild

	switch(args[0]){
		case null:
		case undefined:
		case '':
			message.reply('no arguments bruv')
			break;
		case 'help':
		    await message.channel.send(`\`\`\`
			    !play
				<url> - enqueues song in current voice channel
				<playlist> - enqueues yt playlist in current voice channel and plays it
				stop - stops playing and dequeues every song
				shuffle - shuffles songs
				loop - loop song
				unloop - turn off loop
				pause - pause
				resume - resume
				back - goes back one song
				skip [n] - goto next song
				help - fuck you

			\`\`\``)
			break;
		case 'shuffle': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("shuffle")
			voiceChannel.send('shuffling...')
			break;
		}
		case 'stop': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("stop")
			break;
		}
		case 'loop': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("loop")
			break;
		}
		case 'unloop': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("unloop")
			break;
		}
		case 'resume': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("resume")
			break;
		}
		case 'pause': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("pause")
			break;
		}
		case 'skip': {
			const connection = voice.getVoiceConnection(voiceGuild.id)
			connection.emit("skip",args[1] ?? "1")
			break;
		}
		default:
			this.enqueueSong(voiceGuild,voiceChannel,args[0])
	}

    },
    async enqueueSong(voiceGuild,voiceChannel,url) {
	let songs = []
	let index = 0
	let loop = false
	let id = Playlist.isPlayList(url)

	if(id){
		songs = (await ytfps(id)).videos.map(m => m.url)

		await voiceChannel.send(`queued ${songs.length} songs bruv`)
	}
	else {
		songs = [url]
		await voiceChannel.send(`queued ${url} bruv`)
	}

	const connection = voice.joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: voiceGuild.id,
		adapterCreator: voiceGuild.voiceAdapterCreator,
		selfDeaf: false,
		selfMute: false,
	});

	const player = voice.createAudioPlayer({
		behaviours: {
			noSubscriber: voice.NoSubscriberBehavior.Stop
		}
	})

	const playSong = async song => {
		const resource = voice.createAudioResource(await ytdl(song, {
			    filter: 'audioonly',
			}))

		player.play(resource)
	}

	player.on(voice.AudioPlayerStatus.Playing, () => {
		voiceChannel.send(`The audio player has started playing! ${songs[index]}`);
	});

	player.on('error', err => {
		console.error(err)
	})

	player.on(voice.AudioPlayerStatus.Idle, () => {
		if(loop === false){
			++index
		}

		songs[index] ?
			playSong(songs[index])
			:
			connection.destroy()
	});

	
	const subscription = connection.subscribe(player)

	connection.on(voice.VoiceConnectionStatus.Ready, () => {
		console.log(`The connection has entered ${voiceChannel.id}`);

		playSong(songs[index])
	});

	connection.on("stop", async () => {
		await subscription.unsubscribe()
		await player.stop()
		await connection.destroy()
	});

	connection.on("pause", () => {
		player.pause()
	});

	connection.on("loop", () => {
		loop = true
	});

	connection.on("unloop", () => {
		loop = false
	});

	connection.on("shuffle", () => {
		for(let i = songs - 1; i > 0; i--){
			const j = Math.floor(Math.random() + 1)

			[songs[j],songs[i]] = [songs[i],songs[j]]
		}
	});

	connection.on("skip", async num => {
		await player.pause()

		index += parseInt(num)

		songs[index] ?
			playSong(songs[index])
			:
			connection.destroy()
	});

	connection.on("resume", () => {
		player.unpause()
	});

	connection.on(voice.VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
		console.log(newState)
		try {
			await Promise.race([
				voice.entersState(connection, voice.VoiceConnectionStatus.Signalling, 1_000),
				voice.entersState(connection, voice.VoiceConnectionStatus.Connecting, 1_000),
			]);
		} catch (error) {
			console.log("disconnected",error)
			connection.destroy();
		}
	});

    },
}
