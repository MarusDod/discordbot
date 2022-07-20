const {db} = require('../firebase.js');

const me = '975711811083067422';
const vrau = '158715505614651394';


const getAtivo = uuid => new Promise((resolve, reject) => {
	db
	    .collection('ativos')
	    .where('uuid','==',uuid)
	    .get()
	.then(res => {
		if(res.size == 0){
			reject();
		}

		resolve(res.docs[0])
	})
});

module.exports = {
    name: 'ativarVrau',
    description: 'calar o caralho do vrau',
    getAtivo: async uuid => (await getAtivo(uuid)).data().ativo,

    async execute(message, args) {
	if(message.author.id == vrau){
	    return
	}


	getAtivo(vrau)
	    .then(doc => doc.ref.update({ativo: !doc.data().ativo,uuid:vrau}),
	    () => db.collection('ativos').doc().set({
		ativo: true,
		uuid: vrau,
	    }))
	    .then(async () => console.log((await getAtivo(vrau)).data()))
    },
};
