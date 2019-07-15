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

  test('set device power state', async () => {
    jest.setTimeout(30000);
    const device = await conn.getDevice(deviceId);
    const currentState = device.params.switch;
    const newState = currentState === 'on' ? 'off' : 'on';
    const powerState = await conn.setDevicePowerState(deviceId, newState);
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(newState);
    const deviceVerify = await conn.getDevice(deviceId);
    const currentStateVerify = deviceVerify.params.switch;
    expect(newState).toBe(currentStateVerify);
  });
});

describe('env: serverless', () => {
  let accessToken;
  let apiKey;

  test('login into ewelink', async () => {
    const conn = new ewelink({ email, password });
    const login = await conn.login();
    accessToken = login.at;
    apiKey = login.user.apikey;
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

  test('set device power state', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ at: accessToken, apiKey });
    const device = await conn.getDevice(deviceId);
    const currentState = device.params.switch;
    const newState = currentState === 'on' ? 'off' : 'on';
    const powerState = await conn.setDevicePowerState(deviceId, newState);
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(newState);
    const deviceVerify = await conn.getDevice(deviceId);
    const currentStateVerify = deviceVerify.params.switch;
    expect(newState).toBe(currentStateVerify);
  });
});

describe('valid credentials, invalid device', () => {
  test('get device power state should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState('invalid device id');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('set device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const power = await conn.setDevicePowerState('invalid device id ', 'on');
    expect(power.msg).toBe('Device does not exist');
    expect(power.error).toBe(500);
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

  test('get device power state should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerState = await conn.getDevicePowerState('invalid device id');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(401);
  });
});
