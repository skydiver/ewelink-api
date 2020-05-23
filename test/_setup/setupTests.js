const path = require('path');
const delay = require('delay');

const {
  startNockRecording,
  storeNockRecordings,
  playbackNockTapes,
} = require('./nock-helpers');

// Change to 'record' or 'play' to use nock on tests
// Set to false to run live against eWeLink servers
const nockAction = false;

// These files needs a cooldown delay between tests
const testsToDelay = [
  'env-node.spec.js',
  'env-serverless.spec.js',
  'invalid-credentials.spec.js',
  'power-usage.spec.js',
  'temperature-humidity.spec.js',
  'valid-credentials.spec.js',
];

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

global.beforeEach(async () => {
  if (nockAction === 'play') {
    return;
  }

  const { testPath } = global.jasmine;
  const testFile = path.basename(testPath);

  if (testsToDelay.includes(testFile)) {
    await delay(1000);
  }
});
