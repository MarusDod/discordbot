const dotenv = require('dotenv').config();
const fetch = require('node-fetch');

class PlayListPLayer {
    constructor(url,api_key,pageSize = null){
        this.playlist_id = PlayListPLayer.isPlayList(url);

        if(!this.playlist_id){
            throw new URIError("invalid url")
        }

        this.pageSize = pageSize

        this.api_key = api_key
        this.index = 0
        this.response = null

    }

    static isPlayList(url){
        let matches = url.match(/playlist\?list=(.*)/)

        return matches ? matches[1] : null
    }

    async fetch_playlist(){
        let req = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${this.playlist_id}${this.pageSize ? '&maxResults=' + this.pageSize : ""}&key=${this.api_key}`
        this.response = await (await (fetch(req))).json()

        return this
    }

    async getAll(){
        let arr = []

        do{
            arr.push(this.current())
            await this.next()
        }while(!this.done())

        return arr
    }

    async reset(){
        this.index = 0
        while(this.response['prevPageToken'] != undefined){
            let response = await (await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${this.playlist_id}&pageToken=${this.response.prevPageToken}&key=${this.api_key}`)).json()
        }
    }

    done() {
        return this.response.items[this.index] == undefined || (this.response['nextPageToken'] == undefined && this.index > this.response.pageInfo.resultsPerPage);
    }

    current(){
        return `https://www.youtube.com/watch?v=${this.response.items[this.index].snippet?.resourceId.videoId}`
    }

    async next(){
        if (this.done()){
            return null;
        }

        this.index++

        if(this.index >= this.response.pageInfo.resultsPerPage){
            this.response = await (await (fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${this.playlist_id}&pageToken=${this.response.nextPageToken}&key=${this.api_key}`))).json()
            this.index = 0
        }
    }

}

module.exports = PlayListPLayer




async function main() {
    let myplaylist = 'https://www.youtube.com/playlist?list=PLpYWKGMgRA1uU9lyMtR8vQBzc4HrjpqYu';

    (async () => {

        try {
            let playlist = await (new PlayListPLayer(myplaylist, process.env.youtubeapi)).fetch_playlist()
            console.log(await playlist.getAll())
        } catch (err) {
            console.log(err)
        }

    })()
}
