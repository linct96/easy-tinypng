/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-08-01 10:07:33
 * @LastEditTime: 2020-08-04 13:50:03
 */
const path = require('path')
const Listr = require('listr');
const download = require('./lib/download')
const upload = require('./lib/upload')
const { fileDisplay } = require('./lib/file')
const outputPath = path.resolve(__dirname, './impressed/name.jpg')
const getUrl = 'https://tinypng.com/web/output/qtyyqbrdw020xka7f3k8y5u3eyc0z1ga'

const mockDownload = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

const compressTask = (imgList) => {
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
        ctx.uploadResList.push(res)
        if (resObj.output.ratio > 0.9) {
          task.skip(`unnecessary compress ${resObj.output.ratio}`)
          task.title = `unnecessary compress ${basicTitle}`
        } else {
          task.title = `download ${basicTitle}`
          await mockDownload(Math.random() * 5000 + 3000)
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
      const imgPathList = fileDisplay('./', fileInfo => {
        return fileInfo.extname ==='.jpg'
      })
      ctx.imgPathList = imgPathList
      ctx.uploadResList = []
      task.title = `found ${imgPathList.length} files`
      tinyTask.add(compressTask(imgPathList))
    }
  },
  // {
  //   title: 'compress',
  //   task: () => new Listr(uploadTaskParams, { concurrent: true })
  // },
]);
tinyTask.run().then(res => {
  console.log(res)
}).catch(err => {
  console.log('捕获错误')
})