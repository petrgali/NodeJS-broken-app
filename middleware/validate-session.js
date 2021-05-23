const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const http = require('../common/status.js');

module.exports = async (req, res, next) => {
    if (req.method == 'OPTIONS') return next();   // allowing options as a method for request
    try {
        const sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) return res.status(http.FORBIDDEN).send({
            auth: false,
            message: "No token provided."
        });
        const decoded = jwt.verify(sessionToken, 'lets_play_sum_games_man')
        if (decoded) {
            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            });
            if (user) {
                req.user = user;
                console.log(`user: ${user}`)
                next()
            };
        };
    } catch (err) {
        res.status(http.FORBIDDEN).send({ error: "not authorized" })
    };
};