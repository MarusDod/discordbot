require('dotenv').config();

const db = require('../firebase.js').db

const emojiOptions = [
    {name: ':regional_indicator_a:',unicode: '🇦'},
    {name: ':regional_indicator_b:',unicode: '🇧'},
    {name: ':regional_indicator_c:',unicode: '🇨'},
    {name: ':regional_indicator_d:',unicode: '🇩'},
    {name: ':regional_indicator_e:',unicode: '🇪'},
    {name: ':regional_indicator_f:',unicode: '🇫'},
    {name: ':regional_indicator_g:',unicode: '🇬'},
]

const pollEmoji = ':cold_face:'

module.exports = {
    name: 'poll',
    description: 'Create a poll',
    async execute(message, args) {
		console.log(args)
        if(args[0] == 'close'){
            this.close(message,args[1])
            return
        }

        const quotedArgs = args.join(' ').match(/\w+|"[^"]+"/g)

        const pollTitle = quotedArgs.shift().replace(/['"]+/g, '')
        

        const fields = quotedArgs.map((arg,index) => ({
            name: emojiOptions[index].name,
            value: arg.replace(/['"]+/g, ''),
            inline:false
        }))

        const timestamp = new Date().getTime().toString()


        const pollMessage = await message.channel.send({embeds: [{
            title: `${pollEmoji} ${pollTitle}`,
            description: `poll #${timestamp}`,
            fields}]})

        db
            .collection('poll')
            .doc(timestamp)
            .set({
                channelID: message.channel.id,
                messageID: pollMessage.id,
                title: pollTitle,
                options: fields.map(f => f.value),
                reactions: null
            })

        fields.forEach((_,index) => pollMessage.react(emojiOptions[index].unicode))

    },

    async close(message,timestamp){
	    console.log("timestamp " + timestamp)
        if(timestamp[0] == '#'){
            timestamp = timestamp.substring(1)
        }

        const poll = await db.collection('poll')
            //.where('channelID','==',timestamp)
            .doc(timestamp).get()

        if(poll.data().reactions != null){
            message.channel.send(`poll #${timestamp} is already closed!!`)
            return;
        }

        const pollMessage = await message.channel.messages.fetch(poll.data().messageID)

        const reactions = pollMessage.reactions.cache
            .filter(item => emojiOptions.find(o => o.unicode == item._emoji.name))
            .map(item => ({
                option: item._emoji.name,
                count: item.count
            }))

        await poll.ref.update({reactions})
	    console.log(reactions)

        if(reactions.length == 0){
            message.channel.send({embeds: [{
                title: `${pollEmoji} poll #${timestamp} closed!`,
                description: `no clear winner :(`
            }]})

            return;
        }

        const victor = reactions.reduce((prev,cur) => prev.count > cur.count ? prev: cur)
        const victorMessage = poll.data().options[emojiOptions.findIndex(e => e.unicode == victor.option)]

        message.channel.send({embeds: [{
            title: `${pollEmoji} poll #${timestamp} closed!`,
            description: `option "${victorMessage}" is the clear winner!`
        }]})
    }
}
