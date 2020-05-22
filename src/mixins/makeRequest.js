const fetch = require('node-fetch');
const { _get, toQueryString } = require('../helpers/utilities');
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
    const { at } = this;

    if (!at) {
      await this.getCredentials();
    }

    let apiUrl = this.getApiUrl();

    if (url) {
      apiUrl = url;
    }

    const payload = {
      method,
      headers: { Authorization: `Bearer ${this.at}` },
    };

    if (Object.entries(body).length > 0) {
      payload.body = JSON.stringify(body);
    }

    const queryString = toQueryString(qs);
    const requestUrl = `${apiUrl}${uri}${queryString}`;

    const responseRequest = await fetch(requestUrl, payload);
    const response = await responseRequest.json();

    const error = _get(response, 'error', false);

    if (error) {
      return { error, msg: errors[error] };
    }

    return response;
  },
};
