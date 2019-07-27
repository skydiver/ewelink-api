const delay = require('delay');

const ewelink = require('../main');

const {
  email,
  password,
  deviceIdWithoutPower,
} = require('./_setup/credentials.json');
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

  test('toggle device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.toggleDevice('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('raw power usage should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe('No power usage data found.');
  });

  test('current month power usage should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDevicePowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe('No power usage data found.');
  });

  test('raw power on device without electricity monitor should fail', async () => {
    jest.setTimeout(30000);
    await delay(1000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage(deviceIdWithoutPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe('No power usage data found.');
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
