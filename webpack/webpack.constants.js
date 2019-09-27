const path = require('path');

const buildDir = path.resolve(__dirname, '../dist');
const srcDir = path.resolve(__dirname, '../src');

const constants = {
  dir: {
    BUILD: buildDir,
    SRC: srcDir,
  },
};

module.exports = constants;
