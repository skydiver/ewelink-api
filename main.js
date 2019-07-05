const rp = require('request-promise');
const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const { _get } = require('./lib/helpers');

const {
  makeAuthorizationSign,
  loginPayload,
  wssLoginPayload,
  wssUpdatePayload,
} = require('./lib/ewelink-helper');

class eWeLink {
  constructor({ region = 'us', email, password, at, apiKey }) {
    if (!at && (!email && !password)) {
      return { error: 'No credentials provided' };
    }

    this.apiUrl = `https://${region}-api.coolkit.cc:8080/api`;
    this.apiWebSocket = `wss://${region}-pconnect3.coolkit.cc:8080/api/ws`;
    this.email = email;
    this.password = password;
    this.at = at;
    this.apiKey = apiKey;
  }

  async makeRequest({ method = 'GET', uri, body = {}, qs = {} }) {
    const { at } = this;

    if (!at) {
      await this.login();
    }

    const response = await rp({
      method,
      uri: `${this.apiUrl}${uri}`,
      headers: { Authorization: `Bearer ${this.at}` },
      body,
      qs,
      json: true,
    });

    return response;
  }

  async login() {
    const body = loginPayload({
      email: this.email,
      password: this.password,
    });
    const response = await rp({
      method: 'POST',
      uri: `${this.apiUrl}/user/login`,
      headers: { Authorization: `Sign ${makeAuthorizationSign(body)}` },
      body,
      json: true,
    });
    this.apiKey = _get(response, 'user.apikey', '');
    this.at = _get(response, 'at', '');
    return response;
  }

  async getDevices() {
    const response = await this.makeRequest({
      uri: '/user/device',
      qs: { lang: 'en', getTags: 1 },
    });
    return response;
  }

  async getDevice(deviceId) {
    const response = await this.makeRequest({
      uri: `/user/device/${deviceId}`,
      qs: { lang: 'en', getTags: 1 },
    });
    return response;
  }

  async toggleDevice(deviceId) {
    const device = await this.getDevice(deviceId);
    const status = _get(device, 'params.switch', false);

    if (!status) {
      return { error: 'Device does not exist' };
    }

    const state = status === 'on' ? 'off' : 'on';

    const payloadLogin = wssLoginPayload({ at: this.at, apiKey: this.apiKey });
    const payloadUpdate = wssUpdatePayload({
      apiKey: this.apiKey,
      deviceId,
      params: { switch: state },
    });

    const wsp = new WebSocketAsPromised(this.apiWebSocket, {
      createWebSocket: url => new W3CWebSocket(url),
    });

    await wsp.open();
    await wsp.send(payloadLogin);
    await delay(1000);
    await wsp.send(payloadUpdate);
    await wsp.close();

    return { status: 'ok', state };
  }
}

module.exports = eWeLink;
