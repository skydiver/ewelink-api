const errors = {
  401: 'Wrong account or password',
  402: 'Email inactivated',
  404: 'Device does not exist',
  406: 'Authentication failed',
};

const customErrors = {
  ch404: 'Device channel does not exist',
};

module.exports = Object.assign(errors, customErrors);
