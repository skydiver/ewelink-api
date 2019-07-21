const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const WebSocketRequest = async (url, payloads, ...{ delayTime = 1000 }) => {
  const wsp = new WebSocketAsPromised(url, {
    createWebSocket: wss => new W3CWebSocket(wss),
  });

  await wsp.open();

  for (const [index, payload] of payloads.entries()) {
    await wsp.send(payload);

    const shouldWait = index + 1 < payloads.length;
    if (shouldWait) {
      await delay(delayTime);
    }
  }

  await wsp.close();
};

module.exports = WebSocketRequest;
