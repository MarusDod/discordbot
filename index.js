#!/usr/bin/env node

const discord = require('discord.js')
const fs = require('fs');
const format = require('date-format');

require('dotenv').config();


const bbEmoji  = '🇧';
const bbRoleID  = '928113676915974264';

const pfEmoji  = '🇵';
const pfRoleID  = '928113816443699210';

const testServer = '977534055744684032';
const proteinaServer = '822125327722610705';

const projInfServer = '943263437100843068';
//const projInfServer = '851906757839945731'; //test
const projRole = '822126081867382784'
//const projRole = '929458664165736498' //test


let negativeWords = [
    'não',
    'nao',
    'not',
    'never',
    'nunca',
    'dont',
    'don\'t',
];

const {db} = require('./firebase.js');

const client = new discord.Client({
    intents: [
	    discord.GatewayIntentBits.Guilds,
	    discord.GatewayIntentBits.MessageContent,
	    discord.GatewayIntentBits.GuildMessages,
	    discord.GatewayIntentBits.GuildMessageReactions,
	    discord.GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const setBotActivity = status => 
    db.collection('logs').doc(new Date().getTime().toString()).set({status})

entregaDate = new Date("September 8, 2022 09:00:00 UTC+1")

client.once('ready', async () => {
	console.log('ready!')

	setBotActivity('online')
	client.user.setActivity('data farming this server')

})

client.on('messageCreate', async message => {
    if(message.author.bot || ![testServer,proteinaServer].includes(message.guild.id)) return;

    {
        let sentence = message.content.split(' ')
        let creditoSocial = 0
        let forbiddenWords = (await db.collection('badWords').get()).docs.map(doc => doc.data())

        forbiddenWords.forEach(combination => {
            if (combination.words.every(x => sentence.findIndex(y => y.indexOf(x) !== -1) !== -1)) {
                creditoSocial += combination.desconto
            }
        })

        if (creditoSocial !== 0) {

            var plus = true;
            sentence.forEach(word => plus ^= negativeWords.includes(word))

            if (plus == false)
                creditoSocial = -creditoSocial

            db.collection('cidadaos')
                .where('userID','==',message.author.id)
                .where('channelID','==',message.guild.id)
                .get()
                .then(async val => {
                    let newVal = {
                            userID: message.author.id,
                            channelID: message.guild.id,
                            credito: creditoSocial,
                    }
                    
                    if (val.empty){
                        db.collection('cidadaos').doc().set(newVal)
                    }

                    else{
                        const doc = val.docs[0]
                        const credito = doc.data().credito
                        doc.ref.update({
                            credito: credito + creditoSocial
                        })

                        newVal.credito = credito + creditoSocial
                    }

                    message.reply(`o teu crédito social acabou de ${creditoSocial > 0 ? "subir": "descer"} ${Math.abs(creditoSocial)} pontos. Crédito atual: ${newVal.credito}`)
                })
        }
    }

    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    const args = message.content.slice(process.env.prefix.length).trim().split(' ');
    const command = args.shift();

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        //message.reply('there was an error trying to execute that command!');
    }
})

/*
client.on('guildMemberAdd', member => {      
    if(member.guild.id != "928100616797061210"){
        return;
    }

    console.log("hello",member)
    const message = member.guild.channels.cache.find(i => i.id == '928100616797061210').send(`méquié ${member.}`)

    const embed = new Discord.MessageEmbed()
        .setTitle('Escolhe a tua role')
        .setColor('#DAF7A6')
    )

    const message = member.guild.channels.get('928113089939923044').send(embed);


    message.react(bbEmoji)
    message.react(pfEmoji)
});
*/

client.on('messageReactionAdd', async (reaction, user) => {
	console.log(reaction.message.channel.id)
	console.log(reaction.message.id)
    //console.log(reaction.message.reactions.cache.map(r => r.users.cache))
    //return;
    if(user.bot == true){
        return;
    }

    if(![proteinaServer,testServer].includes(reaction.message.guild.id)){
        return;
    }

    const polls = (await db.collection('poll')
                            .where('channelID','==',reaction.message.channel.id)
                            .where('messageID','==',reaction.message.id)
                            .get()).docs

    if(polls.length == 0){
        return;
    }

    //const pollMessage = await reaction.channel.messages.fetch(polls[0].data().messageID)
    let found = 0

    reaction.message.reactions.cache.forEach(r => {
        if(r.users.cache.find(u => u == user.id) != undefined){
            ++found
        }
    })

    if(found >= 2){
        reaction.users.remove(user)
    }

});

client.on('messageDelete', async message => {
    if(message.author.bot)
        return;

    let match = client.commands.get('p').deletableMessages.find(val => val.sentMessage == message.id)
    console.log(match)

    if(match){
        try {
            await (await message.channel.messages.fetch(match.botReply)).delete()
            delete match
        }
        catch(err){
            console.error("error while deleting:"  +err)
        }
    }
})

client.once('exit',async () => {
    await setBotActivity('offline')
    process.exit(0)
})

process.on('SIGINT', function() {
    client.emit('exit')
});

client.login(process.env.token);
