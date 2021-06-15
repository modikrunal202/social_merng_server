const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose")
// const { MONGO_URI } = require('./config')
const MONGO_URI = process.env.MONGO_URI;


const resolvers = require("./graphQl/resolvers")
const typeDefs = require("./graphQl/typeDefs");
const PORT = process.env.PORT || 5000;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log("Database Connected...")
}).catch((err) => console.error("Error in connection", err))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT} `)
})