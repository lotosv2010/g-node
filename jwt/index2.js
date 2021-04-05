const Koa = require('koa')
var koaBody = require('koa-body');
const Router = require('@koa/router')
const router = new Router()
// const jwt = require('jwt-simple')
const jwt = require('./lib/jwt')

const app = new Koa()
app.use(koaBody()); 
const secret = 'test'

// curl -v -X POST --data "username=admin&password=admin" http://localhost:5000/login
router.post('/login', async (ctx) => {
  // { username: 'admin', password: 'admin' }
  const { username, password } = ctx.request.body
  // jsonwebstoken / jwt-simple
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

router.get('/validate', async (ctx) => {
  const authorization = ctx.headers['authorization'] // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImFkbWluIg.LTY9N4BZdHEUvUm50klNVvjPOn4CPeVBtxny54R6-vQ'
  try {
    const r = jwt.decode(authorization, secret)
    ctx.body = {
      code: 0,
      username: r
    }
  } catch (e) {
    ctx.body = {
      code: 1,
      message: 'error'
    }
  }
})
app.use(router.routes())
app.listen(5000)