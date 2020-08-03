/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 10:06:31
 * @LastEditTime: 2020-08-03 16:11:19
 */ 
const fs = require('fs')
const path = require('path')
const Listr = require('listr');
const { request, get } = require('https')
const {fileDisplay} = require('./file')
const upload = require('./upload')
const download = require('./download')
const mockDownload = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}
const getTinyTask =(imgList,{outputPath})=>{
  const getCompressTask = () => {
    const uploadTaskParams = []
    imgList.forEach(fileInfo => {
      uploadTaskParams.push({
        title: fileInfo.basename,
        task: async (ctx, task) => {
          const basicTitle = task.title
          task.title = `upload ${basicTitle}`
          const res = await upload(fileInfo.path)
          const resObj = JSON.parse(res)
          fileInfo.compressInfo=resObj.output
          if (resObj.output.ratio > 0.9) {
            // task.skip(`unnecessary compress ${resObj.output.ratio}`)
            task.skip()
            task.title = `unnecessary compress ${basicTitle}`
          } else {
            task.title = `download ${basicTitle}`

            let localPath
            if (outputPath) {
              if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath,{ recursive: true })
              }
              localPath = path.join(outputPath,fileInfo.basename)
            }else{
              localPath = fileInfo.path
            }
            await download(resObj.output.url,localPath)
            // await mockDownload(Math.random() * 5000 + 3000)
            task.title = `success ${basicTitle}`
          }
        }
      })
    })
    return {
      title: 'compress',
      task: () => new Listr(uploadTaskParams, { concurrent: true })
    }
  }
  const tinyTask = new Listr([
    {
      title: 'found 0 files',
      task: (ctx, task) => {
        ctx.imgList = imgList
        task.title = `found ${imgList.length} files`
        tinyTask.add(getCompressTask())
      }
    },
  ])
  return tinyTask
}
const tiny = (inputPath,ops)=>{
  const validateOps = ({outputPath,fileType=['.png','.jpg']}={}) => {
    const validate = {}
    if (outputPath) {
      validate.outputPath = path.isAbsolute(ops.outputPath)?ops.outputPath:path.resolve(process.cwd(),ops.outputPath)
    }
    return validate
  }
  const imgList = fileDisplay(inputPath, fileInfo => {
    return fileInfo.extname ==='.jpg'||fileInfo.extname ==='.png'
  })
  getTinyTask(imgList,validateOps(ops)).run().then(res => {
    // console.log(res)
    res.imgList.forEach(i=>{
      console.log(i.compressInfo)
    })
  }).catch(err => {
    console.log('捕获错误',err)
    // err.imgList.forEach(i=>{
    //   console.log(i)
    // })
  })
}

const inputPath = './compressImg'
const tinyOps = {
  // outputPath: './compressImg'
}
tiny(inputPath,tinyOps)
// console.log(fs.statSync(path.resolve(__dirname,'./tiny.js')))
// module.exports = tiny