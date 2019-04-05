const express = require('express');
const dialogflowMiddleware = require('./dialogflow-middleware');
const bodyParser = require('body-parser');

module.exports.createApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(dialogflowMiddleware);
  return app;
};
