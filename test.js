const path = require('path')
const fs = require('fs')
const upload= require('./lib/upload')
const download = require('./lib/download')
const filePath1 = path.resolve(__dirname,'./img/bg3.jpg')
const filePath2 = path.resolve(__dirname,'./img/bg4.jpg')
const outputPath = path.resolve(__dirname,'./impressed/name.jpg')
// upload(filePath1).then(res=>{
//   res = JSON.parse(res)
//   console.log(res)
//   download(res.output.url,outputPath)
// }).catch(e=>{
//   console.log(e)
// })

const getUrl = 'https://tinypng.com/web/output/48a52qrh5wamn5v6d7grk6x2agzukw96'
download(getUrl,outputPath)

// const dirPath = path.resolve(__dirname,'./dir')
// fs.mkdirSync(dirPath)