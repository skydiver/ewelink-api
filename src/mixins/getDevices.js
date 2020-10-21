const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get all devices information
   *
   * @returns {Promise<{msg: string, error: number}|*>}
   */
  async getDevices() {
    const response = await this.makeRequest({
      uri: `/v2/device/thing/`,
    });

    const error = _get(response, 'error', false);
    const thingList = _get(response, 'thingList', false);

    if (error) {
      return { error, msg: errors[error] };
    }

    if (!thingList) {
      throw new Error(`${errors.noDevices}`);
    }

    return thingList.map((thing) => thing.itemData);
  },
};
