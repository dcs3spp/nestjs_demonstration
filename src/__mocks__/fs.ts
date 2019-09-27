// __mocks__/fs.ts
'use strict';

const fs = jest.genMockFromModule('fs');

const mappedFiles: Map<string, string> = new Map<string, string>();
function __setMockFiles(fileList: Map<string, string>): void {
  mappedFiles.clear();
  fileList.forEach((value: string, key: string) => {
    mappedFiles.set(key, value);
  });
}

// A custom version of `readFileSync` that looks up the file in map files
// and returns contents. If file is not in the map then an Error is thrown
const readFileSync = jest.fn(filename => {
  if (mappedFiles.has(filename)) {
    const item: string = mappedFiles.get(filename);
    return item;
  } else {
    throw new Error(`fs::readFileSync::mock does not recognise ${filename}`);
  }
});

(fs as any).__setMockFiles = __setMockFiles;
(fs as any).readFileSync = readFileSync;

module.exports = fs;
