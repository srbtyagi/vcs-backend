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
  host: 'ls-335818fcf4696b62d113a8b2cca292736d501f19.cbsuayqxzsiq.us-east-2.rds.amazonaws.com',
  port: '3306',
  user: 'dbmasteruser',
  password: ';qW2Gayv`$fJg&_D#&iS3k|cXac%*q>3',
  connectionLimit: 10,
  database: 'elitemente-lightsail-db',
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
