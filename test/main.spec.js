const ewelink = require('../main');

describe('initialize main class: allowed combinations', () => {
  test('email and password should initialize class', async () => {
    const credentials = { email: 'user@email.com', password: 'pass' };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'us',
      email: credentials.email,
      phoneNumber: null,
      password: credentials.password,
      apiKey: null,
      arpTable: null,
      at: null,
      devicesCache: null,
    });
  });

  test('email and password with region should initialize class', async () => {
    const credentials = {
      region: 'cn',
      email: 'user@email.com',
      password: 'pass',
    };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'cn',
      email: credentials.email,
      phoneNumber: null,
      password: credentials.password,
      apiKey: null,
      arpTable: null,
      at: null,
      devicesCache: null,
    });
  });

  test('phone number and password should initialize class', async () => {
    const credentials = { phoneNumber: '555123789', password: 'pass' };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'us',
      email: null,
      phoneNumber: credentials.phoneNumber,
      password: credentials.password,
      apiKey: null,
      at: null,
      arpTable: null,
      devicesCache: null,
    });
  });

  test('access token should initialize class', async () => {
    const credentials = { at: 'xxxyyyzzz' };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'us',
      email: null,
      phoneNumber: null,
      password: null,
      apiKey: null,
      at: credentials.at,
      arpTable: null,
      devicesCache: null,
    });
  });

  test('devices and arp table cache files should initialize class', async () => {
    const credentials = { devicesCache: 'devices', arpTable: 'arptable' };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'us',
      email: null,
      phoneNumber: null,
      password: null,
      apiKey: null,
      at: null,
      arpTable: credentials.arpTable,
      devicesCache: credentials.devicesCache,
    });
  });

  test('email and access token should initialize class', async () => {
    const credentials = {
      email: 'user@email.com',
      at: 'xxxyyyzzz',
    };
    const connection = new ewelink(credentials);
    expect(connection).toEqual({
      region: 'us',
      email: credentials.email,
      phoneNumber: null,
      password: null,
      apiKey: null,
      at: credentials.at,
      arpTable: null,
      devicesCache: null,
    });
  });
});

describe('initialize main class: wrong parameters combinations', () => {
  test('user and no password should fail', async () => {
    const credentials = { email: 'user@email.com' };
    const connection = new ewelink(credentials);
    expect(connection.error).toBe('No credentials provided');
  });

  test('no user and password should fail', async () => {
    const credentials = { password: 'pass' };
    const connection = new ewelink(credentials);
    expect(connection.error).toBe('No credentials provided');
  });

  test('phone number and no password should fail', async () => {
    const credentials = { phoneNumber: '555123789' };
    const connection = new ewelink(credentials);
    expect(connection.error).toBe('No credentials provided');
  });

  test('email and phone number should fail', async () => {
    const credentials = { email: 'user@email.com', phoneNumber: '555123789' };
    const connection = new ewelink(credentials);
    expect(connection.error).toBe('No credentials provided');
  });
});
