const mysql = require("mysql");

const dbOptions = {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DATABASE,
    region: process.env.SES_AWS_DEFAULT_REGION,
    sqlport: process.env.RDS_PORT
};

const getConnection = () => {
    return new Promise((resolve, reject) => {
        try {
            const conn = mysql.createConnection(dbOptions);
            conn.connect();
            console.log("Conection", conn);
            resolve(conn);
        } catch (error) {
            console.log("error getConnection ->", error);
            reject(error);
        }
    });
};

const query = (conn, sql) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, (error, results) => {
            if (error) {
                console.log("error query ->", error);
                reject(error);
            } else {
                console.log(results);
                resolve(true);
            }
        });
    });
};
module.exports = {
    getConnection,
    query
};