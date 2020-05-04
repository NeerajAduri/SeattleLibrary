const mysql      = require('mysql');
//we are setting up the connections to aws instance here
const connection = mysql.createConnection({
  host     : 'ec2-13-59-203-130.us-east-2.compute.amazonaws.com',
  user     : 'TopGunUser',
  password : 'TopGunUser',
  database : 'ADM_DB'
});

connection.connect(function(err) {
    if (err) 
    {
      console.log(err);
    }
});

module.exports = connection;
