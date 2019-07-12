const path = require('path');
const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const logger = require('morgan');
const config = require('config');

const port = config.get('Server.port');
const apiRouter = require('./api');

app
    .use(logger(config.get('Logger.format')))

    // Routing
    .use('/api', apiRouter)
    .use(history())
    .use(express.static(path.join(__dirname, 'public')))

    .listen(port, () => console.log(`Server is running on port ${port}`));
