const ewelink = require('../main');

const { email, password, region } = require('./_setup/credentials.json');

const { regionExpectations } = require('./_setup/expectations');

describe('check user information', () => {
  let connection;

  beforeAll(() => {
    connection = new ewelink({ email, password });
  });

  test('region should be returned', async () => {
    const response = await connection.getRegion();
    expect(response).toMatchObject(regionExpectations);
    expect(typeof response).toBe('object');
    expect(response.email).toBe(email);
    expect(response.region).toBe(region);
  });
});
