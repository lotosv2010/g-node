const path = require('path')
const fs = require('fs').promises
const mime = require('mime')
module.exports = function static(root) {
  return async (ctx, next) => {
    const filePath = path.join(root, ctx.path)
    try {
      const statObj = await fs.stat(filePath)
      if(statObj.isFile()) {
        ctx.type = `${mime.getType(filePath)};charset=utf-8`
        ctx.body = await fs.readFile(filePath)
      } else {
        ctx.type = `text/html;charset=utf-8`
        ctx.body = await fs.readFile(path.join(filePath, 'index.html'))
      }
    } catch (e) {
      await next()
    }
  }
}