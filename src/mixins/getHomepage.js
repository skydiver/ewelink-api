const { _get } = require('../helpers/utilities');
const errors = require('../data/errors');

module.exports = {
  /**
   * Get "homepage", which includes information about all scenes and registered devices 
   *
   * @returns {Promise<{msg: string, error: number}|*>}
   */
  async getHomepage() {

    const response = await this.makeRequest({
      method: "post",
      uri: `/v2/homepage`,
      body: {
        getFamily: {},
        getThing: {},
      },
    });

    const error = _get(response, 'error', false);
    const familyInfo = _get(response, 'familyInfo', false);
    const thingInfo = _get(response, 'thingInfo', false);

    if (error) {
      throw new Error(`[${error}] ${errors[error]}`);
    }

    if (!familyInfo || !thingInfo) {
      throw new Error(`${errors.noDevices}`);
    }

    return { familyInfo, thingInfo };
  },
};
