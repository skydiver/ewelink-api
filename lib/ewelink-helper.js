const crypto = require('crypto');
const random = require('random');
const nonce = require('nonce')();

const makeFakeIMEI = () => {
  const num1 = random.int(1000, 9999);
  const num2 = random.int(1000, 9999);
  return `DF7425A0-${num1}-${num2}-9F5E-3BC9179E48FB`;
};

const loginPayload = ({ email, password }) => ({
  email,
  password,
  version: 6,
  ts: `${Math.round(new Date().getTime() / 1000)}`,
  nonce: `${nonce()}`,
  appid: 'oeVkj2lYFGnJu5XUtWisfW4utiN4u9Mq',
  imei: makeFakeIMEI(),
  os: 'iOS',
  model: 'iPhone10,6',
  romVersion: '11.1.2',
  appVersion: '3.5.3',
});

const wssLoginPayload = ({ at, apiKey }) => {
  const timeStamp = new Date() / 1000;
  const ts = Math.floor(timeStamp);
  const sequence = Math.floor(timeStamp * 1000);
  const payload = {
    action: 'userOnline',
    userAgent: 'app',
    version: 6,
    nonce: `${nonce()}`,
    apkVesrion: '1.8',
    os: 'ios',
    at,
    apikey: apiKey,
    ts: `${ts}`,
    model: 'iPhone10,6',
    romVersion: '11.1.2',
    sequence,
  };
  return JSON.stringify(payload);
};

const wssUpdatePayload = ({ apiKey, deviceId, params }) => {
  const timeStamp = new Date() / 1000;
  const sequence = Math.floor(timeStamp * 1000);
  const payload = {
    action: 'update',
    userAgent: 'app',
    apikey: apiKey,
    deviceid: `${deviceId}`,
    params,
    sequence,
  };
  return JSON.stringify(payload);
};

const makeAuthorizationSign = body =>
  crypto
    .createHmac('sha256', '6Nz4n0xA8s8qdxQf2GqurZj2Fs55FUvM')
    .update(JSON.stringify(body))
    .digest('base64');

const getDeviceTypeByUiid = uiid => {
  const MAPPING = {
    1: 'SOCKET',
    2: 'SOCKET_2',
    3: 'SOCKET_3',
    4: 'SOCKET_4',
    5: 'SOCKET_POWER',
    6: 'SWITCH',
    7: 'SWITCH_2',
    8: 'SWITCH_3',
    9: 'SWITCH_4',
    10: 'OSPF',
    11: 'CURTAIN',
    12: 'EW-RE',
    13: 'FIREPLACE',
    14: 'SWITCH_CHANGE',
    15: 'THERMOSTAT',
    16: 'COLD_WARM_LED',
    17: 'THREE_GEAR_FAN',
    18: 'SENSORS_CENTER',
    19: 'HUMIDIFIER',
    22: 'RGB_BALL_LIGHT',
    23: 'NEST_THERMOSTAT',
    24: 'GSM_SOCKET',
    25: 'AROMATHERAPY',
    26: 'BJ_THERMOSTAT',
    27: 'GSM_UNLIMIT_SOCKET',
    28: 'RF_BRIDGE',
    29: 'GSM_SOCKET_2',
    30: 'GSM_SOCKET_3',
    31: 'GSM_SOCKET_4',
    32: 'POWER_DETECTION_SOCKET',
    33: 'LIGHT_BELT',
    34: 'FAN_LIGHT',
    35: 'EZVIZ_CAMERA',
    36: 'SINGLE_CHANNEL_DIMMER_SWITCH',
    38: 'HOME_KIT_BRIDGE',
    40: 'FUJIN_OPS',
    41: 'CUN_YOU_DOOR',
    42: 'SMART_BEDSIDE_AND_NEW_RGB_BALL_LIGHT',
    43: '',
    44: '',
    45: 'DOWN_CEILING_LIGHT',
    46: 'AIR_CLEANER',
    49: 'MACHINE_BED',
    51: 'COLD_WARM_DESK_LIGHT',
    52: 'DOUBLE_COLOR_DEMO_LIGHT',
    53: 'ELECTRIC_FAN_WITH_LAMP',
    55: 'SWEEPING_ROBOT',
    56: 'RGB_BALL_LIGHT_4',
    57: 'MONOCHROMATIC_BALL_LIGHT',
    59: 'MEARICAMERA',
    1001: 'BLADELESS_FAN',
    1002: 'NEW_HUMIDIFIER',
    1003: 'WARM_AIR_BLOWER',
  };
  return MAPPING[uiid] || '';
};

const getDeviceChannelCountByType = deviceType => {
  const DEVICE_CHANNEL_LENGTH = {
    SOCKET: 1,
    SWITCH_CHANGE: 1,
    GSM_UNLIMIT_SOCKET: 1,
    SWITCH: 1,
    THERMOSTAT: 1,
    SOCKET_POWER: 1,
    GSM_SOCKET: 1,
    POWER_DETECTION_SOCKET: 1,
    SOCKET_2: 2,
    GSM_SOCKET_2: 2,
    SWITCH_2: 2,
    SOCKET_3: 3,
    GSM_SOCKET_3: 3,
    SWITCH_3: 3,
    SOCKET_4: 4,
    GSM_SOCKET_4: 4,
    SWITCH_4: 4,
    CUN_YOU_DOOR: 4,
  };
  return DEVICE_CHANNEL_LENGTH[deviceType] || 0;
};

const getDeviceChannelCount = deviceUUID => {
  const deviceType = getDeviceTypeByUiid(deviceUUID);
  return getDeviceChannelCountByType(deviceType);
};

module.exports = {
  makeAuthorizationSign,
  loginPayload,
  wssLoginPayload,
  wssUpdatePayload,
  getDeviceChannelCount,
};
