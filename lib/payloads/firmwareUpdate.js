const { _get } = require('../helpers');
const errors = require('../errors');

const firmwareUpdate = devicesList =>
  devicesList.map(device => {
    const model = _get(device, 'extra.extra.model', false);
    const fwVersion = _get(device, 'params.fwVersion', false);

    if (!model || !fwVersion) {
      return { error: 500, msg: errors.noFirmware };
    }

    return { model, version: fwVersion, deviceid: device.deviceid };
  });

module.exports = firmwareUpdate;
