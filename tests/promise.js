const assert = require('assert')
const fs = require('fs')
const readline = require('readline')

/*
let stream = fs.createReadStream('./tests/count.txt','utf-8');
let r = readline.createInterface(stream);

(new Promise((resolve,reject) => {
r.on('line', data => {
    resolve(data)
})
}))
.then(x => {
    console.log("here goes data: " + x)
})
*/

class Cont {
    constructor(runCont){
        this.runCont = runCont
    }

    run(){
        return this.runCont(x => x)
    }

    static pure(x){
        return new Cont(fn => fn(x))
    }

    fmap(fn){
        return new Cont(y => this.runCont(x => y(fn(x))))
    }

    apply(cont){
        return new Cont(x => this.runCont(y => cont.runCont(z => x(y(z)))))
    }

    bind(fn){
        return new Cont(k => this.runCont(x => fn(x).runCont(k)))
    }

    then_(c){
        return this.bind(_ => c)
    }

    static callCC(fn){
        return new Cont(k => (fn (a => new Cont(_ => k(a)))).runCont(k))
    }
}

function fibonacci(n){
    return  n < 3 ? Cont.pure(1) :
        fibonacci(n-1)
            .bind(x => fibonacci(n-2)
                .bind(y => new Cont(fn => x + fn(y))))
}

function seila(x){
    return Cont.callCC(k => 
        Cont.pure(5)        
            .then_(k(x))
            .then_(new Cont(_ => console.log("seila")))
    )
}

console.log(seila(3).run())

//console.log(fibonacci(10).run())

/*
(new Cont(fn => [1,2,3,4,5].map(fn)))
    .bind(x => new Cont(_ => console.log(`data: ${x}`)))
    .run()
*/






