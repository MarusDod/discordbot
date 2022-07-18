const fs = require('fs')
const {Dropbox} = require('dropbox')
const dotenv = require('dotenv')

dotenv.config();

class DropBoxIterator {
     constructor(path){
 
        this.db = new Dropbox({
            //clientId: process.env.dropboxkey,
            //clientSecret: process.env.dropboxsecret,
            accessToken: process.env.dropboxaccesstoken
        });


        this.path = path;
     }

     async fetchFolder() {
         try{
             let data = (await this.db.filesListFolder({path:this.path})).result

             this.filenames = data.entries.map(x => x.name)

             while (data.has_more) {
                 data = (await this.db.filesListFolderContinue({cursor: data.cursor})).result
                 this.filenames.concat(data.entries.map(x => x.name))
             }
         }
         catch(err){
             console.error(err)
         }

         this.length = this.filenames.length

         return this
     }

    async filenameDownload(name){
        let path = this.path + '/' + name
        console.log(path)
        let response = await this.db.filesDownload({path})

        return {
            buffer:new Buffer.from(response.result.fileBinary),
            fileName: name
        }
    }

    async fileDownload(index){
        let path = this.path + '/' + this.filenames[index]
        console.log(path)
        let response = await this.db.filesDownload({path})

        console.log(index)

        return {
            buffer:new Buffer.from(response.result.fileBinary),
            fileName: this.filenames[index]
        }
    }

    async DownloadRandomFile(){
        let seed = (new Date()).getTime();
        let x = Math.sin(seed++) * 10000;
        let index = Math.floor((x - Math.floor(x)) * this.length);

        return await this.fileDownload(index)
    }
}

module.exports = DropBoxIterator

/*let url = '/PepeZip';

(async () => {
    try {
        let acc = await (new DropBoxIterator(url)).fetchFolder()
        await acc.DownloadRandomFile()
    }
    catch(err){
        console.error(err)
    }
})()*/
