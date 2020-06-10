import https from 'https';

export default class HttpUtility {

    static httpsGet(url: string) {
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

}
