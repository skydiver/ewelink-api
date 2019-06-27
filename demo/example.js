const ewelink = require('../main');

(async () => {
  const conn = new ewelink({
    email: '<your ewelink email>',
    password: '<your ewelink password>',
  });

  /* get all devices */
  const devices = await conn.getDevices();
  console.log(devices);

  /* get specific devide info */
  const device = await conn.getDevice('<your device id>');
  console.log(device);

  /* toggle device */
  await conn.toggleDevice('<your device id>');
})();
