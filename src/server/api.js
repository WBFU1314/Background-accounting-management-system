/* eslint-disable */
var express = require('express')
var router = express.Router()
var models = require('./db')
var mysql = require('mysql')
var connection = mysql.createConnection(models.mysql)
connection.connect()
router.get('/user',function (req,res) {
    var users = []
    connection.query('select * from users',function (err,result) {
        if (err) throw err
        users = result
        res.end(JSON.stringify(users))
    })
})
router.get('/user/:id',function (req,res) {
    var user = {}
    connection.query('select * from users where id = ' + req.params.id,function (err,result) {
        if (err) throw err
        user = result
        res.end(JSON.stringify(user))
    })
})
router.get('/addUser/:name/:age/:email',function (req,res) {
    var sql = 'insert into users(name,age,email) values(?,?,?)'
    var user = {name: 'Mike',age:12,email:'1124245@qq,com'}
    var params = [req.params.name,req.params.age,req.params.email]
    connection.query(sql,params,function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
router.get('/delUser/:id',function (req,res) {
    connection.query('delete  from users where id=' + req.params.id,function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
router.get('/updateUser/:id',function (req,res) {
    connection.query('update users set name=? where id = ?',['LiMing',req.params.id],function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
router.post('/login',function (req,res) {   
    var str = ''
    var pwd = {}
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        connection.query('select userpsw from login where username =' + str.username, function (err,result) {
            if (err) throw err
            pwd = result
            res.end(JSON.stringify(pwd))
        })
    })
})
router.post('/addStaff',function (req,res) {   
    var sql = 'insert into staff(staffNo, staffName, staffGender, staffID, staffPhone, staffResidence) values(?,?,?,?,?,?)'
    var str = ''
    let params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = [str.staffNo, str.staffName, str.staffGender,str.staffID,str.staffPhone,str.staffResidence]
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
// router.get('/queryStaff',function (req,res) {  
//     var staff = []
//     connection.query('select * from staff', function (err,result) {
//         if (err) throw err
//         staff = result
//         res.end(JSON.stringify(staff))
//     })
// })
// router.get('/queryStaff/:staffNo/:staffName',function (req,res) {
//     var sql = 'select * from staff where staffNo = ? and staffName = ? '
//     var staff = []
//     let params = [req.params.staffNo, req.params.staffName]
//     connection.query(sql, params, function (err,result) {
//         if (err) throw err
//         staff = result
//         res.end(JSON.stringify(staff))
//     })
// })
router.post('/queryStaff',function (req,res) { 
    var sql = 'select * from staff where 1=1'  
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.staffNo != '') sql = sql + " and staffNo= '" + str.staffNo + "'"
        if (str.staffName != '') sql = sql + " and staffName= '" + str.staffName + "'"
        if (str.staffResidence != '') sql = sql + " and staffResidence= '" + str.staffResidence + "'"
        if (str.staffGender != '') sql = sql + " and staffGender= '" + str.staffGender + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
router.post('/delStaff',function (req,res) {
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        connection.query(`delete from staff where staffNo in (${str.params})`,function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
// router.post('/exportStaffInfo',function (req,res) {
//     var str = ''
//     req.on('data', (chunk) => {
//         str += chunk
//     })
//     req.on('end', ()=> {
//         console.log(str)
//         str = JSON.parse(str)
//         console.log(str)
//         connection.query(`delete from staff where staffNo in (${str.params})`,function (err,result) {
//             if (err) throw err
//             res.end(JSON.stringify(result)) 
//         })
//     })
// })
router.post('/addOrder',function (req,res) {   
    var sql = 'insert into orders(orderNo, orderClient, orderName, orderTotal, orderUnitPrice, orderStartDate, orderEndDate) values(?,?,?,?,?,?,?)'
    var str = ''
    let params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = [str.orderNo, str.orderClient, str.orderName, str.orderTotal, str.orderUnitPrice, str.orderStartDate, str.orderEndDate]
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify('1'))
        })
    })
})
router.post('/queryOrder',function (req,res) { 
    var sql = 'select * from orders where 1=1'  
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        console.log(str)
        if (str.orderNo != '') sql = sql + " and orderNo= '" + str.orderNo + "'"
        if (str.orderName != '') sql = sql + " and orderName= '" + str.orderName + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
            console.log(JSON.stringify(result))
        })
    })
})
module.exports = router
