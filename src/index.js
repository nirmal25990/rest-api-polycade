import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

//initialize koa
const app = new Koa()
app.use(bodyParser());
const PORT = process.env.PORT || 1337

//initialize router
const router = new Router()

//initialize model in ctx
app.context.db = require('./models/index')

router
.use(bodyParser())
  .get('/', (ctx, next) => {
    ctx.body = 'hello world'
  })

app
  .use(router.routes())
  .listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
  )
