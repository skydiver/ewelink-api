// Fix from: https://github.com/skydiver/ewelink-api/issues/65

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
      if (message === 'pong') {
        // eat pong...
        callback({ action: 'socket', message: 'pong' });
      } else {
        try {
          const data = JSON.parse(message);
          callback(data);
        } catch (error) {
          callback(message);
        }
      }
    });

    wsp.onOpen.addListener(() => {
      callback({ action: 'socket', message: 'opened' });
    });
    wsp.onClose.addListener(() => {
      callback({ action: 'socket', message: 'closed' });
    });
    wsp.onError.addListener(() => {
      callback({ action: 'socket', message: 'error' });
    });
    await wsp.open();
    await wsp.send(payloadLogin);

    setInterval(async () => {
      if (wsp.isClosed || wsp.isClosing) {
        console.log(new Date().toISOString(), 'wsp.isClosed || wsp.isClosing');
        callback({ action: 'socket', message: 'closed' });
      }
      console.log(new Date().toISOString(), 'ping sent...');
      wsp.send('ping'); // await
    }, heartbeat);
    return wsp;
  },
};
