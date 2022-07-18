require('dotenv').config();
const client = new (require('coinmarketcap-api'))(process.env.COIN_API_KEY);



module.exports = {
    name: 'projeto',
    description: 'dias até entrega do projeto!',
    execute(message, args) {
        const oneDay = 24*60*60 * 1000; // hours*minutes*seconds*milliseconds
        const currDate = new Date()
        const oneSecond = 1000; // hours*minutes*seconds*milliseconds
	const diffSeconds = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneSecond));
	let delta = diffSeconds

	const hours = Math.floor(diffSeconds / 3600)
	delta -= hours * 3600
	
	const minutes = Math.floor((diffSeconds / 60) % 60)
	delta -= minutes * 60
	const seconds = delta % 60

        //const diffDays = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneDay));

        //message.channel.send('o que interessa é ter saúde :)')
        //message.channel.send(`faltam ${diffDays} dias para a entrega do projeto`)
        message.channel.send(`faltam ${hours} horas ${minutes} minutos e ${seconds} segundos para entregar o projeto ou fudeu`)
    },
};
