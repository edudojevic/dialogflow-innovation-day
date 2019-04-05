const { createApp } = require("./express");

const request = require('supertest');
const apiToken = require('./hidden/apiToken');

function getRequestForIntentName(name) {
  const app = createApp();
  return request(app)
    .post('/')
    .set('api_token', apiToken)
    .send({
      "queryResult": {
        "intent": {
          "displayName": name
        },
      },
    });
}

it('should be testable', async () => {
  const response = await getRequestForIntentName("show.popular.xkes");
  console.log(response.body)
});
