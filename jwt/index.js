const Koa = require('koa')
var koaBody = require('koa-body');
const Router = require('@koa/router')
const router = new Router()
const jwt = require('jwt-simple')

const app = new Koa()
app.use(koaBody());
 
const secret = 'test'

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body
  const token = jwt.encode(username, secret)
  console.log(token, username)
  if(username === 'admin' && password === 'admin') {
    ctx.body = {
      code: 0,
      username,
      token
    }
  } else {
    ctx.body = {
      code: 1,
      message: '错误',
      token
    }
  }
})
app.use(router.routes())
app.listen(4000)