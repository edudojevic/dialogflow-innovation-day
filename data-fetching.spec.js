const { createApp } = require("./express");

const fetch = require('node-fetch');
const request = require('supertest');
const apiToken = require('./hidden/apiToken');

it('should get xke sessions', async () => {
  const response = await fetch('https://xke.xebia.com/api/xke/', {
    headers: {
      'Authorization': `Token ?`
    }
  });
  const result = await (response).json();
  console.log(result);
});
