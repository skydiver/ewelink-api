const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  async getRegion() {
    const credentials = await this.getCredentials();

    const error = _get(credentials, 'error', false);

    if (error) {
      throw new Error(`[${error}] ${errors[error]}`);
    }

    return {
      email: credentials.user.email,
      region: credentials.region,
    };
  },
};
