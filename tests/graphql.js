const app = require('express')()
const {graphqlHTTP} = require('express-graphql')

const graphql = require('graphql')
const PORT = 4000

var users = [
    {
        id: 1,
        name: 'Brian',
        age: '21',
        shark: 'Great White Shark'
    },
    {
        id: 2,
        name: 'Kim',
        age: '22',
        shark: 'Whale Shark'
    },
    {
        id: 3,
        name: 'Faith',
        age: '23',
        shark: 'Hammerhead Shark'
    },
    {
        id: 4,
        name: 'Joseph',
        age: '23',
        shark: 'Tiger Shark'
    },
    {
        id: 5,
        name: 'Joy',
        age: '25',
        shark: 'Hammerhead Shark'
    }
];

const schema = graphql.buildSchema(`
    type Query {
        user(id: Int!): Person,
        users(shark: String): [Person],
    },
    
    type Person {
        id: Int,
        name: String,
        age: Int,
        shark: String,
    },
`)

const root = {
    user: args => users.filter(u => u.id == args.id)[0],
    users: args => users.filter(u => args.shark ? u.shark == args.shark : true)
}


app.use('/graphql',graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(PORT,() => console.log(`listening to localhost:${PORT}`))

