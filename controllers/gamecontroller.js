const router = require('express').Router();
const Game = require('../db').import('../models/game')
const http = require('../common/status.js')

router.get('/all', async (req, res) => {
    try {
        const data = await Game.findAll({
            where: {
                owner_id: req.user.id
            }
        });
        if (data.length > 0) return res.status(http.OK).send({
            games: data,
            message: "Data fetched"
        });
        return res.status(http.NOT_FOUND).send({ error: "Data not found" });
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message });
    };
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({
            where: {
                id: req.params.id,
                owner_id: req.user.id
            }
        });
        if (game) return res.status(http.OK).send({ game: game });
        return res.status(http.NOT_FOUND).send({ error: "Data not found" });
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message });
    };
});

router.post('/create', async (req, res) => {
    try {
        const game = await Game.create({
            owner_id: req.user.id,
            ...req.body.game
        });
        if (game) return res.status(http.OK).send({
            game: game,
            message: "Game created."
        });
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message });
    };
});

router.put('/update/:id', async (req, res) => {
    try {
        const game = await Game.update({
            ...req.body.game
        },
            {
                where: {
                    id: req.params.id,
                    owner_id: req.user.id
                }
            });
        if (game[0] !== 0) return res.status(http.OK).send({
            game: game,
            message: "Successfully updated"
        });
        res.status(http.NOT_FOUND).send({ error: "Game not found" })
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message });
    };
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const game = await Game.destroy({
            where: {
                id: req.params.id,
                owner_id: req.user.id
            }
        });
        if (game) return res.status(http.OK).send({
            game: game,
            message: "Successfully deleted"
        });
        res.status(http.NOT_FOUND).send({ error: "Data not found" })
    } catch (err) {
        res.status(http.INTERNAL_ERROR).send({ error: err.message })
    };
});

module.exports = router;