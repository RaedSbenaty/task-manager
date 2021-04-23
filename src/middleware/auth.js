var User = require('../models/user')
var jwt = require('jsonwebtoken')

var auth = async (req, res, next) => {
    try {
        var token = req.header('Authorization').replace('Bearer ', '')
        var decode = jwt.verify(token, process.env.JWT_SECRET)

        var user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        if (!user) throw new Error()

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send('Authorization failed.')
    }
}

module.exports = auth