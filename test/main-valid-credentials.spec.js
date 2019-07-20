const ewelink = require('../main');
const { email, password } = require('./_setup/credentials.json');
const { loginExpectations } = require('./_setup/expectations');

describe('valid credentials, invalid device', () => {
  test('get device power state should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('set device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.setDevicePowerState('invalid deviceid', 'on');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });
});

describe('valid credentials, wrong region', () => {
  test('should login in the right region', async () => {
    const conn = new ewelink({ email, password, region: 'eu' });
    const login = await conn.login();
    expect(typeof login).toBe('object');
    expect(login).toMatchObject(loginExpectations);
  });
});
