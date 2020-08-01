/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-08-01 14:39:22
 * @LastEditTime: 2020-08-01 18:29:55
 */ 
const fs = require('fs')
const path = require('path')

/**
 * @description: 获取目录下的所有文件
 * @param {string} inputPath 文件路径，相对路径or绝对路径
 * @param {function} filter 过滤函数
 * @return: 
 */
const fileDisplay = (inputPath,filter=()=>true) => {
  const dir = []
  const getAllFilePath = (inputPath) => {
    const inputAbsolutePath = path.isAbsolute(inputPath)?inputPath:path.resolve(process.cwd(),inputPath)
    const inputFileStat = fs.statSync(inputAbsolutePath)
    if (inputFileStat.isFile()) {
      const fileInfo = {
        size:inputFileStat.size,
        basename:path.basename(inputAbsolutePath),
        extname:path.extname(inputAbsolutePath),
        directoryPath:path.dirname(inputAbsolutePath),
        path:inputAbsolutePath,
      }
      if (filter(fileInfo)) {
        dir.push(fileInfo)
      }
    }else if (inputFileStat.isDirectory()) {
      fs.readdirSync(inputAbsolutePath).forEach(fileName=>{
        getAllFilePath(path.join(inputAbsolutePath,fileName))
      })
    }
  }
  getAllFilePath(inputPath)
  return dir
}
module.exports={
  fileDisplay:fileDisplay
}