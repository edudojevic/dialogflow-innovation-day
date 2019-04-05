const fetch = require('node-fetch');

it('should get xke sessions', async () => {
    const response = await fetch('https://xke.xebia.com/api/session/?xke=2019-04-16', {
        headers: {
            'Authorization': `Token `
        }
    });
    const result = await (response).json();
    console.log(result);
})
