const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

class WebSocket {
  /**
   * Open WebSocket connection and send provided payloads
   *
   * @param url
   * @param payloads
   * @param delayTime
   *
   * @returns {Array}
   */
  static async WebSocketRequest(url, payloads, ...{ delayTime = 1000 }) {
    const wsp = new WebSocketAsPromised(url, {
      createWebSocket: wss => new W3CWebSocket(wss),
    });

    const responses = [];
    wsp.onMessage.addListener(message => responses.push(JSON.parse(message)));

    try {
      await wsp.open();

      for (const payload of payloads) {
        await wsp.send(payload);
        await delay(delayTime);
      }

      await wsp.close();
    } catch (e) {
      return this.customThrowError(e);
    }

    return responses;
  }

  /**
   * Parse WebSocket errors and return user friendly messages
   *
   * @param e
   *
   * @returns {{error: string}|{msg: string, error: number}}
   */
  static customThrowError(e) {
    const loginError = e.message.indexOf('WebSocket is not opened');
    if (loginError > -1) {
      return { error: 401, msg: 'Authentication error' };
    }
    return { error: 'An unknown error occurred' };
  }
}

module.exports = WebSocket;
