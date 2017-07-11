module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    // autoWatch: true,
    concurrency: 1,
    singleRun: true,
    client: {
      captureConsole: false,
    },
    browsers: [
      // see gulpfile
    ],
    customLaunchers: {
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10',
      },
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9',
      },
      IE8: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE8',
      },
    },
    plugins: [
      'karma-qunit',
      'karma-babel-preprocessor',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-opera-launcher',
      'karma-ie-launcher',
      'karma-edge-launcher',
      'karma-phantomjs-launcher', // phantomjs dont support ES2015 until version 2.5
    ],
    files: [
      // see gulpfile
    ],
    proxies: {
      '/dist/': '/base/dist/',
      '/test/': '/base/test/',
      '/node_modules/': '/base/node_modules/',
    },
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/!(karma-*|module-*|interf-es*).js': ['babel'],
      'dist/**/*.js': ['coverage'],
      'test/tmp/es/**/*.js': ['coverage'],
    },
    babelPreprocessor: {
      options: {
        presets: [['es2015', { modules: 'umd' }]],
        sourceMap: false,
      },
      filename: file => file.originalPath.replace(/\.js$/, '.js'),
      sourceFileName: file => file.originalPath,
    },
    coverageReporter: {
      type: 'lcov',
      // include: ['dist/es5/**/*.js', 'test/tmp/es/**/*.js'],
      dir: 'test/coverage/',
    },
  });
};
