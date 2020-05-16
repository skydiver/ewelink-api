const errors = {
  401: 'Wrong account or password',
  402: 'Email inactivated',
  403: 'Forbidden',
  404: 'Device does not exist',
  406: 'Authentication failed',
};

const customErrors = {
  ch404: 'Device channel does not exist',
  unknown: 'An unknown error occurred',
};

module.exports = Object.assign(errors, customErrors);
