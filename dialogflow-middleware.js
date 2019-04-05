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

const getTopicTitle = async (apiToken, topic) => {
    console.log(topic);

    const result = await(await fetch(`https://xke.xebia.com/api/session/?xke=2019-04-16&search=${topic}`, {
        headers: {
            'Authorization': `Token ${apiToken}`
        }
    })).json();


    if (result.length) {
        return result[0].title;
    }

    return undefined;
};

module.exports.getMostPopularSession = getMostPopularSession;
module.exports.getTopicTitle = getTopicTitle;

module.exports = (request, response) => {


    const API_TOKEN = request.get('API_TOKEN');
    const agent = new WebhookClient({request, response});
    // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function showPopularXkes() {
        const {titleOfSession, numberOfAttendees} = await getMostPopularSession(API_TOKEN);
        agent.add(`The most popular XKE session is "${titleOfSession}" with ${numberOfAttendees} attendees.`)
    }

    async function searchTopic() {
        console.log(agent.parameters);
        const sessionTitle = await getTopicTitle(API_TOKEN, agent.parameters.topic);

        if (sessionTitle) {
            agent.add(`I found the following session based on your input: "${sessionTitle}"`)
        } else {
            agent.add(`I found no sessions based on your input.`)
        }
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('show.popular.xkes', showPopularXkes);
    intentMap.set('search.topic', searchTopic);
    agent.handleRequest(intentMap);
};