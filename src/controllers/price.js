/**
 *
 * Endpoint: ['/pricing-models']
 *
 * Method: GET
 * @function
 * @name list
 * @return {array} prices
 */
exports.list = async (ctx) => {
  ctx.body = await ctx.db.Price.findAll()
}

/**
 *
 * Endpoint: ['/pricing-models']
 *
 * Method: POST
 * @function
 * @name add
 * @param  {string} name
 * @param  {array} pricing
 * @return {object} id
 */
exports.add = async (ctx) => {
  let data = await ctx.db.Price.findOne({
    where: { name: ctx.request.body.name }
  })
  if (data) {
    ctx.throw(400, 'Pricing model with name alerady exists')
  } else {
    let data = await ctx.db.Price.create({
      name: ctx.request.body.name,
      pricing: ctx.request.body.pricing
    })
    if (data) {
      ctx.body = { "id": data.id }
    } else {
      ctx.throw(400, 'Somthing went wrong. Try again!')
    }
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid']
 *
 * Method: GET
 * @function
 * @name getById
 * @param  {string} pmid
 * @return {object} data
 */
exports.getById = async (ctx) => {
  const data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model not found')
  } else {
    ctx.body = data
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid']
 *
 * Method: PUT
 * @function
 * @name update
 * @param  {string} name
 * @return {object} message
 */
exports.update = async (ctx) => {
  let data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model not found')
  } else {
    data = await ctx.db.Price.update({
      name: ctx.request.body.name,
    }, { where: { id: ctx.params.pmid } })
    if (data) {
      ctx.body = { "message": "Pricing model meta-data updated" }
    } else {
      ctx.throw(400, 'Somthing went wrong. Try again!');
    }
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid/prices']
 *
 * Method: GET
 * @function
 * @name getPricesById
 * @param  {string} pmid
 * @return {array} data
 */
exports.getPricesById = async (ctx) => {
  const data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model mot found')
  } else {
    ctx.body = data.pricing
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid/prices']
 *
 * Method: POST
 * @function
 * @name addPrices
 * @param  {string} pmid
 * @param  {number} price
 * @param  {string} name
 * @param  {number} value
 * @return {object} message
 */
exports.addPrices = async (ctx) => {
  let index;
  let data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model not found')
  } else {
    for (let i = 0; i < data.pricing.length; i++) {
      let priceData = JSON.parse(data.pricing[i])
      let priceId = priceData.price;
      if (priceId == ctx.request.body.price) {
        index = i
        ctx.body = index
        break;
      }
    }
    if (index > -1) {
      ctx.throw(400, 'Price alerady exists')
    } else {
      let newPrice = {
        "price": ctx.request.body.price,
        "name": ctx.request.body.name,
        "value": ctx.request.body.value
      }
      let newData = data.pricing.concat(JSON.stringify(newPrice));
      let finalData = await ctx.db.Price.update({
        pricing: newData
      }, { where: { id: ctx.params.pmid } })
      if (finalData) {
        ctx.body = { "message": "Pricing data added" }
      } else {
        ctx.throw(400, 'Somthing went wrong. Try again!');
      }
    }
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid/prices/:priceid']
 *
 * Method: DELETE
 * @function
 * @name delete
 * @param  {string} pmid
 * @param  {string} priceid
 * @return {object} message
 */
exports.delete = async (ctx) => {
  let data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model not found')
  } else {
    let index;
    debugger
    for (let i = 0; i < data.pricing.length; i++) {
      let priceData = JSON.parse(data.pricing[i])
      let priceId = priceData.price;
      if (priceId == ctx.params.priceid) {
        index = i
        break;
      }
    }
    if (index > -1) {
      data.pricing.splice(index, 1);
      let ndata = await ctx.db.Price.update({
        pricing: data.pricing
      }, { where: { id: ctx.params.pmid } })
      if (ndata) {
        ctx.body = { "message": "Price removed" }
      } else {
        ctx.throw(400, 'Somthing went wrong. Try again!');
      }
    }
  }
}

/**
 *
 * Endpoint: ['/pricing-models/:pmid']
 *
 * Method: DELETE
 * @function
 * @name deletePricingModel
 * @param  {string} pmid
 * @return {object} message
 */
exports.deletePricingModel = async (ctx) => {
  let data = await ctx.db.Price.findByPk(ctx.params.pmid)
  if (!data) {
    ctx.throw(404, 'Pricing model not found')
  } else {
    let deletePriceModel = await data.destroy()
    if (deletePriceModel) {
      ctx.body = { "message": "Price model removed" }
    } else {
      ctx.throw(400, 'Somthing went wrong. Try again!')
    }

  }
}
