const { _get } = require('../../lib/helpers');
const errors = require('../../lib/errors');

const getRegionMixin = {
  async getRegion() {
    if (!this.email || !this.password) {
      return { error: 406, msg: errors.invalidAuth };
    }

    const credentials = await this.getCredentials();

    const error = _get(credentials, 'error', false);

    if (error) {
      return credentials;
    }

    return {
      email: credentials.user.email,
      region: credentials.region,
    };
  },
};

module.exports = getRegionMixin;
