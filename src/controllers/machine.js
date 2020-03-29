/**
 *
 * Endpoint: ['/machines']
 *
 * Method: POST
 * @function
 * @name addMachine
 * @param  {string} name
 * @param  {string} pricing_id
 * @return {object} data
 */
exports.addMachine = async (ctx) => {
  let data = await ctx.db.Machine.findOne({
    where: { name: ctx.request.body.name }
  })
  if (data) {
    ctx.throw(400, 'Pricing model with name alerady exists');
  } else {
    let priceData = await ctx.db.Price.findByPk(ctx.request.body.pricing_id)
    if (priceData) {
      ctx.body = await ctx.db.Machine.create({
        name: ctx.request.body.name,
        priceId: priceData.id
      })
    } else {
      ctx.body = await ctx.db.Machine.create({
        name: ctx.request.body.name,
        priceId: null
      })
    }
  }
}

/**
 *
 * Endpoint: ['/machines/:machineid/prices']
 *
 * Method: POST
 * @function
 * @name getById
 * @param  {string} machineid
 * @return {object} data
 */
exports.getById = async (ctx) => {
  const data = await ctx.db.Machine.findByPk(ctx.params.machineid)
  if (!data) {
    ctx.throw(404, 'Machine not found');
  } else {
    if (data.priceId) {
      let priceData = await ctx.db.Price.findByPk(data.priceId)
      ctx.body = priceData
    } else {
      let priceData = await ctx.db.Price.findOne({
        where: { name: "Default" }
      })
      ctx.body = priceData
    }
  }
}

/**
 *
 * Endpoint: ['/machines/:machineid/prices/:pmid']
 *
 * Method: PUT
 * @function
 * @name update
 * @param  {string} machineid
 * @param  {string} pmid
 * @return {object} message
 */
exports.update = async (ctx) => {
  let data = await ctx.db.Machine.findByPk(ctx.params.machineid)
  if (!data) {
    ctx.throw(404, 'Machine not found');
  } else {
    let priceData = await ctx.db.Price.findByPk(ctx.params.pmid)
    if (priceData) {
      let machineData = await ctx.db.Machine.update({
        priceId: priceData.id
      }, { where: { id: ctx.params.machineid } })
      if (machineData) {
        ctx.body = { "message": "Machine's pricing model updated" }
      } else {
        ctx.throw(400, 'Somthing went wrong. Try again!');
      }
    }
    else {
      ctx.throw(404, "Pricing model not found")
    }
  }
}

/**
 *
 * Endpoint: ['/machines/:machineid/prices/:priceid']
 *
 * Method: DELETE
 * @function
 * @name delete
 * @param  {string} machineid
 * @param  {string} priceid
 * @return {object} message
 */
exports.delete = async (ctx) => {
  let data = await ctx.db.Machine.findByPk(ctx.params.machineid)
  if (!data) {
    ctx.throw(404, 'Machine not found' )
  } else {
    data = await ctx.db.Machine.update({
      priceId: null
    }, { where: { id: ctx.params.machineid } })
    if (data) {
      ctx.body = { "message": "Removed the pricing model data from the machine" }
    } else {
      ctx.throw(400, 'Somthing went wrong. Try again!' )
    }
  }
}

/**
 *
 * Endpoint: ['/machines/:machineid']
 *
 * Method: DELETE
 * @function
 * @name deleteMachine
 * @param  {string} machineid
 * @param  {string} priceid
 * @return {object} message
 */
exports.deleteMachine = async (ctx) => {
  let data = await ctx.db.Machine.findByPk(ctx.params.machineid)
  debugger
  if (!data) {
    ctx.throw(404, 'Machine model not found')
  } else {
    let deleteMachineModel = await data.destroy()
    if (deleteMachineModel) {
      ctx.body = { "message": "Machine removed" }
    } else {
      ctx.throw(400, 'Somthing went wrong. Try again!')
    }

  }
}