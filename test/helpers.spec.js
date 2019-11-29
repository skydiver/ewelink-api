const ewelinkHelpers = require('../lib/ewelink-helper');

describe('check eWeLink helpers', () => {
  test('should return fake imei', async () => {
    const imei = ewelinkHelpers.makeFakeIMEI();
    expect(imei.length).toBe(36);
    expect(imei.substr(0, 9)).toBe('DF7425A0-');
    expect(imei.substr(imei.length - 18, imei.length)).toBe(
      '-9F5E-3BC9179E48FB'
    );
  });

  test('make authorization sign should return right string', async () => {
    const auth = ewelinkHelpers.makeAuthorizationSign({ data: 'string' });
    expect(auth.length).toBe(44);
    expect(auth).toBe('WtmdvaPxqhi3pd8ck1R/bvzfRzHgxDTwgnuOib33xx4=');
  });

  test('getDeviceChannelCount method should return right value', async () => {
    const deviceA = ewelinkHelpers.getDeviceChannelCount(8);
    expect(typeof deviceA).toBe('number');
    expect(deviceA).toBe(3);
    const deviceB = ewelinkHelpers.getDeviceChannelCount(31);
    expect(typeof deviceB).toBe('number');
    expect(deviceB).toBe(4);
    const deviceC = ewelinkHelpers.getDeviceChannelCount(29);
    expect(typeof deviceC).toBe('number');
    expect(deviceC).toBe(2);
    const deviceD = ewelinkHelpers.getDeviceChannelCount(27);
    expect(typeof deviceD).toBe('number');
    expect(deviceD).toBe(1);
    const unknownDevice = ewelinkHelpers.getDeviceChannelCount(5000);
    expect(typeof unknownDevice).toBe('number');
    expect(unknownDevice).toBe(0);
  });
});
