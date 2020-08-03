const path = require('path')
const fs = require('fs')
const upload= require('./lib/upload')
const download = require('./lib/download')
const filePath1 = path.resolve(__dirname,'./img/bg3.jpg')
const filePath2 = path.resolve(__dirname,'./img/bg4.jpg')
const outputPath = path.resolve(__dirname,'./impressed')


console.log(path.join(outputPath,'name.jpg'))
