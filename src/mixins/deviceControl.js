const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const { nonce, timestamp } = require('../helpers/utilities');
const errors = require('../data/errors');

const {
  getNewPowerState,
  getPowerStateParams,
  VALID_POWER_STATES,
} = require('../helpers/device-control');

module.exports = {
  async initDeviceControl(params = {}) {
    // check if socket is already initialized
    if (this.wsp) {
      return;
    }

    const { APP_ID, at, apiKey } = this;

    // set delay between socket messages
    const { delayTime = 1000 } = params;
    this.wsDelayTime = delayTime;

    // request credentials if needed
    if (at === null || apiKey === null) {
      await this.getCredentials();
    }

    // request distribution service
    const dispatch = await this.makeRequest({
      method: 'post',
      url: `https://${this.region}-api.coolkit.cc:8080`,
      uri: '/dispatch/app',
      body: {
        accept: 'ws',
        appid: APP_ID,
        nonce,
        ts: timestamp,
        version: 8,
      },
    });

    // WebSocket parameters
    const WSS_URL = `wss://${dispatch.domain}:${dispatch.port}/api/ws`;
    const WSS_CONFIG = { createWebSocket: wss => new W3CWebSocket(wss) };

    // open WebSocket connection
    this.wsp = new WebSocketAsPromised(WSS_URL, WSS_CONFIG);

    // catch autentication errors
    this.wsp.onMessage.addListener(message => {
      const data = JSON.parse(message);
      if (data.error) {
        throw new Error(errors[data.error]);
      }
    });

    // open socket connection
    await this.wsp.open();

    // WebSocket handshake
    await this.webSocketHandshake();
  },

  /**
   * WebSocket authentication process
   */
  async webSocketHandshake() {
    const apikey = this.deviceApiKey || this.apiKey;

    const payload = JSON.stringify({
      action: 'userOnline',
      version: 8,
      ts: timestamp,
      at: this.at,
      userAgent: 'ewelink-api',
      apikey,
      appid: this.APP_ID,
      nonce,
      sequence: Math.floor(timestamp * 1000),
    });

    await this.wsp.send(payload);
    await delay(this.wsDelayTime);
  },

  /**
   * Close WebSocket connection and class cleanup
   */
  async webSocketClose() {
    delete this.wsDelayTime;
    delete this.wsp;
    delete this.deviceApiKey;
  },

  /**
   * Update device status (timers, share status, on/off etc)
   */
  async updateDeviceStatus(deviceId, params) {
    await this.initDeviceControl();

    const apikey = this.deviceApiKey || this.apiKey;

    const payload = JSON.stringify({
      action: 'update',
      deviceid: deviceId,
      apikey,
      userAgent: 'ewelink-api',
      sequence: Math.floor(timestamp * 1000),
      ts: timestamp,
      params,
    });

    return this.wsp.send(payload);
  },

  /**
   * Check device status (timers, share status, on/off etc)
   */
  async getDeviceStatus(deviceId, params) {
    await this.initDeviceControl();

    let response = null;

    this.wsp.onMessage.addListener(message => {
      const data = JSON.parse(message);
      if (data.deviceid === deviceId) {
        response = data;
      }
    });

    const apikey = this.deviceApiKey || this.apiKey;

    const payload = JSON.stringify({
      action: 'query',
      deviceid: deviceId,
      apikey,
      userAgent: 'ewelink-api',
      sequence: Math.floor(timestamp * 1000),
      ts: timestamp,
      params,
    });

    this.wsp.send(payload);
    await delay(this.wsDelayTime);

    return response;
  },

  /**
   * Set device power status
   */
  async setWSDevicePowerState(deviceId, state, options = {}) {
    // check for valid power state
    if (!VALID_POWER_STATES.includes(state)) {
      throw new Error(errors.invalidPowerState);
    }

    // get extra parameters
    const { channel = 1, shared = false } = options;

    // if device is shared by other account, fetch device api key
    if (shared) {
      const device = await this.getDevice(deviceId);
      this.deviceApiKey = device.apikey;
    }

    // get device current state
    const status = await this.getDeviceStatus(deviceId, ['switch', 'switches']);

    // check for multi-channel device
    const multiChannelDevice = !!status.params.switches;

    // get current device state
    const currentState = multiChannelDevice
      ? status.params.switches[channel - 1].switch
      : status.params.switch;

    // resolve new power state
    const stateToSwitch = getNewPowerState(currentState, state);

    // build request payload
    const params = getPowerStateParams(status.params, stateToSwitch, channel);

    // change device status
    try {
      await this.updateDeviceStatus(deviceId, params);
      await delay(this.wsDelayTime);
    } catch (error) {
      throw new Error(error);
    } finally {
      await this.webSocketClose();
    }

    return {
      status: 'ok',
      state: stateToSwitch,
      channel: multiChannelDevice ? channel : 1,
    };
  },
};
