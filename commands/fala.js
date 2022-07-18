const fs = require('fs');
const lineReader = require('line-reader');

var falaspath = './file.txt'

module.exports = {
    name: 'fala',
    description: 'ywnbaw!',
    execute(message, args) {

        var seed = (new Date()).getTime();
        var x = Math.sin(seed++) * 10000;
        var a = Math.floor((x - Math.floor(x)) * 5424);
        var i = 0;
        var l = null;

        lineReader.eachLine(falaspath, line => {

            if(--a == 0) {
                message.channel.send(line);
                return false;
            }
        });
    },
};
