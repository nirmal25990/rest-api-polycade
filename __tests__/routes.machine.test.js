const app = require('../src/app.js');
const supertest = require('supertest');

let machine1Id = null, machine2Id = null, pricingModelId = null;
let server, request;

// start listening to app
beforeAll(async () => {
  server = await app.listen(4002)
  request = supertest.agent(server);
  // console.log('Machine server start!');
});

// close the server after each test
afterAll(() => {
  server.close();
  // console.log('Machine server closed!');
});

describe('routes : machine', () => {

  describe('GET /machines/:machine-id/prices', () => {

    test('should respond with a single machine\'s pricing model and price', async () => {
      //add test price model 
      const responsePricingModel = await request.post('/pricing-models').send({
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
      pricingModelId = (responsePricingModel.body && responsePricingModel.body.id) ? responsePricingModel.body.id : null;
      //add machine model 1
      const responseMachineModel = await request.post('/machines').send({
        "name": "Machine 65",
        "pricing_id": responsePricingModel.body.id
      });
      machine1Id = (responseMachineModel.body && responseMachineModel.body.id) ? responseMachineModel.body.id : null;
      //get machine
      const response = await request.get(`/machines/${responseMachineModel.body.id}/prices`);
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Test Value Option",
          pricing: expect.any(Array),
        })
      );
    });

    test('if the machine does not have a pricing model configured then should respond with a default price-model', async () => {
      //add machine model 2 without pricing_id
      const responseMachineModel = await request.post('/machines').send({
        "name": "Machine 66"
      });
      machine2Id = (responseMachineModel.body && responseMachineModel.body.id) ? responseMachineModel.body.id : null;
      //get machine
      const response = await request.get(`/machines/${responseMachineModel.body.id}/prices`);
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: "Default",
          pricing: expect.any(Array),
        })
      );
    });

    test('should throw an error(Machine not found) if the machine does not exist', async () => {
      const response = await request.get('/machines/bf2bdba0-70dc-11ea-b663-611e4d999999/prices');
      expect(response.status).toEqual(404);
      expect(response.type).toMatch('application/json');
      expect(response.error.text).toMatch(/Machine not found/);
    });

  });

  describe('PUT /machines/:machine-id/prices/:pm-id', () => {

    test('should return the price-model that was updated', async () => {
      const response = await request.put(`/machines/${machine2Id}/prices/${pricingModelId}`)
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body.message).toMatch(/Machine's pricing model updated/);
    });

    test('should throw an error(Machine not found) if the machine does not exist', async () => {
      const response = await request.put(`/machines/bf2bdba0-70dc-11ea-b663-611e4d999999/prices/${pricingModelId}`)
      expect(response.status).toEqual(404);
      expect(response.type).toMatch('application/json');
      expect(response.error.text).toMatch(/Machine not found/);
    });

    test('should throw an error(Pricing model not found) if the pricing-model does not exist', async () => {
      const response = await request.put(`/machines/${machine2Id}/prices/bf2bdba0-70dc-11ea-b663-611e4d999999`)
      expect(response.status).toEqual(404);
      expect(response.type).toMatch('application/json');
      expect(response.error.text).toMatch(/Pricing model not found/);
    });

  });

  describe('DELETE /machines/:machine-id/prices/:pm-id', () => {

    test('should delete pricing-model from the machine.', async () => {
      const response = await request.delete(`/machines/${machine2Id}/prices/${pricingModelId}`);
      expect(response.status).toEqual(200);
      expect(response.type).toMatch('application/json');
      expect(response.body.message).toMatch(/Removed the pricing model data from the machine/);
      //delete machine 1
      await request.delete(`/machines/${machine1Id}`);
      //delete machine 2
      await request.delete(`/machines/${machine2Id}`);
      //delete price-model
      await request.delete(`/pricing-models/${pricingModelId}`);
    });

  });

 
});