const app = require('../src/app.js');
const supertest = require('supertest');

let server, request;

// start listening to app
beforeAll(async () => {
  server = await app.listen(4001)
  request = supertest.agent(server);
  // console.log('Home server start!');
});

// close the server after each test
afterAll(() => {
  server.close();
  // console.log('Home server closed!');
});

describe('routes : home', () => {

  test('get home route  GET /', async () => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toContain('hello world');
  });

});