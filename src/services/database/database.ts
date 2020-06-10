import mysql, {Connection, PoolConnection} from 'mysql';
import StringUtility from "../../utilities/string";

export default class Database {

    private pool = mysql.createPool({
        connectionLimit: parseFloat(StringUtility.getEnv('DB_CONNECTIONS')),
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        multipleStatements: true,
        dateStrings: true
    });

    private getConnectionFromPool() {
        return new Promise<PoolConnection>((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    reject('Something went wrong when getting the connection');
                } else {
                    resolve(connection);
                }
            });
        });
    }

    query(queryString: string, queryVariables?: Array<any>, showQuery? :boolean): any {
        return new Promise(async (resolve, reject) => {
            const connection = await this.getConnectionFromPool();

            if (showQuery) {
                let sql = queryString;

                if (typeof queryVariables !== "undefined") {
                    for (let i = 0; i < queryVariables?.length; i++) {
                        sql = sql.replace('?', queryVariables[i]);
                    }
                }

                console.log(sql);
            }

            if (queryVariables) {
                connection.query(queryString, queryVariables, function (err, rows, fields) {
                    if (err) {
                        connection.release();
                        return reject(err.sqlMessage);
                    }

                    if (queryString.search(/CALL /g) !== -1) {
                        resolve(rows[0]);
                    } else {
                        resolve(rows);
                    }

                    connection.release();
                });
            } else {
                connection.query(queryString, function (err, rows, fields) {
                    if (err) {
                        return reject(err.sqlMessage);
                    }

                    if (queryString.search(/CALL /g) !== -1) {
                        resolve(rows[0]);
                    } else {
                        resolve(rows);
                    }

                    connection.release();
                });
            }
        });
    }
}
