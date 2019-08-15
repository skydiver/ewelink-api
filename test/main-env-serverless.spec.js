const delay = require('delay');

const ewelink = require('../main');

const {
  email,
  password,
  singleChannelDeviceId,
  fourChannelsDevice,
} = require('./_setup/credentials.json');

const {
  loginExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
} = require('./_setup/expectations');

describe('env: serverless', () => {
  let accessToken;
  let apiKey;

  beforeEach(async () => {
    await delay(1000);
  });

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
    const device = await conn.getDevice(singleChannelDeviceId);
    expect(typeof device).toBe('object');
    expect(device.deviceid).toBe(singleChannelDeviceId);
    expect(device).toMatchObject(specificDeviceExpectations);
  });

  test('get device power state', async () => {
    const conn = new ewelink({ at: accessToken });
    const device = await conn.getDevice(singleChannelDeviceId);
    const currentState = device.params.switch;
    const powerState = await conn.getDevicePowerState(singleChannelDeviceId);
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(currentState);
  });

  test('set device power state', async () => {
    jest.setTimeout(30000);
    await delay(3000);
    const conn = new ewelink({ at: accessToken, apiKey });
    const device = await conn.getDevice(singleChannelDeviceId);
    const currentState = device.params.switch;
    const newState = currentState === 'on' ? 'off' : 'on';
    const powerState = await conn.setDevicePowerState(
      singleChannelDeviceId,
      newState
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(newState);
    const deviceVerify = await conn.getDevice(singleChannelDeviceId);
    const currentStateVerify = deviceVerify.params.switch;
    expect(newState).toBe(currentStateVerify);
  });

  test('toggle device power state', async () => {
    jest.setTimeout(30000);
    await delay(3000);
    const conn = new ewelink({ at: accessToken, apiKey });
    const device = await conn.getDevice(singleChannelDeviceId);
    const currentState = device.params.switch;
    const newState = currentState === 'on' ? 'off' : 'on';
    await conn.toggleDevice(singleChannelDeviceId);
    const deviceVerify = await conn.getDevice(singleChannelDeviceId);
    const currentStateVerify = deviceVerify.params.switch;
    expect(newState).toBe(currentStateVerify);
    await conn.toggleDevice(singleChannelDeviceId);
    const deviceVerifyAgain = await conn.getDevice(singleChannelDeviceId);
    const currentStateVerifyAgain = deviceVerifyAgain.params.switch;
    expect(currentState).toBe(currentStateVerifyAgain);
  });

  test('get channel count 1', async () => {
    const conn = new ewelink({ at: accessToken });
    const switchesAmount = await conn.getDeviceChannelCount(deviceId);
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.status).toBe('ok');
    expect(switchesAmount.fwVersion).toBe(1);
  });

  test('get channel count 4', async () => {
    const conn = new ewelink({ at: accessToken });
    const switchesAmount = await conn.getDeviceChannelCount(fourChannelsDevice);
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.status).toBe('ok');
    expect(switchesAmount.fwVersion).toBe(4);
  });

  test('get device firmware version', async () => {
    const conn = new ewelink({ at: accessToken });
    const device = await conn.getDevice(deviceId);
    const currentVersion = device.params.fwVersion;
    const firmwareVersion = await conn.getFirmwareVersion(deviceId);
    expect(typeof firmwareVersion).toBe('object');
    expect(firmwareVersion.status).toBe('ok');
    expect(firmwareVersion.state).toBe(currentVersion);
  });
});
