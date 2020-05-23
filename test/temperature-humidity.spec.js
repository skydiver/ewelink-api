const ewelink = require('../main');
const errors = require('../src/data/errors');

const {
  email,
  password,
  deviceIdWithoutTempAndHum,
  deviceIdWithTempAndHum: thDevice,
} = require('./_setup/config/credentials.js');

describe('current temperature and humidity: node script', () => {
  let conn;
  let device;

  beforeAll(async () => {
    conn = new ewelink({ email, password });
    await conn.getCredentials();
  });

  beforeEach(async () => {
    device = await conn.getDevice(thDevice);
  });

  test('should return current temperature/humidity', async () => {
    const { currentTemperature, currentHumidity } = device.params;
    const result = await conn.getDeviceCurrentTH(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.temperature).toBe(currentTemperature);
    expect(result.humidity).toBe(currentHumidity);
  });

  test('should return current temperature', async () => {
    const { currentTemperature } = device.params;
    const result = await conn.getDeviceCurrentTemperature(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.temperature).toBe(currentTemperature);
  });

  test('should return current humidity', async () => {
    const { currentHumidity } = device.params;
    const result = await conn.getDeviceCurrentHumidity(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.humidity).toBe(currentHumidity);
  });
});

describe('current temperature and humidity: serverless', () => {
  let accessToken;
  let apiKey;
  let connSL;
  let device;

  beforeAll(async () => {
    const conn = new ewelink({ email, password });
    const credentials = await conn.getCredentials();
    accessToken = credentials.at;
    apiKey = credentials.user.apikey;
  });

  beforeEach(async () => {
    connSL = new ewelink({ at: accessToken, apiKey });
    device = await connSL.getDevice(thDevice);
  });

  test('should return current temperature/humidity', async () => {
    const { currentTemperature, currentHumidity } = device.params;
    const result = await connSL.getDeviceCurrentTH(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.temperature).toBe(currentTemperature);
    expect(result.humidity).toBe(currentHumidity);
  });

  test('should return current temperature', async () => {
    const { currentTemperature } = device.params;
    const result = await connSL.getDeviceCurrentTemperature(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.temperature).toBe(currentTemperature);
  });

  test('should return current humidity', async () => {
    const { currentHumidity } = device.params;
    const result = await connSL.getDeviceCurrentHumidity(thDevice);
    expect(typeof result).toBe('object');
    expect(result.status).toBe('ok');
    expect(result.humidity).toBe(currentHumidity);
  });
});

describe('current temperature and humidity: invalid device', () => {
  test('get device current temperature should fail', async () => {
    const conn = new ewelink({ email, password });
    const temperature = await conn.getDeviceCurrentTemperature('invalid');
    expect(typeof temperature).toBe('object');
    expect(temperature.msg).toBe(errors['404']);
    expect(temperature.error).toBe(404);
  });

  test('get device current humidity should fail', async () => {
    const conn = new ewelink({ email, password });
    const humidity = await conn.getDeviceCurrentHumidity('invalid');
    expect(typeof humidity).toBe('object');
    expect(humidity.msg).toBe(errors['404']);
    expect(humidity.error).toBe(404);
  });
});

describe('current temperature and humidity: device without sensor', () => {
  test('get device current temperature should fail', async () => {
    const conn = new ewelink({ email, password });
    const temperature = await conn.getDeviceCurrentTemperature(
      deviceIdWithoutTempAndHum
    );
    expect(typeof temperature).toBe('object');
    expect(temperature.msg).toBe(errors.noSensor);
    expect(temperature.error).toBe(404);
  });

  test('get device current humidity should fail', async () => {
    const conn = new ewelink({ email, password });
    const humidity = await conn.getDeviceCurrentHumidity(
      deviceIdWithoutTempAndHum
    );
    expect(typeof humidity).toBe('object');
    expect(humidity.msg).toBe(errors.noSensor);
    expect(humidity.error).toBe(404);
  });
});

describe('current temperature and humidity: invalid credentials', () => {
  test('get device current temperature should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const result = await conn.getDeviceCurrentTemperature(thDevice);
    expect(typeof result).toBe('object');
    expect(result.msg).toBe(errors['406']);
    expect(result.error).toBe(406);
  });

  test('get device current humidity should fail', async () => {
    const conn = new ewelink({ email: 'invalid', password: 'credentials' });
    const result = await conn.getDeviceCurrentHumidity(thDevice);
    expect(typeof result).toBe('object');
    expect(result.msg).toBe(errors['406']);
    expect(result.error).toBe(406);
  });
});
