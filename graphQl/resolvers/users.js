const bcryptjs = require('bcryptjs');
const { UserInputError } = require('apollo-server')
const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')
const { generateToken } = require('../../utils/jwt')
module.exports = {
    Mutation: {
        async login(parent, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ username })
            if (!user) {
                errors.general = 'User not found.'
                throw new UserInputError('User not found', { errors })
            }
            const match = await bcryptjs.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong credentials.'
                throw new UserInputError('Wrong credentials', { errors })
            }
            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },
        async register(parent,
            {
                registerInput: { username, email, password, confirmPassword }
            },
            context, info) {
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            // hash password and create token
            password = await bcryptjs.hash(password, 12);
            const newUser = new User({
                email,
                password,
                username
            })
            const result = await newUser.save();
            const token = generateToken(result)
            return {
                ...result._doc,
                id: result._id,
                token,
                createdAt: result.createdAt
            }
        }
    }
}