const rp = require('request-promise');

const { _get } = require('../helpers/utilities');
const { credentialsPayload } = require('../../lib/payloads');
const { makeAuthorizationSign } = require('../helpers/ewelink');
const errors = require('../data/errors');

module.exports = {
  /**
   * Returns user credentials information
   *
   * @returns {Promise<{msg: string, error: *}>}
   */
  async getCredentials() {
    const body = credentialsPayload({
      email: this.email,
      password: this.password,
    });

    let response = await rp({
      method: 'POST',
      uri: `${this.getApiUrl()}/user/login`,
      headers: { Authorization: `Sign ${makeAuthorizationSign(body)}` },
      body,
      json: true,
    });

    const error = _get(response, 'error', false);
    const region = _get(response, 'region', false);

    if (error && [400, 401, 404].indexOf(parseInt(error)) !== -1) {
      return { error: 406, msg: errors['406'] };
    }

    if (error && parseInt(error) === 301 && region) {
      if (this.region !== region) {
        this.region = region;
        response = await this.getCredentials();
        return response;
      }
      return { error, msg: 'Region does not exist' };
    }

    this.apiKey = _get(response, 'user.apikey', '');
    this.at = _get(response, 'at', '');
    return response;
  },
};
