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
    expect(credentials.msg).toBe(errors[406]);
    expect(credentials.error).toBe(406);
  });

  test('get error response on all devices', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const devices = await conn.getDevices();
    expect(typeof devices).toBe('object');
    expect(devices.msg).toBe(errors['406']);
    expect(devices.error).toBe(406);
  });

  test('get error response on specific device', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const device = await conn.getDevice(singleChannelDeviceId);
    const { msg, error } = device;
    expect(typeof device).toBe('object');
    expect(msg).toBe(errors[406]);
    expect(error).toBe(406);
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
    const { msg, error } = powerState;
    expect(typeof powerState).toBe('object');
    expect(msg).toBe(errors[406]);
    expect(error).toBe(406);
  });

  test('current month power usage should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const powerUsage = await conn.getDevicePowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage.error).toBe(errors.noPower);
  });

  test('get channel count 1 should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const switchesAmount = await conn.getDeviceChannelCount(
      singleChannelDeviceId
    );
    const { msg, error } = switchesAmount;
    expect(typeof switchesAmount).toBe('object');
    expect(msg).toBe(errors[406]);
    expect(error).toBe(406);
  });

  test('get channel count 4 should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const switchesAmount = await conn.getDeviceChannelCount(fourChannelsDevice);
    const { msg, error } = switchesAmount;
    expect(typeof switchesAmount).toBe('object');
    expect(msg).toBe(errors[406]);
    expect(error).toBe(406);
  });
});
