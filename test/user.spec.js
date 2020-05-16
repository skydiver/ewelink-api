const ewelink = require('../main');
const errors = require('../src/data/errors');

const { email, password, region } = require('./_setup/credentials.js');

const { regionExpectations } = require('./_setup/expectations');

describe('check user information', () => {
  test('region should be returned', async () => {
    const connection = new ewelink({ email, password });
    const response = await connection.getRegion();
    expect(response).toMatchObject(regionExpectations);
    expect(typeof response).toBe('object');
    expect(response.email).toBe(email);
    expect(response.region).toBe(region);
  });

  test('invalid credentials should fail', async () => {
    const connection = new ewelink({
      email: 'invalid',
      password: 'credentials',
    });
    const response = await connection.getRegion();
    expect(typeof response).toBe('object');
    expect(response.msg).toBe(errors['406']);
    expect(response.error).toBe(406);
  });

  test('invalid initialization should warn user', async () => {
    const connection = new ewelink({ at: 'access token' });
    const response = await connection.getRegion();
    expect(typeof response).toBe('object');
    expect(response.msg).toBe(errors.invalidAuth);
    expect(response.error).toBe(406);
  });
});
