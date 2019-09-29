const delay = require('delay');

const ewelink = require('../main');

const {
  email,
  password,
  deviceIdWithoutPower,
  fourChannelsDevice,
} = require('./_setup/credentials.json');

const { loginExpectations } = require('./_setup/expectations');

describe('valid credentials, invalid device', () => {
  beforeEach(async () => {
    await delay(1000);
  });

  test('get power state on invalid device should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('get power state on wrong device channel should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState(fourChannelsDevice, 8);
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device channel does not exist');
    expect(powerState.error).toBe(false);
  });

  test('set power state on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.setDevicePowerState('invalid deviceid', 'on');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('set power state on wrong device channel should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.setDevicePowerState(
      fourChannelsDevice,
      'on',
      8
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device channel does not exist');
    expect(powerState.error).toBe(false);
  });

  test('toggle power state on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.toggleDevice('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('raw power usage on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.msg).toBe('Forbidden');
    expect(powerUsage.error).toBe(403);
  });

  test('current month power usage on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDevicePowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.msg).toBe('Forbidden');
    expect(powerUsage.error).toBe(403);
  });

  test('raw power on device without electricity monitor should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage(deviceIdWithoutPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe('No power usage data found.');
  });

  test('get channel count should fail', async () => {
    const conn = new ewelink({ email, password });
    const switchesAmount = await conn.getDeviceChannelCount('invalid deviceid');
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.msg).toBe('Device does not exist');
    expect(switchesAmount.error).toBe(500);
  });

  test('get device firmware version should fail', async () => {
    const conn = new ewelink({ email, password });
    const firmwareVersion = await conn.getFirmwareVersion('invalid deviceid');
    expect(typeof firmwareVersion).toBe('object');
    expect(firmwareVersion.msg).toBe('Device does not exist');
    expect(firmwareVersion.error).toBe(500);
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
