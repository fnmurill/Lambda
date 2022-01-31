const AWS = require("aws-sdk");
const mysql = require("mysql");



const pool = mysql.createPool({
    connectionLimit: 10,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DATABASE,
    sqlport: process.env.RDS_PORT
});

exports.handler = (event, context, callback) => {
    pool.getConnection(function(err, conn) {
        if (err) return callback(err);

        //Empresas en la plataforma
        conn.query('select count(c.id) from companies as c inner join states s on c.status_id = s.id where deleted_at is null', function(err, rows) {
            if (err) throw err;

            conn.release();
            callback(null, rows);

            //Empleados registrados al día de hoy
            conn.query('select count(c.id) from companies as c left join employees e on c.id = e.company_id inner join states s on c.status_id = s.id where e.deleted_at is null and c.deleted_at is null', function(err, rows) {
                if (err) throw err;

                conn.release();
                callback(null, rows);

                // Competencias creadas en Periplia por nuestros clientes
                conn.query('select COUNT(sk.id) from skill_skills as sk inner join companies c on sk.company_id = c.id where sk.deleted_at is null and sk.company_id is not null;', function(err, rows) {
                    if (err) throw err;

                    conn.release();
                    callback(null, rows);
                });
            });
        });
    });
};


//Spaghetti Ordenado
/*const getConnectionService = require("./service/getConnection");
exports.handler = async event => {
    const responseGetConnection = await getConnectionService.getConnection();
    await getConnectionService.query(responseGetConnection, "select COUNT(sk.id) from skill_skills as sk inner join companies c on sk.company_id = c.id where sk.deleted_at is null and sk.company_id is not null");
    await getConnectionService.query(responseGetConnection, "select count(c.id) from companies as c inner join states s on c.status_id = s.id where deleted_at is null");
    console.log(responseGetConnection);

    return responseGetConnection;
};*/

//Spaghetti Original funcional
/*exports.handler = (event, context, callback) => {
    // allows for using callbacks as finish/error-handlers
    context.callbackWaitsForEmptyEventLoop = false;
    const sql = "select COUNT(*) from skill_skills as sk inner join companies c on sk.company_id = c.id where sk.deleted_at is null and sk.company_id is not null;";
    con.query(sql, function(err, result) {
        if (err) throw err;
        callback(null, result);
    });
}; */


//Spaghetti Mix error de autenticaci[on, timeout, etc
/*exports.handler = (event, context, callback) => {
    // allows for using callbacks as finish/error-handlers
    context.callbackWaitsForEmptyEventLoop = false;
    const result = {};

    Promise.all([
            con.query('select COUNT(*) from skill_skills as sk inner join companies c on sk.company_id = c.id where sk.deleted_at is null and sk.company_id is not null',
                function(err, rows, fields) {
                    if (err) throw err;
                    result.analysis = rows;
                    console.log("query 1");
                }),
            con.query('select count(c.id) from companies as c inner join states s on c.status_id = s.id where deleted_at is null',
                function(err, rows, fields) {
                    if (err) throw err;
                    result.analysis_description = rows;
                    console.log("query 2");
                })
        ])
        .then(function(result) {
            console.log(result);
            console.log("result");
        });
};*/