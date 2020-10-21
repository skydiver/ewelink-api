const fetch = require('node-fetch');
const { _get, _empty, toQueryString } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Helper to make api requests
   *
   * @param method
   * @param url
   * @param uri
   * @param body
   * @param qs
   * @returns {Promise<{msg: *, error: *}|*>}
   */
  async makeRequest({ method = 'get', url, uri, body = {}, qs = {} }) {
    const { at, APP_ID } = this;

    if (!at) {
      await this.getCredentials();
    }

    let apiUrl = this.getApiUrl();

    if (url) {
      apiUrl = url;
    }

    const payload = {
      method,
      headers: {
        Authorization: `Bearer ${this.at}`,
        'Content-Type': 'application/json',
        'X-CK-Appid': APP_ID,
      },
    };

    if (!_empty(body)) {
      payload.body = JSON.stringify(body);
    }

    const queryString = !_empty(qs) ? toQueryString(qs) : '';
    const requestUrl = `${apiUrl}${uri}${queryString}`;

    const request = await fetch(requestUrl, payload);

    /** Catch request status code other than 200 */
    if (!request.ok) {
      throw new Error(`[${request.status}] ${errors[request.status]}`);
    }

    /** Parse API response */
    const response = await request.json();

    /** Catch errors with status code 200 */
    const error = _get(response, 'error', false);

    /** Throw error if needed */
    if (error) {
      throw new Error(`[${error}] ${response.msg}`);
    }

    /** Return response data */
    return response.data;
  },
};
