var testrunner = require('qunit');

testrunner.setup({
  log: {
    // log assertions overview
    assertions: false,

    // log expected and actual values for failed tests
    errors: false,

    // log tests overview
    tests: false,

    // log summary
    summary: true,

    // log global summary (all files)
    globalSummary: true,

    // log coverage
    coverage: true,

    // log global coverage (all files)
    globalCoverage: true,

    // log currently testing code file
    testing: false,
  },
  coverage: {
    dir: './test/coverage/node',
    reporters: ['lcov', 'json', 'html'],
  },
});

testrunner.run(
  {
    code: './dist/interf.js',
    tests: './test/test.js',
  },
  function(err, report) {
    // console.log(err);
    // console.log(report);
  }
);
