const ewelink = require('../main');

const { email, password, region } = require('./_setup/credentials.json');

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
    expect(response.msg).toBe('Authentication error');
    expect(response.error).toBe(400);
  });

  test('invalid initialization should warn user', async () => {
    const connection = new ewelink({ at: 'access token' });
    const response = await connection.getRegion();
    expect(typeof response).toBe('object');
    expect(response.msg).toBe(
      'Library needs to be initialized using email and password'
    );
    expect(response.error).toBe(406);
  });
});
