const {MongoClient} = require('mongodb')

require('dotenv').config()

const client = new MongoClient(process.env.mongodburi);

(async (filter, options) => {
    try {
        await client.connect();
        console.log('connected to server...')

        let db = client.db('pepe')
        let person = db.collection('person');

        (async () => {
            await person.insertOne({
                userid: 1000,
                age: 20,
                name: 'gui',
            })

            await cursor.forEach(x => console.log(x))
        })

        //let cursor = person.find({}, {name: 'gui'})
        let res = await person.deleteMany({},{name:"marcos"})

        console.log(res)

    }
    catch(err){
        console.error(err)
    }
})()