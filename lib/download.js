/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-31 17:15:07
 * @LastEditTime: 2020-08-04 11:43:27
 */ 
const https = require('https')
const path = require('path')
const fs = require('fs')
const download = (url,outputPath) => {
  return new Promise((resolve, reject) => {
    https.get(url,pipeRes=>{
      const writeStream = fs.createWriteStream(outputPath)
      pipeRes.pipe(writeStream)
      writeStream.on('close',()=>{
        resolve()
      })
    }).on('error',e=>{
      console.log(e)
    })
  })
}
module.exports = download