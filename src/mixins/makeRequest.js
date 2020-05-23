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
      headers: {
        Authorization: `Bearer ${this.at}`,
        'Content-Type': 'application/json',
      },
    };

    if (!_empty(body)) {
      payload.body = JSON.stringify(body);
    }

    const queryString = !_empty(qs) ? toQueryString(qs) : '';
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
