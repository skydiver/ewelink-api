const ewelink = require('../main');

const {
  email,
  password,
  sharedAccount,
  singleChannelDeviceId,
  fourChannelsDevice,
} = require('./_setup/config/credentials.js');

const {
  credentialsExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
} = require('./_setup/expectations');

describe('device control using WebSockets', () => {
  let conn;

  beforeAll(() => {
    conn = new ewelink({ email, password });
  });

  test('toggle power state on single channel device', async () => {
    jest.setTimeout(30000);
    const device = await conn.getDevice(singleChannelDeviceId);
    const { switch: originalState } = device.params;
    const newState = originalState === 'on' ? 'off' : 'on';
    const powerState = await conn.setWSDevicePowerState(
      singleChannelDeviceId,
      'toggle',
      {
        shared: sharedAccount,
      }
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.channel).toBe(1);
    expect(powerState.state).toBe(newState);
    const deviceVerify = await conn.getDevice(singleChannelDeviceId);
    const { switch: currentStateVerify } = deviceVerify.params;
    expect(newState).toBe(currentStateVerify);
  });

  test('toggle power state on multi-channel device', async () => {
    jest.setTimeout(30000);
    const channel = 3;
    const device = await conn.getDevice(fourChannelsDevice);
    const { switches } = device.params;
    const originalState = switches[channel - 1].switch;
    const newState = originalState === 'on' ? 'off' : 'on';
    const powerState = await conn.setWSDevicePowerState(
      fourChannelsDevice,
      'toggle',
      {
        channel,
        shared: sharedAccount,
      }
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.channel).toBe(channel);
    expect(powerState.state).toBe(newState);
    const deviceVerify = await conn.getDevice(fourChannelsDevice);
    const { switches: switchesVerify } = deviceVerify.params;
    const currentStateVerify = switchesVerify[channel - 1].switch;
    expect(newState).toBe(currentStateVerify);
  });
});
