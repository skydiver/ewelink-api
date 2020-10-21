const fetch = require('node-fetch');

const { _get } = require('../helpers/utilities');
const { makeAuthorizationSign } = require('../helpers/ewelink');

module.exports = {
  /**
   * Returns user credentials information
   */
  async getCredentials() {
    const { APP_ID, APP_SECRET } = this;

    const body = {
      countryCode: '+1',
      email: this.email,
      password: this.password,
    };

    if (this.phoneNumber) {
      body.phoneNumber = this.phoneNumber;
    }

    const request = await fetch(`${this.getApiUrl()}/v2/user/login`, {
      method: 'post',
      headers: {
        Authorization: `Sign ${makeAuthorizationSign(APP_SECRET, body)}`,
        'Content-Type': 'application/json',
        'X-CK-Appid': APP_ID,
      },
      body: JSON.stringify(body),
    });

    const response = await request.json();

    const error = _get(response, 'error', false);

    if (error) {
      throw new Error(`Error ${error}: ${response.msg}`);
    }
    this.apiKey = _get(response, 'data.user.apikey', '');
    this.at = _get(response, 'data.at', '');

    return response;
  },
};
