const dotenv = require('dotenv').config();
const fetch = require('node-fetch');

myplaylist = 'PLCD0445C57F2B7F41'

class PlayListPLayer {
    constructor(playlist_id,api_key){
        this.playlist_id = playlist_id;
        this.api_key = api_key
        this.index = 0
        this.response = null

    }

    get_playlist_url(){
          return 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=' + this.playlist_id + '&key=' + this.api_key
    }

    async fetch_playlist(){
        this.response = await (await (fetch(this.get_playlist_url()))).json()
    }

    get_current(){
        return this.response.items[this.index].etag
    }

    next(){
        this.index++;

        if (this.index >= this.response.pageInfo.totalResults){
            return null;
        }

    }

}

let obj = new PlayListPLayer(myplaylist,process.env.youtubeapi)
obj.fetch_playlist()
    .then(_ => {
        console.log(obj.get_current())
        obj.next()
        console.log(obj.get_current())
    })
