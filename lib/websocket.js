const W3CWebSocket = require('websocket').w3cwebsocket;
const WebSocketAsPromised = require('websocket-as-promised');
const delay = require('delay');

const WebSocketRequest = async (url, payloads, ...{ delayTime = 1000 }) => {
  const wsp = new WebSocketAsPromised(url, {
    createWebSocket: wss => new W3CWebSocket(wss),
  });

  const responses = [];
  wsp.onMessage.addListener(message => responses.push(message));

  await wsp.open();

  for (const payload of payloads) {
    await wsp.send(payload);
    await delay(delayTime);
  }

  await wsp.close();

  return responses;
};

module.exports = WebSocketRequest;
