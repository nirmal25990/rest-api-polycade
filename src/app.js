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

//import controllers
const priceController = require('./controllers').price;
const machineController = require('./controllers').machine;

//error handaling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

router
  //default route
  .get('/', (ctx, next) => {
    ctx.body = 'hello world'
  })
  //pricing-model routes
  .get('/pricing-models', priceController.list)
  .post('/pricing-models', priceController.add)
  .get('/pricing-models/:pmid', priceController.getById)
  .put('/pricing-models/:pmid', priceController.update)
  .get('/pricing-models/:pmid/prices', priceController.getPricesById)
  .post('/pricing-models/:pmid/prices', priceController.addPrices)
  .delete('/pricing-models/:pmid', priceController.deletePricingModel)
  .delete('/pricing-models/:pmid/prices/:priceid', priceController.delete)
  //machines routes
  .get('/machines/:machineid/prices', machineController.getById)
  .post('/machines', machineController.addMachine)
  .put('/machines/:machineid/prices/:pmid', machineController.update)
  .delete('/machines/:machineid', machineController.deleteMachine)
  .delete('/machines/:machineid/prices/:priceid', machineController.delete)

const server = app
  .use(router.routes())

module.exports = server;
