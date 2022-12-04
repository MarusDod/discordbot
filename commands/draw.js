const openai = require('../openai')

module.exports = {
    name: 'draw',
    description: 'ywnbaw!',
    async execute(message, args) {
        try {
            const completion = await openai.createImage({
                prompt: args.join(' '),
                size: "512x512",
            })

            if(completion.status == 200){
                message.reply(completion.data.data[0].url)
            }
            else{
                message.reply('couldn\'t get image')
            }
        }
        catch(err){
            message.reply(err.response.data.error.message)
        }
    },
};