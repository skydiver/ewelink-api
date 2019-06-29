const ewelink = require('../main');

(async () => {
  /* first request: get access token and api key */
  const conn1 = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
  });
  const login = await conn1.login();
  const accessToken = login.at;

  /* second request: use access token to request devices */
  const conn2 = new ewelink({ at: accessToken });
  const devices = await conn2.getDevices();
  console.log(devices);

  /* third request: use access token to request specific device info */
  const conn3 = new ewelink({ at: accessToken });
  const device = await conn3.getDevice('<your device id>');
  console.log(device);

  /* fourth request: use access token to toggle specific device info */
  const conn4 = new ewelink({ at: accessToken });
  await conn4.toggleDevice('<your device id>');
})();
