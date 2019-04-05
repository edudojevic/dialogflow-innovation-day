// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const fetch = require('node-fetch');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const getMostPopularSession = async (apiToken) => {
    const result = await (await fetch('https://xke.xebia.com/api/session/?ordering=-number_of_attendees&xke=2019-04-16', {
        headers: {
            'Authorization': `Token ${apiToken}`
        }
    })).json();

    const mostPopularSession = result[0];
    return {titleOfSession: mostPopularSession.title, numberOfAttendees: mostPopularSession.number_of_attendees};
};

module.exports.getMostPopularSession = getMostPopularSession;

module.exports = (request, response) => {
    const API_TOKEN = request.get('API_TOKEN');
    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function showPopularXkes() {
        const {titleOfSession, numberOfAttendees} = await getMostPopularSession(API_TOKEN);
        agent.add(`The most popular XKE session is "${titleOfSession}" with ${numberOfAttendees} attendees.`)
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('show.popular.xkes', showPopularXkes);
    intentMap.set('Default Fallback Intent', fallback);
    agent.handleRequest(intentMap);
};