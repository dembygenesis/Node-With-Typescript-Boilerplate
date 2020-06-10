require('dotenv').config();
const https = require('https');

function httpsGet(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, function(res){
            let body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function() {
                // resolve(JSON.parse(body));
                resolve(body);
            });
        }).on('error', function(e){
            console.log("HTTP GET error: ", e);
            reject(e);
        });
    });
}

function sendMsg({channel, username, text}) {
    let base = 'https://slack.com/api/chat.postMessage?',
        params = {
            token: process.env.SLACK_TOKEN,
            channel,
            username,
            text,
        };
    params = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
    base += params;

    return httpsGet(base);
}

sendMsg(
    {
        channel: 'affiliate-engine',
        username: 'Deployer Bot',
        text: 'There were errors, compile failed!',
        token: process.env.SLACK_TOKEN
    }
);


