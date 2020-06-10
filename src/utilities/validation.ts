import https from 'https';

export default class ValidationUtility {

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

    static isExistingAndActive(table: string, column: string, value: string | number) {
        return new Promise(async (resolve, reject) => {
            const sql = `
                SELECT COUNT(*) AS is_existing FROM ${table}
                WHERE 1 = 1
                    AND ${column} = ?
                    AND is_active = 1
            `;
            try {
                const data: any = await global.database.query(sql, [value]);

                if (data[0]['is_existing'] === 0) {
                    console.log('does not exist');
                    resolve(false);
                } else {
                    console.log('exists');
                    resolve(true);
                }
            } catch (err) {
                reject(false);
            }
        });
    }

    static isExisting(table: string, column: string, value: string | number, condition?: string) {
        return new Promise(async (resolve, reject) => {
            const sql = `
                SELECT COUNT(*) AS is_existing FROM ${table}
                WHERE 1 = 1
                    AND ${column} = ?
                    
            `;
            try {
                const data: any = await global.database.query(sql, [value]);

                if (data[0]['is_existing'] === 0) {
                    console.log('does not exist');
                    resolve(false);
                } else {
                    console.log('exists');
                    resolve(true);
                }
            } catch (err) {
                reject(false);
            }
        });
    }

    static isExistingNotOwn(id: number, table: string, column: string, value: string | number) {
        return new Promise(async (resolve, reject) => {
            const sql = `
                SELECT COUNT(*) AS is_existing_not_own FROM ${table}
                WHERE 1 = 1
                    AND id != ?
                    AND ${column} = ?
            `;
            try {
                const data: any = await global.database.query(sql, [id, value]);

                if (data[0]['is_existing_not_own'] === 0) {
                    console.log('does not exist');
                    resolve(false);
                } else {
                    console.log('exists');
                    resolve(true);
                }
            } catch (err) {
                reject(false);
            }
        });
    }

    static objectChecker = (obj: any, objProperties: any) => {
        if (typeof obj !== 'undefined') {

            // Check if it is in "dot" format and convert if it is.
            if (typeof objProperties === 'string') {
                objProperties = objProperties.split('.');
            }

            for (let i = 0; i < objProperties.length; i++) {
                if (typeof obj !== "object") {
                    obj = [];
                    break;
                }

                if (obj === null) {
                    break;
                }

                if (!(objProperties[i] in obj)) {
                    obj = false;
                    break;
                } else {
                    obj = obj[objProperties[i]];
                }
            }
        }

        return obj;
    }
}
