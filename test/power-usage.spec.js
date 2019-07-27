const delay = require('delay');

const ewelink = require('../main');

const {
  email,
  password,
  deviceIdWithPower,
} = require('./_setup/credentials.json');
const {
  rawPowerUsageExpectations,
  currentMonthPowerUsageExpectations,
} = require('./_setup/expectations');

describe('power usage: node script', () => {
  let conn;

  beforeAll(async () => {
    conn = new ewelink({ email, password });
    await conn.login();
  });

  test('should return raw power usage', async () => {
    jest.setTimeout(30000);
    const powerUsage = await conn.getDeviceRawPowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage).toMatchObject(rawPowerUsageExpectations);
    expect(powerUsage.data.hundredDaysKwhData.length).toBe(600);
  });

  test('should return current month power usage', async () => {
    jest.setTimeout(30000);
    await delay(1000);
    const days = new Date().getDate();
    const powerUsage = await conn.getDevicePowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage).toMatchObject(currentMonthPowerUsageExpectations);
    expect(powerUsage.daily.length).toBe(days);
  });
});

describe('power usage: serverless', () => {
  let accessToken;
  let apiKey;

  beforeAll(async () => {
    const conn = new ewelink({ email, password });
    const login = await conn.login();
    accessToken = login.at;
    apiKey = login.user.apikey;
  });

  test('should return raw power usage', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ at: accessToken, apiKey });
    const powerUsage = await conn.getDeviceRawPowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage).toMatchObject(rawPowerUsageExpectations);
    expect(powerUsage.data.hundredDaysKwhData.length).toBe(600);
  });

  test('should return current month power usage', async () => {
    jest.setTimeout(30000);
    await delay(1000);
    const days = new Date().getDate();
    const conn = new ewelink({ at: accessToken, apiKey });
    const powerUsage = await conn.getDevicePowerUsage(deviceIdWithPower);
    expect(typeof powerUsage).toBe('object');
    expect(powerUsage).toMatchObject(currentMonthPowerUsageExpectations);
    expect(powerUsage.daily.length).toBe(days);
  });
});
