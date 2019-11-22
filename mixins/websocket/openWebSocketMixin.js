const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');

const payloads = require('../../lib/payloads');

const openWebSocketMixin = {
  /**
   * Open a socket connection to eWeLink
   * and execute callback function with server message as argument
   *
   * @param callback
   * @param heartbeat
   * @returns {Promise<WebSocketAsPromised>}
   */
  async openWebSocket(callback, ...{ heartbeat = 120000 }) {
    const payloadLogin = payloads.wssLoginPayload({
      at: this.at,
      apiKey: this.apiKey,
    });

    const wsp = new WebSocketAsPromised(this.getApiWebSocket(), {
      createWebSocket: wss => new W3CWebSocket(wss),
    });

    wsp.onMessage.addListener(message => {
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
};

module.exports = openWebSocketMixin;
