/* eslint-disable */

var express = require('express')
// var querystring = require('querystring');
// var nodeExcel = require('excel-export')
// const cookieParser = require('cookie-parser')
var app = express()
var api = require('./api')
app.use('/api', api)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// app.use(cookieParser())
var server = app.listen(8085, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server has running at http://%s:%s',host,port)
})

