const express = require('express');
const dialogflowMiddleware = require('./server');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(dialogflowMiddleware);
app.listen(3000, () => {
    console.log('listening on localhost:3000')
});