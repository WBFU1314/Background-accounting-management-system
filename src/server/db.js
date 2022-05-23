
var mysql = {
  host: 'localhost',
  port: '5555',
  user: 'root',
  password: '1234qwer',
  database: 'test',
  // dateStrings : true, //解决时间格式
  timezone: '08:00',
  multipleStatements: true
}
module.exports = {mysql}


// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'qwer',
//     database : 'test',
//     multipleStatements: true
// })