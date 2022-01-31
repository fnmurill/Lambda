const getConnectionService = require("./service/getConnection");
const sql = "select * from companies";
exports.handler = async event => {
    const responseGetConnection = await getConnectionService.getConnection();
    await getConnectionService.query(responseGetConnection, sql);
    console.log(responseGetConnection);

    return { statusCode: 201 };
};