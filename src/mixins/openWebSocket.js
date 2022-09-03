const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');

const wssLoginPayload = require('../payloads/wssLoginPayload');

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
    const payloadLogin = wssLoginPayload({
      at: this.at,
      apiKey: this.apiKey,
      appid: this.APP_ID,
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
      try {
        await wsp.send('ping');
      } catch (error) {
        console.error(`openWebSocket.js: ${error}`);
        console.log(`openWebSocket.js: Reconnecting...`);
        const auth = await this.getCredentials();
        const payloadLogin = wssLoginPayload({
          at: auth.at,
          apiKey: auth.user.apikey,
          appid: this.APP_ID,
        });
        await wsp.open();
        await wsp.send(payloadLogin);
      }
    }, heartbeat);

    return wsp;
  },
};
