const mongoose = require('mongoose')

require('dotenv').config();

(async () => {
    await mongoose.connect(process.env.mongodburi);

    let db = mongoose.connection

    const osSchema = new mongoose.Schema({
        distro: {
            type: String
        },
        version: {
            type: Number
        },
        ini: {
            type: String
        },
        DE: {
            type:String
        },
    })

    const OS = mongoose.model('OperatingSystem',osSchema)

    const manyOS = [
        {
            distro: "boontu",
            version: 20,
            ini: "systemd",
            DE: "gnome",
        },
        {
            distro: "arch",
            version: 10,
            ini: "openrc",
            DE: "kde",
        },
        {
            distro: "gentoo",
            version: 10,
            ini: "initrc",
            DE: "xfce",
        },
    ];

    /*await OS.insertMany(manyOS,err => {
        if(err){
            console.error(err)
            return;
        }

        console.log("successfully inserted many OS's")
    })*/

    let os = new OS({
        init: "systemd",
        distro: "linux mint"
    })
    await os.save()

    try {
        let records = await OS.find({})
        console.log(records[0])
    }
    catch(err){
        console.error(err)
    }

    await mongoose.disconnect()

})()

