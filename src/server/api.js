/* eslint-disable */
const { json } = require('body-parser')
var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var SecretKey = "Somesecretkey"
var xlsx = require('node-xlsx')
var fs = require('fs')
const jwt = require('jsonwebtoken')
var models = require('./db')
var mysql = require('mysql')
const path  = require('path')
const { ContextExclusionPlugin } = require('webpack')
var connection = mysql.createConnection(models.mysql)
connection.connect()

// 测试get,无参数
router.get('/user',function (req,res) {
    var users = []
    connection.query('select * from users',function (err,result) {
        if (err) throw err
        users = result
        res.end(JSON.stringify(users))
    })
})
// 测试get,有参数
router.get('/user/:id',function (req,res) {
    var user = {}
    connection.query('select * from users where id = ' + req.params.id,function (err,result) {
        if (err) throw err
        user = result
        res.end(JSON.stringify(user))
    })
})
// 测试get,多参数
router.get('/addUser/:name/:age/:email',function (req,res) {
    var sql = 'insert into users(name,age,email) values(?,?,?)'
    var params = [req.params.name,req.params.age,req.params.email]
    connection.query(sql,params,function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
// 测试get,删除元素
router.get('/delUser/:id',function (req,res) {
    connection.query('delete  from users where id=' + req.params.id,function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
// 测试get,更新元素
router.get('/updateUser/:id',function (req,res) {
    connection.query('update users set name=? where id = ?',['LiMing',req.params.id],function (err,result) {
        if (err) throw err
        res.end(JSON.stringify(result))
    })
})
// 管理员端--注册
router.post('/register',function (req,res) {
    const sql = 'insert into administrators(username, accountNo, password) values(?,?,?)'
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
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
// 管理员端--登录
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
                    res.json({result:token})
                }
                else {
                    res.json({result:"Invaild"})
                }
            }
        })
    })
})
// 员工端--登录
router.post('/staffLogin', (req, res) => {
    var str = ''
    var sql = 'select staffPassword from staff where staffNo = ? and staffStatus = 0'
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
                if (result[0].staffPassword === str.password) res.end('pass')
                else res.end('Invaild')
            }
        })
    })
})
// 管理员端--获取用户信息
router.get('/userInfo', function (req,res) {
    var userInfo = ''
    connection.query('select * from administrators where accountNo = ' + req.query.accountNo, function (err, result) {
        if (err) throw err
        userInfo = result[0]
        if(userInfo) res.end(JSON.stringify(userInfo))
    })
})
// 管理员端--新增员工--获取新增员工账号
router.get('/getMaxStaffNo',function (req,res) {
    var maxStaffNo = ''
    connection.query('select max(staffNo) as maxStaffNo from staff',function (err, result) {
        if (err) throw err
        maxStaffNo = result[0].maxStaffNo
        if(maxStaffNo) res.end(maxStaffNo)
        else res.end('0')
    })
})
// 管理员端--新增订单--获取新增订单账号
router.get('/getMaxOrderNo',function (req,res) {
    var maxOrderNo = ''
    connection.query('select max(orderNo) as maxOrderNo from orders',function (err,result) {
        if (err) throw err
        maxOrderNo = result[0].maxOrderNo
        res.end(maxOrderNo)
    })
})
// 管理员端--新增员工
router.post('/addStaff',function (req,res) {   
    var sql = 'insert into staff(staffNo, staffName, staffPassword, staffGender, staffID, staffPhone, staffResidence, createDate, inductionDate, creator) values(?,?,?,?,?,?,?,?,?,?)'
    var str = ''
    let params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = [str.staffNo, str.staffName, str.staffPassword, str.staffGender, str.staffID, str.staffPhone, str.staffResidence, str.createDate, str.createDate, str.creator]
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify(result))
        })
    })
})
// 管理员端--获取员工信息
router.post('/queryStaff',function (req,res) { 
    var sql = 'select * from staff where staffStatus!=1 '  
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.staffNo != '') sql = sql + " and staffNo= '" + str.staffNo + "'"
        if (str.staffName && str.staffName != '') sql = sql + " and staffName= '" + str.staffName + "'"
        if (str.staffResidence && str.staffResidence != '') sql = sql + " and staffResidence= '" + str.staffResidence + "'"
        if (str.staffGender && str.staffGender != '') sql = sql + " and staffGender= '" + str.staffGender + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(JSON.stringify(result))
        })
    })
})
// 管理员端--获取历史员工信息
router.post('/queryHistoryStaff',function (req,res) { 
    var sql = 'select * from staff where staffStatus = 1 '  
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.staffNo != '') sql = sql + " and staffNo= '" + str.staffNo + "'"
        if (str.staffName && str.staffName != '') sql = sql + " and staffName= '" + str.staffName + "'"
        if (str.staffResidence && str.staffResidence != '') sql = sql + " and staffResidence= '" + str.staffResidence + "'"
        if (str.staffGender && str.staffGender != '') sql = sql + " and staffGender= '" + str.staffGender + "'"
        connection.query(sql, function (err,result) {
            if (err) throw err
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(JSON.stringify(result))
        })
    })
})
// 管理员端--更新员工
router.post('/updateStaff',function (req,res) { 
    console.log(req);
    var str = ''
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.resignDate === undefined) {
            connection.query(`update staff set staffName = '${str.staffName}', staffGender = '${str.staffGender}', staffID = '${str.staffID}', staffPhone = '${str.staffPhone}', staffResidence = '${str.staffResidence}', staffStatus = '${str.staffStatus}' where staffNo = '${str.staffNo}'`, function (err,result) {
                if (err) throw err
                if (result.changedRows === 1) res.end(JSON.stringify('ok'))
                else res.end(JSON.stringify('ng'))
            })
        } else {
            connection.query(`update staff set staffName = '${str.staffName}', staffGender = '${str.staffGender}', staffID = '${str.staffID}', staffPhone = '${str.staffPhone}', staffResidence = '${str.staffResidence}', staffStatus = '${str.staffStatus}', resignDate = '${str.resignDate}' where staffNo = '${str.staffNo}'`, (err, result) => {
                if (err) throw err
                if (result.changedRows === 1) res.end(JSON.stringify('ok'))
                else res.end(JSON.stringify('ng'))
            })
        }
    })
})
// 管理员端--删除员工(已弃用)
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
//  导出在职员工表
router.get('/exportStaff',function (req,res) {
    const sql = 'select * from staff where staffStatus = 0'
    connection.query(sql, function (err,result) {
        if (err) throw err
        var datas=[]
        var title = ['员工号', '员工姓名', '性别', '身份证号', '联系方式', '居住地', '状态', '入职日期', '离职日期']//这是第一行 俗称列名
        datas.push(title)
        result.forEach((element) => {
            var arrInner = []
            arrInner.push(element.staffNo)
            arrInner.push(element.staffName)
            arrInner.push(element.staffGender)
            arrInner.push(element.staffID)
            arrInner.push(element.staffPhone)
            arrInner.push(element.staffResidence)
            arrInner.push(element.staffStatus === '0' ? '在职' : '离职')
            arrInner.push(element.inductionDate)
            arrInner.push(element.resignDate)
            datas.push(arrInner)    //  data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
        })
        var date = new Date().toLocaleDateString().replace(/\//g,'-')
        var time = new Date().toLocaleTimeString('chinese', {hour12: false}).replace(/:/g,'_')
        // var name = '员工表' + '_' + date + '_' + time + '.xlsx'
        var name = '在职员工表' + '_' + date + '.xlsx'
        writeExcel(name, datas)
        var filePath = path.resolve('../assets/excel/')
        res.download(filePath + name)
        res.end(JSON.stringify('ok'))
    })
})
function writeExcel(name, datas){
    var buffer = xlsx.build([{ name: name, data: datas}])
    fs.writeFileSync('../assets/excel/' + name, buffer, {'flag':'w'})
}
//  导出在职员工表
router.get('/exportHistoryStaff',function (req,res) {
    const sql = 'select * from staff where staffStatus = 1'
    connection.query(sql, function (err,result) {
        if (err) throw err
        var datas=[]
        var title = ['员工号', '员工姓名', '性别', '身份证号', '联系方式', '居住地', '状态', '入职日期', '离职日期']//这是第一行 俗称列名
        datas.push(title)
        result.forEach((element) => {
            var arrInner = []
            arrInner.push(element.staffNo)
            arrInner.push(element.staffName)
            arrInner.push(element.staffGender)
            arrInner.push(element.staffID)
            arrInner.push(element.staffPhone)
            arrInner.push(element.staffResidence)
            arrInner.push(element.staffStatus === '0' ? '在职' : '离职')
            arrInner.push(element.inductionDate)
            arrInner.push(element.resignDate)
            datas.push(arrInner)    //  data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
        })
        var date = new Date().toLocaleDateString().replace(/\//g,'-')
        var time = new Date().toLocaleTimeString('chinese', {hour12: false}).replace(/:/g,'_')
        // var name = '员工表' + '_' + date + '_' + time + '.xlsx'
        var name = '历史员工表' + '_' + date + '.xlsx'
        writeExcel(name, datas)
        var filePath = path.resolve('../assets/excel/')
        res.download(filePath + name)
        res.end(JSON.stringify('ok'))
    })
})
function writeExcel(name, datas){
    var buffer = xlsx.build([{ name: name, data: datas}])
    fs.writeFileSync('../assets/excel/' + name, buffer, {'flag':'w'})
}
// 管理员端--新增订单
router.post('/addOrder',function (req, res) {   
    var sql = 'insert into orders(orderNo, orderClient, orderName, orderTotal, orderUnitPrice, orderStartDate, orderEndDate, creator, createDate) values(?,?,?,?,?,?,?,?,?)'
    var str = ''    
    let params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        params = [str.orderNo, str.orderClient, str.orderName, str.orderTotal, str.orderUnitPrice, str.orderStartDate, str.orderEndDate, str.creator, str.createDate]
        connection.query(sql, params, function (err,result) {
            if (err) throw err
            res.end(JSON.stringify('1'))
        })
    })
})
// 管理员端--查询订单
router.post('/queryOrder',function (req,res) { 
    var sql = 'select * from orders where orderStatus = 0'
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
// 管理员端--查询历史订单
router.post('/queryHistoryOrder',function (req,res) { 
    var sql = 'select * from orders where orderStatus = 1'
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
// 管理员端--删除订单(已弃用)
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
// 管理员端--更新订单
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
// 管理员端--获取订单选项
router.get('/getOrderOption', (req, res) => {
    const sql = `select orderName, orderUnitPrice from orders where orderStatus = '0'`
    connection.query(sql, (err, result) => {
        if(err) throw err
        if(result.length === 0) res.end('none')
        else res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); res.end(JSON.stringify(result))
    })
})
// 管理员端--获取每日记账信息
router.post('/getBillInfoForInsert',function (req,res) {
    const sql = 'SELECT A.staffNo, A.staffName, D.staffDayWage, D.staffCompletedQuantity, D.orderName, D.orderUnitPrice, '
    + 'D.remarks FROM (select staffNo, staffName from staff where staffStatus = 0) A LEFT JOIN (select * from dayWage where selectedDate = ? ) D ON A.staffNo = D.staffNo; ' 
    + 'select distinct orderName, orderUnitPrice from orders where orderStatus = 0'
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
// 管理员端--提交每日记账信息
router.post('/dayWageInsert',function (req,res) {
    const sql1 = 'select * from daywage where mark = ?'
    const sql2 = 'insert into daywage(staffNo, staffName, orderName, orderUnitPrice, staffCompletedQuantity, staffDayWage, remarks, mark, selectedDate, selectedMonth) values (?,?,?,?,?,?,?,?,?,?)'
    var str = ''
    var params = []
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        for (let i = 0; i < str.param.length; i++ ) {
            connection.query(sql1, str.param[i].mark, (err, result) => {
                if (err) throw err
                if (result[0]) res.end(JSON.stringify('flag'))
                else {
                    let obj = str.param[i]
                    params.push(obj.staffNo, obj.staffName, obj.orderName, obj.orderUnitPrice, obj.staffCompletedQuantity, obj.staffDayWage, obj.remarks, obj.mark, obj.selectedDate, obj.selectedMonth)
                    connection.query(sql2, params, function (err, result) {
                        console.log(result);
                        if (err) throw err
                    })
                    params = []
                }
            })
        }
        res.end('ok')
    })
})
// 管理员端--查询工资记录
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
// 管理员端--更新工资记录
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
            if(result.changedRows === 1) res.end('ok')
            else res.end('ng')
        })
    })
})
// 管理员端--查询工资结算信息
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
        connection.query(sql, function (err,result) {
            if (err) throw err
        })
    })
    res.end(JSON.stringify('ok'))
})
// 管理员端--按月查询工资详细
router.post('/queryDayWageMonthly', (req, res) => {
    var str = ''
    var sql = 'SELECT * FROM daywage WHERE selectedMonth = ?'
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.staffNo && str.staffNo !== '') sql = sql + "AND staffNo = '" + str.staffNo + "'"
        if (str.staffName && str.staffName !== '') sql = sql + "AND staffName = '" + str.staffName + "'"
        connection.query(sql, str.selectedMonth, (err, result) => {
            if (err) throw err
            if (result.length === 0) res.end()
            else {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(JSON.stringify(result))
            }
        })
    })
})
// 管理员端--查询工资结算信息
router.post('/queryTotalDayWageMonthly', (req, res) => {
    var str = ''
    const sql1 = 'SELECT staffNo, staffName, SUM(staffDayWage) AS monthWage, selectedMonth, settlement, remarks FROM daywage WHERE selectedMonth = ? GROUP BY staffNo'
    const sql2 = 'SELECT staffNo, staffName, SUM(staffDayWage), selectedMonth, settlement, remarks FROM daywage WHERE selectedMonth = ? and staffNo = ? GROUP BY staffNo'
    const sql3 = 'SELECT staffNo, staffName, SUM(staffDayWage), selectedMonth, settlement, remarks FROM daywage WHERE selectedMonth = ? and staffName = ? GROUP BY staffNo'
    const sql4 = 'SELECT staffNo, staffName, SUM(staffDayWage), selectedMonth, settlement, remarks FROM daywage WHERE selectedMonth = ? and staffNo = ? and staffName = ? GROUP BY staffNo'
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        if (str.staffNo === '' && str.staffName === '') {
            connection.query(sql1, str.selectedMonth, (err, result) => {
                if (err) throw err
                if (result.length === 0 ) res.end('none')
                else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(JSON.stringify(result))
                }
            })
        } else if (str.staffNo !== '' && str.staffName === '') {
            connection.query(sql2, [str.selectedMonth, str.staffNo], (err, result) => {
                if (err) throw err
                if (result.length === 0 ) res.end('none')
                else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(JSON.stringify(result))
                }
            })
        } else if (str.staffNo === '' && str.staffName !== '') {
            connection.query(sql3, [str.selectedMonth, str.staffName], (err, result) => {
                if (err) throw err
                if (result.length === 0 ) res.end('none')
                else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(JSON.stringify(result))
                }
            })
        } else {
            connection.query(sql4, [str.selectedMonth, str.staffNo, str.staffName], (err, result) => {
                if (err) throw err
                if (result.length === 0 ) res.end('none')
                else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(JSON.stringify(result))
                }
            })
        }
    })
})
// 员工端--打卡
router.post('/clockIn', (req, res) => {
    var str = ''
    const sql1 = 'select * from attendance where mark = ?'
    const sql2 = 'insert into attendance(staffNo, staffName, creactedDate, clockInTime, mark) values(?,?,?,?,?)'
    const sql3 = 'select * from attendance where mark = ?'
    const sql4 = 'update attendance set clockOutTime = ? where mark = ? '
    req.on('data', (chunk) => {
        str += chunk
    })
    req.on('end', ()=> {
        str = JSON.parse(str)
        connection.query(sql1, str.mark, (err, result) => {
            if (err) throw err
            if (result.length === 0) {
                var params = [str.staffNo, str.staffName, str.creactedDate, str.clockInTime, str.mark]
                connection.query(sql2, params, (err, result) => {
                    if (err) throw err
                    if (result.affectedRows === 1) res.end(JSON.stringify('flag1'))
                    else res.end(JSON.stringify('ng1'))
                })
            } else {
                var param = [str.clockOutTime, str.mark]
                connection.query(sql3, str.mark, (err, result) => {
                    if (err) throw err
                    if (result[0].clockInTime && result[0].clockInTime !== '' && result[0].clockOutTime && result[0].clockOutTime !== '') {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(JSON.stringify('flag3'))
                    }
                    else {
                        connection.query(sql4, param, (err, result) => {
                            if (err) throw err
                            if (result.changedRows === 1) res.end(JSON.stringify('flag2'))
                            else res.end(JSON.stringify('ng2'))
                        })
                    }
                })
            }
        })
    })
})
// 员工端--本月打卡记录
router.get('/queryClockRecord/:year/:month/:staffNo', (req, res) => {
    const sql = `select * from attendance where year(creactedDate) = '${req.params.year}' and month(creactedDate) = '${req.params.month}' and staffNo = '${req.params.staffNo}' order by creactedDate`
    connection.query(sql, (err, result) => {
        if (err) throw err
        if (result.length === 0) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); res.end(JSON.stringify('flag4')) 
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); res.end(JSON.stringify(result))
        }
    })
})
// 员工端--更改密码
router.post('/changePassword', (req, res) => {
    var str = ''
    const sql1 = 'select * from staff where staffNo = ?'
    const sql2 = 'update staff set staffPassword = ? where staffNo = ?'
    req.on('data', chunk => {
        str += chunk
    })
    req.on('end', () => {
        str = JSON.parse(str)
        connection.query(sql1, str.staffNo, (err, result) => {
            if (err) throw err
            if (result && result.length > 0) {
                if (result[0].staffPassword === str.password1) {
                    var param = [str.password3, str.staffNo]
                    connection.query(sql2, param, (err, result) => {
                        if (err) throw err
                        if (result.changedRows === 1) res.end(JSON.stringify('ok'))
                        else res.end(JSON.stringify('ng2'))
                    })
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); res.end(JSON.stringify('ng1'))
                }
            }
        })
    })
})

module.exports = router
