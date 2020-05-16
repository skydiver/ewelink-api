const delay = require('delay');

const ewelink = require('../main');
const errors = require('../lib/errors');

const {
  email,
  password,
  deviceIdWithoutPower,
  fourChannelsDevice,
} = require('./_setup/credentials.js');

const { credentialsExpectations } = require('./_setup/expectations');

describe('valid credentials, invalid device', () => {
  beforeEach(async () => {
    await delay(1000);
  });

  test('get power state on invalid device should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe(errors[404]);
    expect(powerState.error).toBe(404);
  });

  test('get power state on wrong device channel should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState(fourChannelsDevice, 8);
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe(errors.ch404);
    expect(powerState.error).toBe(404);
  });

  test('set power state on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.setDevicePowerState('invalid deviceid', 'on');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe(errors[404]);
    expect(powerState.error).toBe(404);
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
    expect(powerState.msg).toBe(errors.ch404);
    expect(powerState.error).toBe(404);
  });

  test('toggle power state on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.toggleDevice('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe(errors[404]);
    expect(powerState.error).toBe(404);
  });

  test('raw power usage on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe(errors.noPower);
  });

  test('current month power usage on invalid device should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDevicePowerUsage('invalid deviceid');
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe(errors.noPower);
  });

  test('raw power on device without electricity monitor should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerUsage = await conn.getDeviceRawPowerUsage(deviceIdWithoutPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe(errors.noPower);
  });

  test('get channel count should fail', async () => {
    const conn = new ewelink({ email, password });
    const switchesAmount = await conn.getDeviceChannelCount('invalid deviceid');
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.msg).toBe(errors[404]);
    expect(switchesAmount.error).toBe(404);
  });
});

describe('valid credentials, wrong region', () => {
  test('should get valid credentials in the right region', async () => {
    const conn = new ewelink({ email, password, region: 'eu' });
    const credentials = await conn.getCredentials();
    expect(typeof credentials).toBe('object');
    expect(credentials).toMatchObject(credentialsExpectations);
  });
});
