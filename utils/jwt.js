const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config')

module.exports.generateToken = (data) => {
    const token = jwt.sign({
        id: data._id,
        email: data.email,
        username: data.username
    }, SECRET_KEY, { expiresIn: '1h' })
    return token;
}
module.exports.decodeToken = (token) => {
    const user = jwt.verify(token, SECRET_KEY)
    return user;
}