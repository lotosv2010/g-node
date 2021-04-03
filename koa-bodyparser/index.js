const Koa = require('koa')
const bodyParser = require('./koa-bodyparser')
const app = new Koa()

app.use(bodyParser())

app.use(async (ctx, next) => {
  if(ctx.path === '/login' && ctx.method === 'GET') {
    ctx.body = `
      <form action="/login" method="post">
        <div>username <input type="text" name="username" /></div>
        <div>password <input type="password" name="password" /></div>
        <button>submit</button>
      </form>
    `
  } else {
    await next()
  }
})

app.use(async (ctx, next) => {
  if(ctx.path === '/login' && ctx.method === 'POST') {
    ctx.body = ctx.request.body
  } else {
    await next()
  }
})

app.on('error', (error) => {
  console.log('error', error)
})

app.listen(3000, () => {
  console.log(`server start port 3000`)
})