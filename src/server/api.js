/* eslint-disable */
const { json } = require('body-parser')
var express = require('express')
var router = express.Router()
// var models = require('./db')
var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qwer',
    database : 'test',
    multipleStatements: true
})
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
router.get('/getMaxStaffNo',function (req,res) {
    var maxStaffNo = ''
    connection.query('select max(staffNo) as maxStaffNo from staff',function (err,result) {
        if (err) throw err
        maxStaffNo = result[0].maxStaffNo
        res.end(maxStaffNo)
    })
})
router.post('/addStaff/',function (req,res) {   
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
router.post('/queryStaff',function (req,res) { 
    var sql = 'select * from staff where 1=1'  
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        c
        if (str.staffResidence != '') sql = sql + " and staffResidence= '" + str.staffResidence + "'"
        if (str.staffGender != '') sql = sql + " and staffGender= '" + str.staffGender + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
router.post('/delStffNo',function (req,res) {
    var str = ''
    var params
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        params = str.params
        connection.query(`delete from staff where staffNo in (${params})`,function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
router.post('/addOrder',function (req,res) {   
    var sql = 'insert into orders(orderNo, orderClient, orderName, orderTotal, orderUnitPrice, orderStartDate, orderEndDate) values(?,?,?,?,?,?,?)'
    var str = ''
    let params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        console.log(str);
        params = [str.orderNo, str.orderClient, str.orderName, str.orderTotal, str.orderUnitPrice, str.orderStartDate, str.orderEndDate]
        console.log(params);
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
        if (str.orderNo != '') sql = sql + " and orderNo= '" + str.orderNo + "'"
        if (str.orderName != '') sql = sql + " and orderName= '" + str.orderName + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
router.post('/delOrder',function (req,res) {
    var str = ''
    var params
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        params = str.params
        connection.query(`delete from orders where orderNo in (${params})`,function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
router.get('/getBillInfoForInsert/:selectedDate',function (req,res) {
    const sql = 'SELECT staff.staffNo, staff.staffName, daywage.staffDayWage, daywage.staffCompletedQuantity, daywage.orderName, daywage.orderUnitPrice, daywage.remarks FROM staff LEFT JOIN daywage ON staff.staffNo=daywage.staffNo; select distinct orderName,orderUnitPrice from orders'
    connection.query(sql,function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
router.post('/dayWageInsert',function (req,res) {
    // const sql = `insert into dayWage(staffNo, staffName, orderName, orderUnitPrice, staffCompletedQuantity, staffDayWage, mark) values((${params}))`
    var str = ''
    var params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        for(let i = 0; i < str.param.length; i++) {
            for(let j in str.param[i]) {
                params.push(str.param[i][j])
            }
            console.log(params)
            connection.query('insert into dayWage(staffNo, staffName, staffDayWage, staffCompletedQuantity, orderName, orderUnitPrice, remarks, mark, selectedDate) values (?,?,?,?,?,?,?,?,?)', params, function (err,result) {
                if (err) throw err
            })
            params = []
        }
    })
    res.end(JSON.stringify('ok'))
})
router.post('/qeuryDayWage',function (req,res) { 
    var sql = 'select * from dayWage where 1=1'
    var str = ''  
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.selectedDate != '') sql = sql + " and selectedDate= '" + str.selectedDate + "'"
        if (str.staffNo != '') sql = sql + " and staffNo= '" + str.staffNo + "'"
        if (str.staffName != '') sql = sql + " and staffName= '" + str.staffName + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
router.post('/updateDayWage',function (req,res) { 
    var sql = 'update dayWage set orderName = ?, orderUnitPrice = ?, staffCompletedQuantity = ?, staffDayWage = ?, remarks = ? where mark = ?'
    var str = ''
    let params = [] 
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        console.log(str)
        params = str.params
        connection.query(sql, params, function (err,result) {
            console.log(sql)
            if (err) throw err
            console.log(result)
            res.end(JSON.stringify(result))
        })
    })
})
module.exports = router
