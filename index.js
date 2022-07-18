#!/usr/bin/env nodejs

const discord = require('discord.js')
const fs = require('fs');
const { execSync } = require('child_process');
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
const myIntents = new discord.Intents(['GUILD_PRESENCES']);
const client = new discord.Client({
    intents: myIntents
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

entregaDate = new Date("2022-7-18 UTC")

client.once('ready', async () => {
    console.log('ready!')

    /*const guild = client.guilds.cache.find(guild => guild.id == '822125327722610705');
    const roleEI = guild.roles.cache.find(role => role.id == "822126081867382784")

    const member = await guild.members.fetch('975711811083067422');
    member.roles.add(roleEI)*/

    setBotActivity('online')

    /*const projChannel = client.channels.cache.get(projInfServer)
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const notifHour = 0;
    const notifMinute = 0;

    let prevPin = undefined

    cron.schedule(`${notifMinute} ${notifHour} * * *`,() => {
        const currDate = new Date()

        const diffDays = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneDay));
        projChannel
            .send(`<@&${projRole}> faltam ${diffDays} dias até à entrega`)
            .then(async msg => {
                const pin = await msg.pin()

                if(prevPin){
                    await prevPin.unpin()
                }

                prevPin = pin
            })
        
        //console.log(`faltam ${diffDays} dias prá entrega`);
    })*/
})

client.on('message', async message => {
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
    const command = args.shift().toLowerCase();

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
                            .where('reactions','==',null)
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

client.on("presenceUpdate", function (oldPresence, newPresence) {
    const sendTelemetry = (presence,change) => {
        const obj = {
            change,
            userID: presence.user.id,
            status: presence.status,
            devices: presence.clientStatus,
            activities: presence.activities.map(a => ({name:a.name,type:a.type}))
        }

        db.collection('presence')
            .doc(new Date().getTime().toString())
            .set(obj)
    }

    if(newPresence.user.id == process.env.NSUR && newPresence.guild.id == proteinaServer){
        console.log('hey')
        if(!oldPresence){
            sendTelemetry(newPresence)
            return;
        }

        if(oldPresence.status != newPresence.status){
            sendTelemetry(newPresence,'status')
        }
        else if(JSON.stringify(oldPresence.clientStatus) != JSON.stringify(newPresence.clientStatus)){
            sendTelemetry(newPresence,'devices')
        }

        else if(
            !(oldPresence.activities.length == 0 && newPresence.activities.length == 0)
            && (
                (oldPresence.activities.length != newPresence.activities.length)
                || (oldPresence.activities[0].name != newPresence.activities[0].name)
            )){
            sendTelemetry(newPresence,'activities')
        }

    }
})

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
