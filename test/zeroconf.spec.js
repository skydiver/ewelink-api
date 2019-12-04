const ewelink = require('../main');
const Zeroconf = require('../classes/Zeroconf');

const { email, password, region } = require('./_setup/credentials.json');

const { allDevicesExpectations } = require('./_setup/expectations');

describe('zeroconf: save devices to cache file', () => {
  test('can save cached devices file', async () => {
    jest.setTimeout(30000);
    const file = './test/_setup/devices-cache.json';
    const conn = new ewelink({ region, email, password });
    const result = await conn.saveDevicesCache(file);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.file).toBe(file);
  });

  test('error saving cached devices file', async () => {
    jest.setTimeout(30000);
    const file = '/tmp/non-existent-folder/devices-cache.json';
    const conn = new ewelink({ region, email, password });
    const result = await conn.saveDevicesCache(file);
    expect(result).toContain('ENOENT: no such file or directory');
  });

  test('invalid credentials trying to create cached devices file', async () => {
    const file = '/tmp/non-existent-folder/devices-cache.json';
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const result = await conn.saveDevicesCache(file);
    expect(typeof result).toBe('object');
    expect(result.msg).toBe('Authentication error');
    expect(result.error).toBe(401);
  });
});

describe('zeroconf: load devices to cache file', () => {
  test('can load cached devices file', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ region, email, password });
    const devices = await conn.getDevices();
    const devicesCache = await Zeroconf.loadCachedDevices(
      './test/_setup/devices-cache.json'
    );
    expect(typeof devicesCache).toBe('object');
    expect(devicesCache.length).toBe(devices.length);
    expect(devices[0]).toMatchObject(allDevicesExpectations);
  });

  test('error trying to load invalidcached devices file', async () => {
    jest.setTimeout(30000);
    const devicesCache = await Zeroconf.loadCachedDevices('file-not-found');
    expect(typeof devicesCache).toBe('object');
    expect(devicesCache.error).toContain('ENOENT: no such file or directory');
  });
});
