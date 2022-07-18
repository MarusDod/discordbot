const fs = require('fs')
const youtubedl = require('youtube-dl')

const vidpath = `${__dirname}/../videos/`

const video = youtubedl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

video.on('info', info => {
    console.log('downloading...')
    console.log('filename' + info._filename)
    console.log('size',info.size)
})

video.pipe(fs.createWriteStream(`${vidpath}/video.mp4`))