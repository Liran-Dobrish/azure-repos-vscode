const inputFolder = "./src/assets/";
const outputFolder = "./dist";
const copyfiles = require("copyfiles");

copyfiles(["./src/credentialstore/bin/win32/creds.exe", './out/credentialstore/bin/win32/'], {
  "up": 4
}, (err) => {
  if (err) {
    console.log("Error occurred while copying file cred.exe", err);
  }
  console.log('creds.exe was copied to [./out/credentialstore/bin/win32]');
});

copyfiles(['./src/tests/unit-tests/contexts/testrepos/**/*.*', './out/tests/unit-tests/contexts/testrepos/'], {
  "up": 5
}, (err) => {
  if (err) {
    console.log("Error occurred while copying Directory testrepos", err);
  }
  console.log('contexts testrepo was copied to [./out/tests/unit-tests/contexts]');
});