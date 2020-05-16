const delay = require('delay');

const ewelink = require('../main');
const errors = require('../lib/errors');

const {
  singleChannelDeviceId,
  deviceIdWithPower,
  fourChannelsDevice,
} = require('./_setup/credentials.js');

describe('invalid credentials', () => {
  beforeEach(async () => {
    await delay(1000);
  });

  test('no credentials given', async () => {
    const conn = new ewelink({});
    expect(typeof conn).toBe('object');
    expect(conn.error).toBe('No credentials provided');
  });

  test('get error response on ewelink credentials', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const credentials = await conn.getCredentials();
    expect(typeof credentials).toBe('object');
    expect(credentials.msg).toBe('Authentication error');
    expect(credentials.error).toBe(400);
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
    const device = await conn.getDevice(singleChannelDeviceId);
    expect(typeof device).toBe('object');
    expect(device.msg).toBe('Authentication error');
    expect(device.error).toBe(401);
  });

  test('get device power state should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerState = await conn.getDevicePowerState(singleChannelDeviceId);
    const { msg, error } = powerState;
    expect(typeof powerState).toBe('object');
    expect(msg).toBe(errors[406]);
    expect(error).toBe(406);
  });

  test('set device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerState = await conn.setDevicePowerState(
      singleChannelDeviceId,
      'on'
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Authentication error');
    expect(powerState.error).toBe(401);
  });

  test('current month power usage should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerUsage = await conn.getDevicePowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe('No power usage data found.');
  });

  test('get channel count 1 should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const switchesAmount = await conn.getDeviceChannelCount(
      singleChannelDeviceId
    );
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.msg).toBe('Authentication error');
    expect(switchesAmount.error).toBe(401);
  });

  test('get channel count 4 should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const switchesAmount = await conn.getDeviceChannelCount(fourChannelsDevice);
    expect(typeof switchesAmount).toBe('object');
    expect(switchesAmount.msg).toBe('Authentication error');
    expect(switchesAmount.error).toBe(401);
  });
});
