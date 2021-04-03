const querystring = require('querystring')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

Buffer.prototype.split = function (sep) {
  const sepLen = Buffer.from(sep).length
  const arr = []
  const offset = 0
  const currentIndex = 0
  while((currentIndex = this.indexOf(sep, offset)) !== -1) {
    arr.push(this.slice(offset, currentIndex))
    offset = currentIndex + sepLen
  }
  arr.push(this.slice(offset))
  return arr
}
module.exports = function(uploadDir) {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      const arr = []
      ctx.req.on('data', (chunk) => {
        arr.push(chunk)
      })
      ctx.req.on('end', () => {
        if(ctx.get('content-type') === 'application/x-www-form-urlencoded') {
          const result = Buffer.concat(arr).toString()
          ctx.request.body = querystring.parse(result)
        }
        if(ctx.get('content-type').includes('multipart/form-data')) {
          const result = Buffer.concat(arr).toString()
          const boundary = `--${ctx.get('content-type').split('=')[1]}`
          const lines = result.split(boundary).slice(1, -1)
          const obj = {}

          lines.forEach(line => {
            let [head, body] = line.split(`\r\n\r\n`)
            head = head.toString()
            const key = head.match(/name="(.+?)"/)[1]
            if(!head.includes('filename')) {
              obj[key] = body.toString().slice(0, -2)
            } else {
              const content = line.slice(head.length + 4, -2)
              const filePath = path.join(uploadDir, uuid.v4())
              obj[key] = {
                filePath,
                size: content.length
              }
              fs.writeFileSync(filePath, content)
            }
          })
          ctx.request.body = obj
        }
        resolve()
      })
    })
    await next()
  }
}