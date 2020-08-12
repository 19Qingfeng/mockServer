const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const user = require('./routes/user')

// error handler
onerror(app)

// 解决跨域
const handler = async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*"); // 规定允许访问该资源的外域 URI
  ctx.set("Access-Control-Allow-Methods", "GET"); // 请求方式
  ctx.set("Access-Control-Max-Age", "3600"); // 设定预检请求结果的缓存时间
  ctx.set("Access-Control-Allow-Headers", "apk"); //  规定 CORS 请求时会额外发送的头信息字段
  ctx.set("Access-Control-Allow-Credentials", "true"); // 请求可以带 Cookie 等

  // 针对预检请求
  if (ctx.request.method == "OPTIONS") {
    ctx.response.stutas = "200"
  }

  try {
    await next();
    console.log("处理通过");
  } catch (e) {
    console.log("处理错误");
    ctx.response.status = e.statusCode || err.status || 500;
    ctx.response.body = {
      message: e.message
    }
  }
}
// use handler
app.use(handler)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods()) //<--配置路由

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app