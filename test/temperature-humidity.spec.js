const ewelink = require('../main');

const {
  email,
  password,
  deviceIdWithTempAndHum,
} = require('./_setup/credentials.json');

describe.skip('current temerature and humidity: node script', () => {
  let conn;

  beforeAll(async () => {
    conn = new ewelink({ email, password });
    await conn.login();
  });

  test('should return current temperature', async () => {
    const device = await conn.getDevice(deviceIdWithTempAndHum);
    const { currentTemperature } = device.params;
    const temperature = await conn.getDeviceCurrentTemperature(
      deviceIdWithTempAndHum
    );
    expect(typeof temperature).toBe('object');
    expect(temperature.status).toBe('ok');
    expect(temperature.state).toBe(currentTemperature);
  });

  test('should return current humidity', async () => {
    const device = await conn.getDevice(deviceIdWithTempAndHum);
    const { currentHumidity } = device.params;
    const humidity = await conn.getDeviceCurrentHumidity(
      deviceIdWithTempAndHum
    );
    expect(typeof humidity).toBe('object');
    expect(humidity.status).toBe('ok');
    expect(humidity.state).toBe(currentHumidity);
  });
});

describe.skip('current temerature and humidity: serverless', () => {
  let accessToken;
  let apiKey;

  beforeAll(async () => {
    const conn = new ewelink({ email, password });
    const login = await conn.login();
    accessToken = login.at;
    apiKey = login.user.apikey;
  });

  test('should return current temperature', async () => {
    const conn = new ewelink({ at: accessToken, apiKey });
    const device = await conn.getDevice(deviceIdWithTempAndHum);
    const { currentTemperature } = device.params;
    const temperature = await conn.getDeviceCurrentTemperature(
      deviceIdWithTempAndHum
    );
    expect(typeof temperature).toBe('object');
    expect(temperature.status).toBe('ok');
    expect(temperature.state).toBe(currentTemperature);
  });

  test('should return current humidity', async () => {
    const conn = new ewelink({ at: accessToken, apiKey });
    const device = await conn.getDevice(deviceIdWithTempAndHum);
    const { currentHumidity } = device.params;
    const humidity = await conn.getDeviceCurrentHumidity(
      deviceIdWithTempAndHum
    );
    expect(typeof humidity).toBe('object');
    expect(humidity.status).toBe('ok');
    expect(humidity.state).toBe(currentHumidity);
  });
});
