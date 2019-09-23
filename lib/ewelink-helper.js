/* eslint-disable vars-on-top */
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const random = require('random');

const makeFakeIMEI = () => {
  const num1 = random.int(1000, 9999);
  const num2 = random.int(1000, 9999);
  return `DF7425A0-${num1}-${num2}-9F5E-3BC9179E48FB`;
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

const create16Uiid = () => {
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += random.int(0, 9);
  }
  return result;
};

const encryptionBase64 = t =>
  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(t));

const decryptionBase64 = t =>
  CryptoJS.enc.Base64.parse(t).toString(CryptoJS.enc.Utf8);

const encryptationData = (data, key) => {
  const encryptedMessage = {};

  const uid = create16Uiid();
  const iv = encryptionBase64(uid);
  const code = CryptoJS.AES.encrypt(data, CryptoJS.MD5(key), {
    iv: CryptoJS.enc.Utf8.parse(uid),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  encryptedMessage.uid = uid;
  encryptedMessage.iv = iv;
  encryptedMessage.data = code.ciphertext.toString(CryptoJS.enc.Base64);
  return encryptedMessage;
};

const decryptionData = (data, key, iv) => {
  const iv64 = decryptionBase64(iv);
  const code = CryptoJS.AES.decrypt(data, CryptoJS.MD5(key), {
    iv: CryptoJS.enc.Utf8.parse(iv64),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedMessage = code.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};

module.exports = {
  makeAuthorizationSign,
  makeFakeIMEI,
  getDeviceChannelCount,
  encryptationData,
  decryptionData,
};
