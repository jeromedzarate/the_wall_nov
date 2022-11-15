import Mysql from "mysql";

const db_credentials = {
    host: "localhost",
    user: "root",
    password: "",
    database: "the_wall"
};

let connection = Mysql.createConnection(db_credentials);

connection.connect(function(error){
    if(error){
        throw error;
    }
});

module.exports = connection;