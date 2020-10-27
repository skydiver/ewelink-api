const fetch = require('node-fetch');
const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');

const wssLoginPayload = require('../payloads/wssLoginPayload');
const errors = require('../data/errors');

module.exports = {
  /**
   * Open a socket connection to eWeLink
   * and execute callback function with server message as argument
   *
   * @param callback
   * @param heartbeat
   * @returns {Promise<WebSocketAsPromised>}
   */
  async openWebSocket(callback, ...{ heartbeat = 120000 }) {
    const dispatch = await this.getWebSocketServer();
    const WSS_URL = `wss://${dispatch.domain}:${dispatch.port}/api/ws`;

    const payloadLogin = wssLoginPayload({
      at: this.at,
      apiKey: this.apiKey,
      appid: this.APP_ID,
    });

    const wsp = new WebSocketAsPromised(WSS_URL, {
      createWebSocket: (wss) => new W3CWebSocket(wss),
    });

    wsp.onMessage.addListener((message) => {
      try {
        const data = JSON.parse(message);
        callback(data);
      } catch (error) {
        callback(message);
      }
    });

    await wsp.open();
    await wsp.send(payloadLogin);

    setInterval(async () => {
      await wsp.send('ping');
    }, heartbeat);

    return wsp;
  },

  async getWebSocketServer() {
    const requestUrl = this.getDispatchServiceUrl();
    const request = await fetch(`${requestUrl}/dispatch/app`);

    if (!request.ok) {
      throw new Error(`[${request.status}] ${errors[request.status]}`);
    }

    return request.json();
  },
};
