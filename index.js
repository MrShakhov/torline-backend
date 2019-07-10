const path = require('path');
const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const logger = require('morgan');

const port = 3000;

app
    .use(logger('dev'))
    .use(history())
    .use(express.static(path.join(__dirname, 'public')))

    .listen(port, () => console.log(`Server is running on port ${port}`));
