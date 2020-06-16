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

module.exports = {
  STATE_ON,
  STATE_OFF,
  STATE_TOGGLE,
  VALID_POWER_STATES,
  getNewPowerState,
};
