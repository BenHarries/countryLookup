// hkxx26 Country Lookup server.js

const request = require('supertest');
const app = require('./app');

describe('Test the Country Lookup API', () => {
  test('GET /favourites/:token Fails (No Authentication/Token)', () => {
    return request(app)
      .get('/favourites/asdf')
      .expect(401);
  });

  test('POST /tokensignin Fails (No Authentication/Token)', () => {
    return request(app)
      .post('/')
      .expect(401);
  });

  test('POST / Fails (No Authentication/Token)', () => {
    return request(app)
      .post('/')
      .expect(401);
  });

  test('DELETE / Fails (No Authentication/Token)', () => {
    return request(app)
      .delete('/')
      .expect(401);
  });

  test('GET /regions/:id Success (Africa is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Africa')
      .expect(200);
  });
  test('GET /regions/:id Success (Americas is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Americas')
      .expect(200);
  });
  test('GET /regions/:id Success (Asia is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Asia')
      .expect(200);
  });

  test('GET /regions/:id Success (Europe is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/europe')
      .expect(200);
  });

  test('GET /regions/:id Success (Oceania is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Oceania')
      .expect(200);
  });

  test('GET /name/:id Success (united is a valid Parameter Query)', () => {
    return request(app)
      .get('/name/united')
      .expect(200);
  });

  test('GET /regions/:id Success (Africa is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Africa')
      .expect('Content-type', /json/);
  });
  test('GET /regions/:id Success (Americas is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Americas')
      .expect('Content-type', /json/);
  });
  test('GET /regions/:id Success (Asia is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Asia')
      .expect('Content-type', /json/);
  });

  test('GET /regions/:id Success (Europe is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/europe')
      .expect('Content-type', /json/);
  });

  test('GET /regions/:id Success (Oceania is a valid Parameter Query)', () => {
    return request(app)
      .get('/regions/Oceania')
      .expect('Content-type', /json/);
  });

  test('GET /name/:id Success (united is a valid Parameter Query)', () => {
    return request(app)
      .get('/name/united')
      .expect('Content-type', /json/);
  });

  test('GET /region/:id/:id1 Fail (europe/france is an invalid Parameter Query)', () => {
    return request(app)
      .get('/region/europe/france')
      .expect(404);
  });

  test('GET /region/:id/:id1 Fail (asia/americas is an invalid Parameter Query)', () => {
    return request(app)
      .get('/region/asia/americas')
      .expect(404);
  });

  test('GET /name/:id/:id1 Fail (france/mexico is an invalid Parameter Query)', () => {
    return request(app)
      .get('/name/france/mexico')
      .expect(404);
  });

  test('GET /name/:id/:id1 Fail (united/3 is an invalid Parameter Query)', () => {
    return request(app)
      .get('/name/united/3')
      .expect(404);
  });


});