const admin = require('firebase-admin')

const serviceAccount = require('./pepediscord-8fa72-firebase-adminsdk-d9i5t-eb7fa4f257.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

module.exports.db = db

/*db.collection('test').doc('hey').set({
    fds:'crl'
})*/

function importJson(){
    const badWords = require('./schema/badWords.json').map(({desconto,words,_id}) => ({id:_id.$oid,desconto,words}))
    const cidadaos = require('./schema/cidadaos.json').map(({userID,channelID,credito,_id}) => ({id:_id.$oid,userID,channelID,credito}))

    badWords.forEach(words => {
        db.collection('badWords').doc(words.id).set(words)
    })

    cidadaos.forEach(cidadaos => {
        db.collection('cidadaos').doc(cidadaos.id).set(cidadaos)
    })
}

function deletePresenceUser(id){
    db.collection('presence').where('userID','==',id).get().then(val => {
        val.docs.forEach(doc => {
            doc.ref.delete()
        })
    })
}


module.exports.deletePresenceUser = deletePresenceUser
module.exports.importJson = importJson