const jwt = require("jsonwebtoken")

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_EXP = process.env.TOKEN_EXP

exports.genToken = (payload) => jwt.sign(payload, TOKEN_SECRET, {expiresIn: TOKEN_EXP})
exports.verifyToken = (token) => jwt.verify(token, TOKEN_SECRET)