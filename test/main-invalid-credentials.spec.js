const ewelink = require('../main');
const { deviceId } = require('./_setup/credentials.json');

describe('invalid credentials', () => {
  test('no credentials given', async () => {
    const conn = new ewelink({});
    expect(typeof conn).toBe('object');
    expect(conn.error).toBe('No credentials provided');
  });

  test('get error response on api login', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const login = await conn.login();
    expect(typeof login).toBe('object');
    expect(login.msg).toBe('Authentication error');
    expect(login.error).toBe(400);
  });

  test('get error response on all devices', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const devices = await conn.getDevices();
    expect(typeof devices).toBe('object');
    expect(devices.msg).toBe('Authentication error');
    expect(devices.error).toBe(401);
  });

  test('get error response on specific device', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const device = await conn.getDevice(deviceId);
    expect(typeof device).toBe('object');
    expect(device.msg).toBe('Authentication error');
    expect(device.error).toBe(401);
  });

  test('get device power state should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerState = await conn.getDevicePowerState(deviceId);
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Authentication error');
    expect(powerState.error).toBe(401);
  });

  test('set device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerState = await conn.setDevicePowerState(deviceId, 'on');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Authentication error');
    expect(powerState.error).toBe(401);
  });
});
