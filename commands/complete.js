const openai = require('../openai')

module.exports = {
    name: 'complete',
    description: 'ywnbaw!',
    async execute(message, args) {
        openai.crea
        try {
            const completion = await openai.createCompletion({
                model: "text-davinci-002",
                //model: "code-davinci-002",
                //model: "code-cushman-001",
                prompt: args.join(' '),
                temperature: 0.5,
                max_tokens: 1000

            })

            if(completion.status == 200){
                message.reply(completion.data.choices[0].text)
            }
            else{
                message.reply('couldn\'t get image')
            }

            if(completion.data.error){
                console.log(completion.data.error)
            }
        }
        catch(err){
            message.reply(err.response.data.error)
        }
    },
};