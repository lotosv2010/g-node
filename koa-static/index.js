const Koa = require('koa')
const app = new Koa()

const path = require('path')
const static = require('./koa-static')
app.use(static(path.join(__dirname, '..', 'public')))

app.use((ctx, next) => {
  ctx.body = 'koa'
})

app.on('error', (error) => {
  console.log('error', error)
})

app.listen(3000, () => {
  console.log(`server start port 3000`)
})