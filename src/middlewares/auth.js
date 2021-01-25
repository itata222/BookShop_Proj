const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        console.log('2')
        const token = req.header("Authorization").replace("Bearer ", "");
        console.log('0')
        const data = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log('1')
        const user = await User.findOne({
            _id: data._id,
            "tokens.token": token
        })
        if (!user)
            throw new Error('user not authrized');

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: 'lack of authentication'
        })
    }
}

module.exports = auth