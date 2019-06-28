const loginExpectations = {
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
  uiid: expect.any(Number),
};

const specificDeviceExpectations = {
  apikey: expect.any(String),
  deviceid: expect.any(String),
  name: expect.any(String),
  online: expect.any(Boolean),
  uiid: expect.any(Number),
};

module.exports = {
  loginExpectations,
  allDevicesExpectations,
  specificDeviceExpectations,
};
