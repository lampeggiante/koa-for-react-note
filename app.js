import Koa from "koa"
import path from "path"
import KoaLogger from "koa-logger" // koa-log4 似乎更好
import koaStatic from "koa-static"
import { koaBody } from "koa-body"
import KoaBouncer from "koa-bouncer"
import onError from "koa-onerror"
import KoaSession from "koa-session"
import cors from "@koa/cors"
import jwt from "koa-jwt"

import config from "./config/index.js"
import router from "./router/index.js"
import { accessLogger, serverLogger, logger } from "./utils/logger.js"
import { CustomException } from "./utils/exception.js"
import { SESSION_CONFIG } from "./config/index.js"
import db from "./core/db.js"

const app = new Koa()
db()
app.keys = ["koa_for_react_blog"]

app
  .use(KoaSession(SESSION_CONFIG, app))
  .use(accessLogger())
  .use(KoaLogger())
  .use(cors())
  .use(
    koaBody({
      enableTypes: ["json", "form", "text", "xml"],
      onError: (err, ctx) => {
        ctx.throw(422, "body parse error", err)
      },
    }),
  )
  .use(KoaBouncer.middleware()) // 加入 bouncer 可以支持校验表单
  .use(koaStatic(path.join(path.resolve(), config.staticPath)))
  .use(router.routes()) // 注册路由

// 错误处理
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = "Protected resource, use Authorization header to get access\n"
    } else {
      throw err
    }
  })
})

app.use(
  jwt({
    secret: "koa-for-react-note",
  }).unless({
    path: [/\/user\/login/],
  }),
)

onError(app, {
  JSON: (err, ctx) => {
    if (err instanceof KoaBouncer.ValidationError) {
      ctx.status = 400
    } else {
      ctx.status = err.status || 500
    }

    ctx.body = {
      code: ctx.status,
      message: err.message || "server error",
      data: null,
    }
  },
})

app.on("error", (err, ctx) => {
  // 判断校验类型错误
  if (err instanceof KoaBouncer.ValidationError) return logger.warn(err)
  // 如果是自定义错误
  if (err instanceof CustomException) return logger.warn(err)
  // 错误日志持久化
  // logger.error(err);
  serverLogger.error(`Error on ${ctx.method} ${ctx.url}: ${err}`)
})

const server = app.listen(config.port, config.ip, () => {
  const address = server.address()
  console.log(`
    后台已启动，url为: http://${address.address}:${address.port}
    或者也可以访问:    http://localhost:${address.port}
  `)
})
