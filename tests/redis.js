const redis = require('redis')

const REDIS_PORT = 6379

const redisClient = redis.createClient(
    {
        port: REDIS_PORT,
        host: "localhost"
    }
);

(async () => {
    redisClient.on('connect',() => console.log("redis ready..."))

    await redisClient.connect()

    try {
        await redisClient.del('list')
        await redisClient.rPush('list', "fds")
        await redisClient.rPush('list', "crl")
        let value = await redisClient.lPop('list')
        console.log(value)

        value = await redisClient.lPop('list')
        console.log(value)
    }
    catch(err){
        console.log(err)
    }

    await redisClient.quit()
})()
