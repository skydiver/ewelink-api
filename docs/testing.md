# Testing

## Run test suite
Copy `test/_setup/config/credentials.example.js` to `test/_setup/config/credentials.js` and update parameters with yours.

In a terminal, `npm run test` or `npm run coverage`.

Tests needs to be performed serially to prevent flooding eWeLink servers, so if run jest manually, add `--runInBand` parameter.

> All devices needs to be connected before running test suite.


## Using nock
Running tests can take some time because there is many requests to eWeLink servers.

To speedup this process, you need to enable nock "record & play" feature by opening `test/_setup/setupTests.js` and change `nockAction` to `record` or `play`.

The first time you need to record all your requests then you can keep testing by "playing" recorded data.

Recorded data will be stored on `test/_setup/tapes` and you can delete folder content anytime.

Set `nockAction` to `false` to disable all nock functionality.


## ZeroConf cache
While testing ZeroConf functionalty, two temporary files will be created: `test/_setup/cache/arp-table.json` and `test/_setup/cache devices-cache.json`. These files can be safely deleted once tests finished.