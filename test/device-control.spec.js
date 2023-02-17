const ewelink = require('../main');
const errors = require('../src/data/errors');
const { getAllChannelsState } = require('../src/helpers/device-control');

const {
  email,
  password,
  sharedAccount,
  singleChannelDeviceId,
  fourChannelsDevice,
} = require('./_setup/config/credentials.js');

describe('device control using WebSockets: get power state', () => {
  let conn;

  beforeAll(() => {
    conn = new ewelink({ email, password });
  });

  test('get power state on single channel device', async () => {
    jest.setTimeout(30000);
    const device = await conn.getDevice(singleChannelDeviceId);
    const { switch: originalState } = device.params;
    const powerState = await conn.getWSDevicePowerState(singleChannelDeviceId, {
      shared: sharedAccount,
    });
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(originalState);
    expect(powerState.channel).toBe(1);
  });

  test('get power state for specific channel on multi-channel device', async () => {
    jest.setTimeout(30000);
    const channel = 3;
    const device = await conn.getDevice(fourChannelsDevice);
    const { switches } = device.params;
    const originalState = switches[channel - 1].switch;
    const powerState = await conn.getWSDevicePowerState(fourChannelsDevice, {
      channel,
      shared: sharedAccount,
    });
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toBe(originalState);
    expect(powerState.channel).toBe(channel);
  });

  test('get power state for all channels on multi-channel device', async () => {
    jest.setTimeout(30000);
    const channel = 3;
    const device = await conn.getDevice(fourChannelsDevice);
    const originalState = getAllChannelsState(device.params);
    const powerState = await conn.getWSDevicePowerState(fourChannelsDevice, {
      allChannels: true,
      shared: sharedAccount,
    });
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.state).toStrictEqual(originalState);
  });
});

describe('device control using WebSockets: set power state', () => {
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

  test('turn off single channel device', async () => {
    jest.setTimeout(30000);
    const powerState = await conn.setWSDevicePowerState(
      singleChannelDeviceId,
      'off',
      {
        shared: sharedAccount,
      }
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.channel).toBe(1);
    expect(powerState.state).toBe('off');
  });

  test('turn off multi-channel device', async () => {
    jest.setTimeout(30000);
    const channel = 3;
    const powerState = await conn.setWSDevicePowerState(
      fourChannelsDevice,
      'off',
      {
        channel,
        shared: sharedAccount,
      }
    );
    expect(typeof powerState).toBe('object');
    expect(powerState.status).toBe('ok');
    expect(powerState.channel).toBe(channel);
    expect(powerState.state).toBe('off');
  });
});

describe('device control using WebSockets: errors and exceptions', () => {
  let conn;

  beforeAll(() => {
    conn = new ewelink({ email, password });
  });

  test('get power state using invalid credentials should throw an exception', async () => {
    try {
      const connection = new ewelink({
        email: 'invalid',
        password: 'credentials',
      });
      await connection.getWSDevicePowerState(singleChannelDeviceId);
    } catch (error) {
      expect(typeof error).toBe('object');
      expect(error.toString()).toBe(`Error: ${errors[406]}`);
    }
  });

  test('get power state using invalid device should throw an exception', async () => {
    jest.setTimeout(30000);
    try {
      await conn.getWSDevicePowerState('INVALID DEVICE', {
        shared: sharedAccount,
      });
    } catch (error) {
      expect(typeof error).toBe('object');
      expect(error.toString()).toBe(`Error: ${errors[403]}`);
    }
  });

  test('set power state using invalid credentials should throw an exception', async () => {
    try {
      const connection = new ewelink({
        email: 'invalid',
        password: 'credentials',
      });
      await connection.setWSDevicePowerState(singleChannelDeviceId, 'toggle');
    } catch (error) {
      expect(typeof error).toBe('object');
      expect(error.toString()).toBe(`Error: ${errors[406]}`);
    }
  });

  test('turn off invalid device', async () => {
    jest.setTimeout(30000);
    try {
      await conn.setWSDevicePowerState('INVALID DEVICE', 'off', {
        shared: sharedAccount,
      });
    } catch (error) {
      expect(typeof error).toBe('object');
      expect(error.toString()).toBe(`Error: ${errors[403]}`);
    }
  });

  test('using invalid power state should throw an exception', async () => {
    try {
      await conn.setWSDevicePowerState(singleChannelDeviceId, 'INVALID STATE');
    } catch (error) {
      expect(typeof error).toBe('object');
      expect(error.toString()).toBe(`Error: ${errors.invalidPowerState}`);
    }
  });
});

describe('device control using Zeroconf', () => {

  test('getDeviceIP with mac address on device.params', () => {
    const staMac = '3A:5C:E6:C9:8A:9E';
    const ip = '192.101.1.102';
    const device = aDevice().withParams({staMac}).device();
    const arpEntry = anArpTableEntry().withIp(ip).withMac(staMac).entry();
    const devicesCache = [device];
    const arpTable = [arpEntry];
    
    const conn = new ewelink({ email: 'someEmail', password: 'some password', devicesCache, arpTable });

    expect(conn.getZeroconfUrl(device)).toBe(`http://${ip}:8081/zeroconf`);
  });

  test('getDeviceIP with mac address on device.extra.extra', () => {
    const staMac = '3A:5C:E6:C9:8A:9E';
    const ip = '192.101.1.102';
    const device = aDevice().withExtra({staMac}).device();
    const arpEntry = anArpTableEntry().withIp(ip).withMac(staMac).entry();
    const devicesCache = [device];
    const arpTable = [arpEntry];
    
    const conn = new ewelink({ email: 'someEmail', password: 'some password', devicesCache, arpTable });
    
    expect(conn.getZeroconfUrl(device)).toBe(`http://${ip}:8081/zeroconf`);
  });
});

function anArpTableEntry() {
  const entry = {};
  return {
    withIp: function(ip) {
      entry.ip = ip;
      return this;
    },
    withMac: function(mac) {
      entry.mac = mac;
      return this;
    },
    entry: () => entry
  }
}

function aDevice() {
  let device = {};
  return {
    withExtra: function(extra) {
      device = {
        ...device,
        extra: {
          ...device.extra,
          extra
        }
      }
      return this;
    },
    withParams: function(params) {
      device.params = params;
      return this;
    },
    device: () => device
  }
}
