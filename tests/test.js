let q = {
    a: 6
}

let w = play.bind(q)
console.log(w())

function play(){
    return this.a
}

