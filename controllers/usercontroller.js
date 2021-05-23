const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');
const http = require('../common/status.js');

router.post('/signup', async (req, res) => {
    try {
        const user = await User.create({
            ...req.body.user,
            passwordHash: bcrypt.hashSync(req.body.user.password, 10),
        });
        const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
        res.status(http.OK).send({
            user: user,
            token: token
        });
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message });
    };
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.user.username } });
        if (user) {
            const matches = await bcrypt.compare(req.body.user.password, user.passwordHash);
            if (matches) {
                const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                return res.status(http.OK).send({
                    user: user,
                    message: "Successfully authenticated.",
                    sessionToken: token
                });
            };
            throw { status: http.FORBIDDEN, message: "Passwords do not match." };
        };
        throw { status: http.NOT_FOUND, message: "User not found." };
    } catch (err) {
        res.status(err.status).send({ error: err.message });
    };
});

module.exports = router;