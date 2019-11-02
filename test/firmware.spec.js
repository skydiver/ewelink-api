const delay = require('delay');

const ewelink = require('../main');

const {
  email,
  password,
  singleChannelDeviceId,
} = require('./_setup/credentials.json');

const {
  loginExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
} = require('./_setup/expectations');

describe('firmware versions', () => {
  let connection;

  beforeAll(() => {
    connection = new ewelink({ email, password });
  });

  beforeEach(async () => {
    await delay(1000);
  });

  test('get firmware version', async () => {
    const device = await connection.getDevice(singleChannelDeviceId);
    const currentVersion = device.params.fwVersion;
    const firmware = await connection.getFirmwareVersion(singleChannelDeviceId);
    expect(typeof firmware).toBe('object');
    expect(firmware.status).toBe('ok');
    expect(firmware.fwVersion).toBe(currentVersion);
  });

  test('get device firmware version', async () => {
    const login = await connection.login();
    const accessToken = login.at;
    const conn = new ewelink({ at: accessToken });
    const device = await conn.getDevice(singleChannelDeviceId);
    const currentVersion = device.params.fwVersion;
    const firmware = await conn.getFirmwareVersion(singleChannelDeviceId);
    expect(typeof firmware).toBe('object');
    expect(firmware.status).toBe('ok');
    expect(firmware.fwVersion).toBe(currentVersion);
  });

  test('get device firmware version should fail', async () => {
    const conn = new ewelink({ email, password });
    const firmwareVersion = await conn.getFirmwareVersion('invalid deviceid');
    expect(typeof firmwareVersion).toBe('object');
    expect(firmwareVersion.msg).toBe('Device does not exist');
    expect(firmwareVersion.error).toBe(500);
  });

  test('get device firmware version should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const firmware = await conn.getFirmwareVersion(singleChannelDeviceId);
    expect(typeof firmware).toBe('object');
    expect(firmware.msg).toBe('Authentication error');
    expect(firmware.error).toBe(401);
  });
});
