require('dotenv').config();
const client = new (require('coinmarketcap-api'))(process.env.COIN_API_KEY);



module.exports = {
    name: 'price',
    description: 'get cryptocurrency price',
    execute(message, args) {
        const convertCurrency = args[1] ?? 'EUR';

        client.getQuotes({symbol:args[0],convert: convertCurrency})
            .then(x => {
		try {
		    message.channel.send(`price of ${args[0]} is ${x.data[args[0]].quote[convertCurrency].price} ${convertCurrency}`)
		}
		catch(err) {
		    console.error(err)
		}
            })
        },
};
