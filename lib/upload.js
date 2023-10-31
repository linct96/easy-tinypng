/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 10:06:31
 * @LastEditTime: 2021-04-07 11:42:14
 */ 
const fs = require('fs')
const path = require('path')
const { request, get } = require('https')

const requestOps = {
  hostname: 'tinypng.com',
  port: 443,
  path: '/backend/opt/shrink',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  },
}

const getRandomIp = () => {
  return Array.from({length:4},()=>parseInt(Math.random()*256)).join('.')
}

const upload = async (filePath, {
  supportImageType=['png','jpg','jpeg']
}={})=>{
  const isSupportFile = checkFileType(filePath,supportImageType)
  const isExist = fs.existsSync(filePath)
  return new Promise((resolve, reject) => {
    if (!isExist) reject('no file') 
    requestOps.headers['X-Forwarded-For'] = getRandomIp()
    const pipeReq = request(requestOps,res=>{
      res.on('data',(data)=>{
        resolve(data.toString())
      })
    })
    pipeReq.on('error',(err)=>{
      reject(err)
    })
    fs.createReadStream(filePath).pipe(pipeReq)
  })
  
}

const checkFileType = (filePath='',extNameArr) => {
  return extNameArr.includes(path.extname(filePath).replace('.',''))
}

module.exports = upload