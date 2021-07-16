/* eslint-disable */
const { json } = require('body-parser')
var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var SecretKey = "Somesecretkey"
var xlsx = require('node-xlsx')
var fs = require('fs')
const jwt = require('jsonwebtoken')
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
router.post('/register',function (req,res) {
    const sql = 'insert into administrators(username, accountNo, password) values(?,?,?)'
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        console.log(str)
        let password = str.password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(password, salt)
        str.password = hash
        connection.query(sql, [str.username, str.accountNo, str.password], function(err, result) {
            if (err) throw err
            res.end('pass')
        })
    })
})
router.post('/login',function (req,res) {
    var str = ''
    var sql = 'select * from administrators where accountNo = ?'
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        connection.query(sql, str.accountNo, function (err, result) {
            if (err) throw err
            if (result.length === 0) {
                res.end('non-existent')
            } else {
                const pwdMatchFlag = bcrypt.compareSync(str.password, result[0].password)
                if (pwdMatchFlag) {
                    var token = jwt.sign(result[0].accountNo, SecretKey)
                    console.log(token)
                    res.json({result:token})
                }
                else {
                    res.json({result:"Invaild"})
                }
            }
        })
    })
})
router.get('/getMaxStaffNo',function (req,res) {
    var maxStaffNo = ''
    connection.query('select max(staffNo) as maxStaffNo from staff',function (err, result) {
        if (err) throw err
        maxStaffNo = result[0].maxStaffNo
        res.end(maxStaffNo)
    })
})
router.get('/getMaxOrderNo',function (req,res) {
    var maxOrderNo = ''
    connection.query('select max(orderNo) as maxOrderNo from orders',function (err,result) {
        if (err) throw err
        maxOrderNo = result[0].maxOrderNo
        res.end(maxOrderNo)
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
router.post('/updateStaff',function (req,res) { 
    var str = ''
    var params = ''
    req.on('data', (chunk) => {
        str += chunk    
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = str.params
        const sql = `update staff set staffStatus = "离职" where staffNo = ${params}`
        connection.query(sql, params,function (err,result) {
            if (err) throw err
        })
    })
    res.end(JSON.stringify('ok'))
})
router.post('/delStaff',function (req,res) {
    var str = ''
    var params
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        params = str.params
        const sql = `delete from staff where staffNo in (${params})`
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
//  导出员工表
router.get('/exportStaff',function (req,res) {
    const sql = 'select * from staff'
    connection.query(sql, function (err,result) {
        if (err) throw err
        var datas=[]
        var title = ['员工号', '员工姓名', '性别', '身份证号', '联系方式', '居住地', '状态']//这是第一行 俗称列名
        datas.push(title)
        result.forEach((element) => {
            var arrInner = []
            arrInner.push(element.staffNo)
            arrInner.push(element.staffName)
            arrInner.push(element.staffGender)
            arrInner.push(element.staffID)
            arrInner.push(element.staffPhone)
            arrInner.push(element.staffResidence)
            arrInner.push(element.staffStatus)
            datas.push(arrInner)    //  data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
        })
        // var name='员工表'+GetDateStr()+'.xlsx'
        var name = '员工表' + '.xlsx'
        writeExcel(name,datas)
        res.download('../assets/excel/'+name)
        res.end()
    })
})
function writeExcel(name,datas){
    var buffer=xlsx.build([{name:'sheet1',data:datas}])
    fs.writeFileSync('../assets/excel/'+name, buffer,{'flag':'w'})
}
function GetDateStr(){
    return new Date().toLocaleDateString()
}
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
        const sql = `delete from orders where orderNo in (${params})`
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
router.post('/updateOrder',function (req,res) { 
    const sql = `update orders set orderStatus = "1" where orderNo = ?`
    var str = ''
    var params = ''
    req.on('data', (chunk) => {
        str += chunk    
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = str.params
        connection.query(sql, params,function (err,result) {
            if (err) throw err
        })
    })
    res.end(JSON.stringify('ok'))
})
router.post('/getBillInfoForInsert',function (req,res) {
    const sql = 'SELECT staff.staffNo, staff.staffName, D.staffDayWage, D.staffCompletedQuantity, D.orderName, D.orderUnitPrice, '
    + 'D.remarks FROM staff LEFT JOIN (select * from dayWage where selectedDate = ? ) D ON staff.staffNo = D.staffNo; ' 
    + 'select distinct orderName,orderUnitPrice from orders'
    var str = ''
    var params = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        params = str.selectedDate
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result)) 
        })
    })
})
router.post('/dayWageInsert',function (req,res) {
    const sql = 'insert into dayWage(staffNo, staffName, staffDayWage, staffCompletedQuantity, orderName, orderUnitPrice, remarks, mark, selectedDate, selectedMonth) values (?,?,?,?,?,?,?,?,?,?)'
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
            connection.query(sql, params, function (err,result) {
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
    const sql = 'update dayWage set orderName = ?, orderUnitPrice = ?, staffCompletedQuantity = ?, staffDayWage = ?, remarks = ? where mark = ?'
    var str = ''
    let params = [] 
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = str.params
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
router.post('/queryDayWageMonthly',function (req,res) {
    var sql = 'select distinct orderName,orderUnitPrice from orders; select * from dayWage where 1=1'
    var str = ''  
    req.on('data', (chunk) => {
        str += chunk    
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.selectedMonth != '') sql = sql + " and selectedMonth= '" + str.selectedMonth + "'"
        if (str.staffNo != '') sql = sql + " and staffNo= '" + str.staffNo + "'"
        if (str.staffName != '') sql = sql + " and staffName= '" + str.staffName + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
// router.post('/salaryCalculate',function (req,res) { 
//     var str = ''
//     var params = []
//     req.on('data', (chunk) => {
//         str += chunk    
//     })
//     req.on('end', () => {
//         str = JSON.parse(str)
//         params = str.params
//         console.log(params)
//         for (let i = 0; i < params.length; i++) {
//             console.log('"' + params[i] + '"')
//             connection.query('update dayWage set settlement = "1" where mark = ' + '"' + params[i] + '"', function (err,result) {
//                 if (err) throw err
//             })  
//         }
//     })
//     res.end(JSON.stringify('ok'))
// })
// router.post('/salaryCalculate',function (req,res) { 
//     var str = ''
//     var params = []
//     req.on('data', (chunk) => {
//         str += chunk    
//     })
//     req.on('end', () => {
//         console.log(str)
//         str = JSON.parse(str)
//         console.log(str)
//         params = str.params
//         console.log(params)
//         for(let i = 0; i<params.length; i++){
//             connection.query(`update dayWage set settlement = "1" where mark = '${params[i]}'`, function (err,result) {
//                 console.log(result)
//                 if (err) throw err
//             })
//         }
        
//     })
//     res.end(JSON.stringify('ok'))
// })
router.post('/salaryCalculate',function (req,res) {
    var str = ''
    var params = []
    req.on('data', (chunk) => {
        str += chunk    
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = str.params
        const paramsStr = "'" + params.join("','") + "'"
        const sql = `update dayWage set settlement = "1" where mark in (${paramsStr})`
        console.log(paramsStr)
        connection.query(sql, function (err,result) {
            if (err) throw err
        })
    })
    res.end(JSON.stringify('ok'))
})
module.exports = router
