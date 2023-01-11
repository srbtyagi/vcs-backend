const mysql = require('mysql');

/////For mysql single connection

// const db=mysql.createConnection({

//      host:'localhost',
//      user:'root',
//      password:'password',
// 	database:'vcsDB'

// });

// db.connect((err)=>{
//     if(err){
//         //console.log(err);
//     }
//     else{
//         //console.log('DB connect');
//     }
// });

dbConnectionInfo = {
  host: 'https://elite-mente-db.cs0ol7nhc7nb.us-east-1.rds.amazonaws.com',
  port: '3306',
  user: 'root',
  password: 'password',
  connectionLimit: 10,
  database: 'elite-mente-db',
};

//create mysql connection pool
const db = mysql.createPool(dbConnectionInfo);

// Attempt to catch disconnects
db.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });
});

module.exports = db;
