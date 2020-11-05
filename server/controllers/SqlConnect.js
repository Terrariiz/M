/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
const mysql = require('mysql');
const util  = require('util');
const config = require('../config/config_db').default;

const makeConnection = () => {
    const connection = mysql.createConnection(config);
    connection.query = util.promisify(connection.query);
    return connection;
};

const closeConnection = (connection) => {
    connection.end(err => {
        if(err){
            console.error(err);
            connection.destroy();
        }
        else return true;
    });
}


module.exports = {
    makeConnection,
    closeConnection
};