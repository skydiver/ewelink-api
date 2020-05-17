const credentialsExpectations = {
  at: expect.any(String),
  user: { email: expect.any(String) },
  region: expect.any(String),
};

const allDevicesExpectations = {
  name: expect.any(String),
  deviceid: expect.any(String),
  apikey: expect.any(String),
  params: expect.any(Object),
  showBrand: expect.any(Boolean),
  extra: {
    extra: {
      model: expect.any(String),
    },
  },
};

const specificDeviceExpectations = {
  name: expect.any(String),
  deviceid: expect.any(String),
  apikey: expect.any(String),
  online: expect.any(Boolean),
  extra: {
    extra: {
      model: expect.any(String),
    },
  },
};

const rawPowerUsageExpectations = {
  status: 'ok',
  data: {
    hundredDaysKwhData: expect.any(String),
  },
};

const currentMonthPowerUsageExpectations = {
  status: 'ok',
  monthly: expect.any(Number),
  daily: expect.any(Array),
};

const firmwareExpectations = {
  status: expect.any(String),
  deviceId: expect.any(String),
  msg: expect.any(String),
};

const regionExpectations = {
  email: expect.any(String),
  region: expect.any(String),
};

module.exports = {
  credentialsExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
  rawPowerUsageExpectations,
  currentMonthPowerUsageExpectations,
  firmwareExpectations,
  regionExpectations,
};
