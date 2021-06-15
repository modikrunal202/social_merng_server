const { AuthenticationError } = require('apollo-server')
const { decodeToken } = require("./jwt");
module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1]
        if (token) {
            try {
                const user = decodeToken(token)
                if(user) {
                    return user;
                }
                throw new AuthenticationError('Invalid or Expired Token')
            } catch (error) {
                throw new AuthenticationError('Invalid or Expired Token')
            }
        }
        throw new Error('Invalid Authentication Token')
    }
    throw new Error('Authorization header must be provided')

}