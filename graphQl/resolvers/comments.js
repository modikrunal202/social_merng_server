const { UserInputError } = require("apollo-server")
const Post = require("../../models/Post")
const checkAuth = require('../../utils/checkAuth')

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context)
            console.log('username', username);
            if (body.trim() === "") {
                throw new UserInputError("Empty Comment", {
                    errors: {
                        body: "Comment body must not be empty."
                    }
                })
            }
            const post = await Post.findById(postId);
            console.log('post---', post);
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post
            }
            throw new UserInputError("Post not found", {
                errors: {
                    body: "Post not found."
                }
            })
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            const { username } = checkAuth(context)
            const post = await Post.findById(postId);
            if (post) {
                const commentIdx = post.comments.findIndex(comment => comment.id === commentId && comment.username === username);
                if (post.comments[commentIdx]) {
                    post.comments.splice(commentIdx, 1)
                    await post.save()
                    return post;
                } else {
                    throw new Error("Action not allowed")
                }
            }
            throw new UserInputError("Post not found", {
                errors: {
                    body: "Post not found."
                }
            })
        },
        likePost: async (_, { postId }, context) => {
            const { username } = checkAuth(context)
            const post = await Post.findById(postId);
            if (post) {
                const likeIndex = post.likes.findIndex(like => like.username === username)
                if (likeIndex > -1) {
                    post.likes.splice(likeIndex, 1)
                } else {
                    post.likes.unshift({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post
            }
            throw new UserInputError("Post not found", {
                errors: {
                    body: "Post not found."
                }
            })
        }
    }
}