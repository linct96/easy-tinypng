/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 10:06:31
 * @LastEditTime: 2021-04-07 14:00:01
 */
const fs = require('fs')
const path = require('path')
const Listr = require('listr');
const { fileDisplay } = require('./file')
const table = require('text-table');
const upload = require('./upload')
const download = require('./download')
const getTinyTask = (imgList, { outputPath }) => {
  const getUploadTask = (imgList) => {
    const uploadTaskParams = []
    imgList.forEach(fileInfo => {
      uploadTaskParams.push({
        title: fileInfo.basename,
        task: async (ctx, task) => {
          const basicTitle = task.title
          task.title = `upload ${basicTitle}`
          const res = await upload(fileInfo.path)
          fileInfo.response = res
          const resObj = JSON.parse(res)
          fileInfo.compressInfo = resObj.output
          if (resObj.output.ratio > 0.9) {
            // task.skip(`unnecessary compress ${resObj.output.ratio}`)
            task.skip()
            task.title = `unnecessary compress ${basicTitle}`
          } else {
            task.title = `download ${basicTitle}`

            let localPath
            if (outputPath) {
              if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true })
              }
              localPath = path.join(outputPath, fileInfo.basename)
            } else {
              localPath = fileInfo.path
            }
            await download(resObj.output.url, localPath)
            // await mockDownload(Math.random() * 5000 + 3000)
            task.title = `success ${basicTitle}`
          }
        }
      })
    })
    return uploadTaskParams
  }
  const uploadTask = getUploadTask(imgList)

  const tinyTask = new Listr([
    {
      title: 'found 0 files',
      task: (ctx, task) => {
        ctx.imgList = imgList
        task.title = `found ${imgList.length} files`
      }
    }, {
      title: 'compress',
      task: () => new Listr(uploadTask, { concurrent: true })
    }, {
      title: 'done',
      task: () => { }
    }
  ])
  return tinyTask
}
const tiny = (inputPath, ops) => {
  const validateOps = ({ outputPath, fileType = ['.png', '.jpg'], compressRatioLimit = 0.9, verbose } = {}) => {
    const validate = {
      outputPath,
      fileType,
      compressRatioLimit
    }
    if (outputPath) {
      validate.outputPath = path.isAbsolute(ops.outputPath) ? ops.outputPath : path.resolve(process.cwd(), ops.outputPath)
    }
    if (compressRatioLimit > 0 && compressRatioLimit < 1) {
      validate.compressRatioLimit = compressRatioLimit
    }
    if (verbose !== undefined) {
      validate.verbose = true
    }
    return validate
  }
  const vOps = validateOps(ops)
  const imgList = fileDisplay(inputPath, fileInfo => /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(fileInfo.extname))
  getTinyTask(imgList, vOps).run().then(res => {
    const b2kb = (b) => {
      return (b / 1024).toFixed(2) + 'kb'
    }

    let oldTotalSize = 0
    let totalSize = 0
    let tableText = [['origin size', 'compressed size', 'compress ratio', 'download url']]
    res.imgList.forEach(i => {
      oldTotalSize += i.size
      totalSize += i.compressInfo.size
      // console.log(i.response)
      const resObj = JSON.parse(i.response)
      tableText.push([b2kb(resObj.input.size), b2kb(resObj.output.size), resObj.output.ratio * 100 + '%', resObj.output.url])
    })
    if (vOps.verbose) {
      console.log(table(tableText));
      console.log(`oldTotalSize:${b2kb(oldTotalSize)},currentTotalSize:${b2kb(totalSize)},totalSaved:${b2kb(oldTotalSize - totalSize)}`)
    }
    return res
  }).catch(err => {
    console.log('捕获错误', err)
  })
}


module.exports = tiny