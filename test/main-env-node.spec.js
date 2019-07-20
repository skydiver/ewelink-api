const ewelink = require('../main');
const { email, password, deviceId } = require('./_setup/credentials.json');
const {
  loginExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
} = require('./_setup/expectations');

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
