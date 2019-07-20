const ewelink = require('../main');
const { email, password } = require('./credentials.json');

describe('valid credentials, invalid device', () => {
  test('get device power state should fail', async () => {
    const conn = new ewelink({ email, password });
    const powerState = await conn.getDevicePowerState('invalid deviceid');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });

  test('set device power state should fail', async () => {
    jest.setTimeout(30000);
    const conn = new ewelink({ email, password });
    const powerState = await conn.setDevicePowerState('invalid deviceid', 'on');
    expect(typeof powerState).toBe('object');
    expect(powerState.msg).toBe('Device does not exist');
    expect(powerState.error).toBe(500);
  });
});
