const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const { nonce, timestamp } = require('../helpers/utilities');
const getDevice = require('./getDevice');

module.exports = {
  async initDeviceControl(params = {}) {
    // check if socket is already initialized
    if (this.wsp) {
      return;
    }

    let { APP_ID, at, apiKey } = this;

    // set delay between socket messages
    const { delayTime = 1000 } = params;
    this.wsDelayTime = delayTime;

    // request credentials if needed
    if (at === null || apiKey === null) {
      await this.getCredentials();
      at = this.at;
      apiKey = this.apiKey;
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
    await this.wsp.open();

    // WebSocket handshake
    await this.webSocketHandshake();
  },

  /**
   * WebSocket authentication process
   */
  async webSocketHandshake() {
    const payload = JSON.stringify({
      action: 'userOnline',
      version: 8,
      ts: timestamp,
      at: this.at,
      userAgent: 'ewelink-api',
      apikey: this.apiKey,
      appid: this.APP_ID,
      nonce,
      sequence: Math.floor(timestamp * 1000),
    });

    await this.wsp.send(payload);
    await delay(this.wsDelayTime);
  },

  /**
   * Update device status (timers, share status, on/off etc)
   */
  async updateDeviceStatus(deviceId, params) {
    await this.initDeviceControl();

    const payload = JSON.stringify({
      action: 'update',
      deviceid: deviceId,
      apikey: this.apiKey,
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
  async getDeviceStatus(deviceId, param) {
    await this.initDeviceControl();

    let response = null;

    this.wsp.onMessage.addListener(message => {
      const data = JSON.parse(message);
      if (data.deviceid === deviceId) {
        response = data;
      }
    });

    const payload = JSON.stringify({
      action: 'query',
      deviceid: deviceId,
      apikey: this.apiKey,
      userAgent: 'ewelink-api',
      sequence: Math.floor(timestamp * 1000),
      ts: timestamp,
      params: [param],
    });

    this.wsp.send(payload);
    await delay(this.wsDelayTime);

    return response;
  },

  /**
   * Set device power status
   */
  async setWSDevicePowerState(deviceId, state) {
    let status;

    // if action is toggle, get current power status
    if (state === 'toggle') {
      status = await this.getDeviceStatus(deviceId, 'switch');
    }

    const stateToSwitch = status.params.switch === 'on' ? 'off' : 'on';

    await this.updateDeviceStatus(deviceId, { switch: stateToSwitch });
    await delay(this.wsDelayTime);
    await this.wsp.close();
  },
};
