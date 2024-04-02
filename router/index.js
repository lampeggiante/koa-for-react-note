import Router from 'koa-router'

const router = new Router()

router.get('/test', async (ctx) => {
  ctx.body = 'test success!'
})

router.get('/', async (ctx) => {
  ctx.body = 'hello world'
})

router.post('/post_test', async (ctx) => {
  ctx.body = ctx.request.body
})

export default router
