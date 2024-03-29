const client = new (require('coinmarketcap-api'))(process.env.COIN_API_KEY);
const {db} = require('../firebase.js');

const {getAtivo} = require('./ativarVrau.js')

const me = '975711811083067422'
const vrau = '158715505614651394'


module.exports = {
    name: 'projeto',
    description: 'dias até entrega do projeto!',
    async execute(message, args) {
	if(message.author.id == vrau){
            //message.reply(`vai pó caralho vrau`)
	    const ativo = await getAtivo(vrau)

	    if(ativo === false){
		    await message.delete();
		    return
	    }
	}

        const oneDay = 24*60*60 * 1000; // hours*minutes*seconds*milliseconds
        const currDate = new Date()
        const oneSecond = 1000; // hours*minutes*seconds*milliseconds
	const diffMillis = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime())));
	let delta = diffMillis

	const days = Math.floor(diffMillis / (1000 * 3600 * 24))
	delta -= days * 3600 * 1000 * 24

	const hours = Math.floor(((diffMillis / 1000) / 3600)  % 24)
	delta -= hours * 3600 * 1000
	
	const minutes = Math.floor((diffMillis / (60 * 1000)) % 60)
	delta -= minutes * 60 * 1000
	const seconds = Math.floor((delta /1000) % 60)
	delta -= seconds * 1000

	const milis = delta % 1000

        //const diffDays = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneDay));

        //message.channel.send('o que interessa é ter saúde :)')
        //message.channel.send(`faltam ${diffDays} dias para a entrega do projeto`)
        message.channel.send(`faltam ${days} dias ${hours} horas ${minutes} minutos ${seconds} segundos e ${milis} milissegundos para a entrega do projeto`)
    },
};
