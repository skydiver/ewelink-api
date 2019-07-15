const ewelink = require('../main');
const { email, password, deviceId } = require('./credentials.json');
const {
  loginExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
} = require('./_expectations');

describe('env: node script', () => {
  let conn;

  beforeAll(() => {
    conn = new ewelink({ email, password });
  });

  test('login into ewelink', async () => {
    const login = await conn.login();
    expect(typeof login).toBe('object');
    expect(login).toMatchObject(loginExpectations);
  });

  test('get all devices', async () => {
    const devices = await conn.getDevices();
    expect(Array.isArray(devices)).toBe(true);
    expect(devices[0]).toMatchObject(allDevicesExpectations);
  });

  test('get specific device', async () => {
    const device = await conn.getDevice(deviceId);
    expect(typeof device).toBe('object');
    expect(device.deviceid).toBe(deviceId);
    expect(device).toMatchObject(specificDeviceExpectations);
  });

  test('get device power state', async () => {
    const device = await conn.getDevice(deviceId);
    const currentState = device.params.switch;
    const powerState = await conn.getDevicePowerState(deviceId);
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(currentState);
  });
});

describe('env: serverless', () => {
  let accessToken;

  test('login into ewelink', async () => {
    const conn = new ewelink({ email, password });
    const login = await conn.login();
    accessToken = login.at;
    expect(typeof login).toBe('object');
    expect(login).toMatchObject(loginExpectations);
  });

  test('get all devices', async () => {
    const conn = new ewelink({ at: accessToken });
    const devices = await conn.getDevices();
    expect(Array.isArray(devices)).toBe(true);
    expect(devices[0]).toMatchObject(allDevicesExpectations);
  });

  test('get specific device', async () => {
    const conn = new ewelink({ at: accessToken });
    const device = await conn.getDevice(deviceId);
    expect(typeof device).toBe('object');
    expect(device.deviceid).toBe(deviceId);
    expect(device).toMatchObject(specificDeviceExpectations);
  });

  test('get device power state', async () => {
    const conn = new ewelink({ at: accessToken });
    const device = await conn.getDevice(deviceId);
    const currentState = device.params.switch;
    const powerState = await conn.getDevicePowerState(deviceId);
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(currentState);
  });
});

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
    expect(login).toMatchObject({
      error: expect.any(Number),
    });
    expect(login.error).toBe(400);
  });

  test('get error response on all devices', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const devices = await conn.getDevices();
    expect(typeof devices).toBe('object');
    expect(devices).toMatchObject({
      msg: expect.any(String),
    });
    expect(devices.error).toBe(401);
  });

  test('get error response on specific device', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const device = await conn.getDevice('invalid device id');
    expect(typeof device).toBe('object');
    expect(device).toMatchObject({
      msg: expect.any(String),
    });
    expect(device.error).toBe(401);
  });
});
