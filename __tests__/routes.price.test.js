const app = require('../src/app.js');
const supertest = require('supertest');

let pricingModelId = null;
let server, request;

// start listening to app
beforeAll(async () => {
  server = await app.listen(4003)
  request = supertest.agent(server);
  // console.log('Price server start!');
});
// close the server after each test
afterAll(() => {
  server.close();
  // console.log('Price server closed!');
});

//Custom expect
expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument)
      ])
    )
    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }
  }
})

describe('routes : prices', () => {

  describe('POST /pricing-models', () => {

    test('should return the price model\'s id that was added', async () => {
      //add test price model 
      const response = await request.post('/pricing-models').send({
        "name": "Test Value Option",
        "pricing": [
          {
            "price": 3,
            "name": "10 minutes",
            "value": 10
          },
          {
            "price": 5,
            "name": "20 minutes",
            "value": 20
          }
        ]
      });
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String)
        })
      );
      pricingModelId = (response.body && response.body.id) ? response.body.id : null;
    });

  });

  describe('POST /pricing-models/:pm-id/prices', () => {

    test('should add the price in pricing model', async () => {
      const response = await request.post(`/pricing-models/${pricingModelId}/prices`).send({
        "price": 500,
        "name": "150 minutes",
        "value": 150
    });
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body.message).toMatch(/Pricing data added/);
    });

  });

  describe('GET /pricing-models', () => {

    test('should return all pricing-models', async () => {
      const response = await request.get('/pricing-models');
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toContainObject({ name: 'Test Value Option' })
    });

  });

  describe('GET /pricing-models/:pm-id', () => {

    test('should respond with a single pricing-model', async () => {
      const response = await request.get(`/pricing-models/${pricingModelId}`);
      response.body.pricing = response.body.pricing.map((p) => { return JSON.parse(p) })
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toEqual(
        expect.objectContaining({
          id: pricingModelId,
          name: "Test Value Option",
          pricing: [
            {
              "price": 3,
              "name": "10 minutes",
              "value": 10
            },
            {
              "price": 5,
              "name": "20 minutes",
              "value": 20
            },
            {
              "price": 500,
              "name": "150 minutes",
              "value": 150
          }
          ]
        })
      );
    });

    test('should throw an error(Pricing model not found) if the pricing-model does not exist', async () => {
      const response = await request.get('/pricing-models/bf2bdba0-70dc-11ea-b663-611e4d999999');
      expect(response.status).toEqual(404);
      expect(response.type).toMatch('application/json');
      expect(response.error.text).toMatch(/Pricing model not found/);
    });

  });

  describe('GET /pricing-models/:pm-id/prices', () => {

    test('should respond with a single pricing-model\'s prices', async () => {
      const response = await request.get(`/pricing-models/${pricingModelId}/prices`);
      response.body = response.body.map((p) => { return JSON.parse(p) })
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toEqual(expect.arrayContaining([
        {
          "price": 3,
          "name": "10 minutes",
          "value": 10
        },
        {
          "price": 5,
          "name": "20 minutes",
          "value": 20
        }
      ]));
    });

  });

  describe('PUT /pricing-models/:pm-id', () => {

    test('should return the price-model that was updated', async () => {
      const response = await request.put(`/pricing-models/${pricingModelId}`).send({
        "name": "Test Updated Value Option"
      });
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body.message).toMatch(/Pricing model meta-data updated/);
    });

  });

  describe('DELETE /pricing-models/:pm-id/prices/:price-id', () => {

    test('should delete pricing-model\'s prices.', async () => {
      const response = await request.delete(`/pricing-models/${pricingModelId}/prices/5`);
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body.message).toMatch(/Price removed/);
      const deleteResponse = await request.delete(`/pricing-models/${pricingModelId}`);
      expect(deleteResponse.status).toEqual(200);
    });

  });

});


