const { UserInputError } = require("apollo-server")
const Post = require("../../models/Post")
const checkAuth = require('../../utils/checkAuth')
const { validatePostFormInput } = require("../../utils/validators")

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 })
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found')
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            const { errors, valid } = validatePostFormInput(body)
            console.log('valid', valid, 'errr', errors);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            console.log('user', user);
            const newPost = new Post({
                body,
                user: user._id,
                username: user.username
            })
            const post = await newPost.save();
            return post

        },
        async deletePost(_, { postId }, context) {
            try {
                const user = checkAuth(context);
                const result = await Post.deleteOne({ _id: postId, username: user.username });
                console.log('resutl-----', result);
                return "Post deleted successfully."
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}