const STATE_ON = 'on';
const STATE_OFF = 'off';
const STATE_TOGGLE = 'toggle';

const VALID_POWER_STATES = [STATE_ON, STATE_OFF, STATE_TOGGLE];

/**
 * Return new device state based on current conditions
 */
const getNewPowerState = (currentState, newState) => {
  if (newState !== STATE_TOGGLE) {
    return newState;
  }
  return currentState === STATE_ON ? STATE_OFF : STATE_ON;
};

/**
 * Get current device parameters and
 */
const getPowerStateParams = (params, newState, channel) => {
  if (params.switches) {
    const switches = [...params.switches];
    const channelToSwitch = channel - 1;
    switches[channelToSwitch].switch = newState;
    return { switches };
  }
  return { switch: newState };
};

module.exports = {
  STATE_ON,
  STATE_OFF,
  STATE_TOGGLE,
  VALID_POWER_STATES,
  getNewPowerState,
  getPowerStateParams,
};
