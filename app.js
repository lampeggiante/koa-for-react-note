import Koa from 'koa'
import path from 'path'
import bodyParser from 'koa-bodyparser'

import config from "./config/index.js"
import router from './router/index.js'

const app = new Koa()

app.use(bodyParser(/* {
  enableTypes: ['json', 'text'], // 仅允许 json 和 text
  strict: true,
  formidableOptions: {          // 如果需要处理文件上传，这里可以配置 formidable 的选项
    uploadDir: path.join(__dirname, '/upload'), // 指定上传目录
    keepExtensions: true         // 保持文件扩展名
  },
  onError: function (err, ctx) {
    ctx.throw(400, err);
  },
  patch: true                    // 尝试修复某些错误 
} */))

// 注册路由
app.use(router.routes())

app.listen(config.port)
console.log(`
  后台已启动，url为: ${config.ip}:${config.port}
  或者也可以访问:    http://localhost:${config.port}
`)
