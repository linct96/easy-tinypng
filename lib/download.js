/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-31 17:15:07
 * @LastEditTime: 2020-08-01 10:52:57
 */ 
const https = require('https')
const path = require('path')
const fs = require('fs')
const download = (url,outputPath) => {
  return new Promise((resolve, reject) => {
    https.get(url,pipeRes=>{
      const writeStream = fs.createWriteStream(outputPath)
      pipeRes.pipe(writeStream)
      const timer = setInterval(() => {
        // console.log('下载进度',writeStream.bytesWritten)
      }, 100);
      writeStream.on('close',()=>{
        // console.log('下载完成',writeStream.bytesWritten)
        clearInterval(timer)
        resolve()
      })
    }).on('error',e=>{
      console.log(e)
    })
  })
}
module.exports = download