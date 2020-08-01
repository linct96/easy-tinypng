/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 10:06:31
 * @LastEditTime: 2020-08-01 18:29:30
 */ 
const fs = require('fs')
const path = require('path')
const { request, get } = require('https')
const {fileDisplay} = require('./file')
const upload = require('./upload')
const pathArr = fileDisplay('./',fileInfo=>{
  return fileInfo.extname==='.jpg'
})
console.log(pathArr)
// console.log(fs.statSync(path.resolve(__dirname,'./tiny.js')))
// module.exports = tiny