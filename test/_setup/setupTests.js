const path = require('path');

const {
  startNockRecording,
  storeNockRecordings,
  playbackNockTapes,
} = require('./nock-helpers');

// Change to 'record' or 'play' to use nock on tests
// Set to false to run live against eWeLink servers
const nockAction = false;

const getTapFilename = global => {
  const { testPath } = global.jasmine;
  const tapeFile = path.basename(testPath, '.js');
  return `./test/_setup/tapes/${tapeFile}.json`;
};

global.beforeAll(() => {
  if (nockAction === 'record') {
    startNockRecording();
  }

  if (nockAction === 'play') {
    const tapeFile = getTapFilename(global);
    playbackNockTapes(tapeFile);
  }
});

global.afterAll(() => {
  if (nockAction === 'record') {
    const tapeFile = getTapFilename(global);
    storeNockRecordings(tapeFile);
  }
});
