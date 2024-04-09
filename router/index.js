import Router from 'koa-router'

import notesRouter from './notes'
import userRouter from './users'

const router = new Router({
  prefix: '/api'
})

router.use('/notes', notesRouter.routes(), notesRouter.allowedMethods())
router.use('/users', userRouter.routes(), notesRouter.allowedMethods())

export default router
