const express = require('express');
const db = require('./db');
const middleware = require('./middleware/validate-session.js')
const user = require('./controllers/usercontroller.js');
const game = require('./controllers/gamecontroller.js');
const { PORT } = require('./common/config.js');
const app = express();

db.sync();
app
    .use(express.json())
    .use('/api/auth', user)
    .use(middleware)
    .use('/api/game', game)
    .listen(PORT, () => console.log(`App is listening on ${PORT}`));