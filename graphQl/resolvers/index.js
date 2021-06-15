const postsResolver = require('./posts');
const userResolver = require('./users')
const commentResolver = require('./comments')


module.exports = {
    Post: {
        likeCount: (parent) => (parent.likes.length),
        commentCount: (parent) => (parent.comments.length),
    }, 
    Query: {
        ...postsResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postsResolver.Mutation,
        ...commentResolver.Mutation
    }
}