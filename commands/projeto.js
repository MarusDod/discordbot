require('dotenv').config();
const client = new (require('coinmarketcap-api'))(process.env.COIN_API_KEY);



module.exports = {
    name: 'projeto',
    description: 'dias até entrega do projeto!',
    execute(message, args) {
        const oneDay = 24*60*60 * 1000; // hours*minutes*seconds*milliseconds
        const oneMinute = 60 * 1000; // hours*minutes*seconds*milliseconds
        const currDate = new Date()

        //const diffDays = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneDay));
	const diffMinutes = Math.ceil(Math.abs((entregaDate.getTime() - currDate.getTime()) / oneMinute));

        //message.channel.send('o que interessa é ter saúde :)')
        //message.channel.send(`faltam ${diffDays} dias para a entrega do projeto`)
        message.channel.send(`faltam ${Math.floor(diffMinutes) / 60}h${diffMinutes % 60} horas para entregar o projeto ou fudeu`)
    },
};
