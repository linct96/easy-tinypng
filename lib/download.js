/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-31 17:15:07
 * @LastEditTime: 2020-07-31 18:21:13
 */ 
const https = require('https')
const path = require('path')
const fs = require('fs')
const download = (url,outputPath) => {
  https.get(url,pipeRes=>{
    console.log(pipeRes.statusCode)
    console.log(pipeRes.headers)
    const writeStream = fs.createWriteStream(outputPath)
    pipeRes.pipe(writeStream)
    const timer = setInterval(() => {
      console.log('下载进度',writeStream.bytesWritten)
    }, 100);
    writeStream.on('close',()=>{
      console.log('下载完成',writeStream.bytesWritten)
      clearInterval(timer)
    })
  }).on('error',e=>{
    console.log(e)
  })
}
module.exports = download