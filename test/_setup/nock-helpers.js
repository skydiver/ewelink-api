const nock = require('nock');
const { writeFile } = require('fs');

exports.startNockRecording = () => {
  nock.recorder.rec({
    dont_print: true,
    enable_reqheaders_recording: false,
    output_objects: true,
  });
};

exports.storeNockRecordings = pathToTape => {
  const nockCallObjects = nock.recorder.play();
  writeFile(pathToTape, JSON.stringify(nockCallObjects, null, 2), () => {});
};

exports.playbackNockTapes = pathToTape => {
  const nocks = nock.load(pathToTape);

  nocks.forEach(function(n) {
    n.filteringPath(path => filteringPath(n, path));
    n.filteringRequestBody((b, rb) => filteringRequestBody(b, rb));
  });

  nock.recorder.play();
};

/**
 * Replace dynamic values on request body using recorded data
 */
const filteringRequestBody = (body, recordedBody) => {
  if (typeof body !== 'string' || typeof recordedBody !== 'object') {
    return body;
  }
  const jsonBody = JSON.parse(body);
  jsonBody.ts = recordedBody.ts;
  jsonBody.nonce = recordedBody.nonce;
  return JSON.stringify(jsonBody);
};

/**
 * Replace dynamic values on request URLs using recorded data
 */
const filteringPath = (n, path) => {
  const regexTimestampInPath = /(?<=ts=)[^&]*/g;
  const timestampInPath = path.match(regexTimestampInPath);

  if (!timestampInPath) {
    return path;
  }

  const regexTimestampInRecordedPath = /ts=[^&]*/g;
  const recordedPath = n.interceptors[0].uri;
  const timestampInRecordedPath = recordedPath.match(regexTimestampInPath);
  const updatedPath = recordedPath.replace(
    regexTimestampInRecordedPath,
    `ts=${timestampInRecordedPath[0]}`
  );

  return updatedPath;
};
