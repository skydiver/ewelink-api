const fetch = require('node-fetch');

const { _get } = require('../helpers/utilities');
const credentialsPayload = require('../payloads/credentialsPayload');
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
      phoneNumber: this.phoneNumber,
      password: this.password,
    });

    let responseRequest = await fetch(`${this.getApiUrl()}/user/login`, {
      method: 'post',
      headers: { Authorization: `Sign ${makeAuthorizationSign(body)}` },
      body: JSON.stringify(body),
    });

    const response = await responseRequest.json();

    const error = _get(response, 'error', false);
    const region = _get(response, 'region', false);

    if (error && [400, 401, 404].indexOf(parseInt(error)) !== -1) {
      return { error: 406, msg: errors['406'] };
    }

    if (error && parseInt(error) === 301 && region) {
      if (this.region !== region) {
        this.region = region;
        responseRequest = await this.getCredentials();
        return responseRequest.json();
      }
      return { error, msg: 'Region does not exist' };
    }

    this.apiKey = _get(response, 'user.apikey', '');
    this.at = _get(response, 'at', '');
    return response;
  },
};
