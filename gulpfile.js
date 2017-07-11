const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const fs = require('fs');
const gzip = require('gulp-gzip');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const buble = require('gulp-buble');
const through = require('through2');
const uglifyES = require('uglify-es');
const depcheck = require('gulp-depcheck');
const KarmaServer = require('karma').Server;
const runSequence = require('run-sequence');
const composerUglify = require('gulp-uglify/composer');

const minifyES = composerUglify(uglifyES, console);

const isWin = /^win/.test(process.platform);

const pkg = require(path.join(__dirname, './package.json'));

const reNotCore = /@NOT_CORE_BEGIN@(\r|\n|.)*(?!@NOT_CORE_END@).*@NOT_CORE_END@/gm;

const minifyOptions = {
  warnings: true,
  compress: {
    collapse_vars: true,
    unsafe: true,
    negate_iife: false,
    warnings: true,
  },
  output: {
    ascii_only: true,
    comments: /@license/gm,
    max_line_len: 32000,
  },
};

const iife = () => replace('*/\n(', '*/\n;(');

function sizeCompare(fileName) {
  return through.obj((chunk, enc, cb) => {
    fs.appendFileSync(
      fileName,
      `.concat(${JSON.stringify({
        time: new Date().toLocaleString('ua-UK', { timeZone: 'Europe/Kiev' }),
        size: chunk._contents.length,
        timestamp: Date.now(),
        file: chunk.history[1],
      })})\n`
    );
    console.log(`${chunk.history[1].split('/').slice(-1)[0]} -> ${chunk._contents.length} bytes`);
    return cb(null, chunk);
  });
}

gulp.task('es5', () => {
  return (
    gulp
      .src('src/*.js')
      .pipe(replace(/\$VERSION\$/gm, pkg.version))
      .pipe(replace(/\$VERSION_COUNT\$/gm, pkg.versionsList.length))
      .pipe(iife())
      .pipe(sourcemaps.init())
      .pipe(
        babel({
          plugins: [
            'check-es2015-constants',
            'transform-es2015-arrow-functions',
            'transform-es2015-block-scoped-functions',
            'transform-es2015-block-scoping',
            // Firefox need es5 class, increse speed x3 for FF
            // use buble for classes
            // 'transform-es2015-classes',
            'transform-es2015-computed-properties',
            'transform-es2015-destructuring',
            'transform-es2015-duplicate-keys',
            'transform-es2015-for-of',
            'transform-es2015-function-name',
            'transform-es2015-literals',
            // modules are build in script
            'transform-es2015-object-super',
            'transform-es2015-parameters',
            'transform-es2015-shorthand-properties',
            'transform-es2015-spread',
            'transform-es2015-sticky-regex',
            'transform-es2015-template-literals',
            // typeof-symbol add unneessary _typeof() func
            // works slow and contain some space
            // 'transform-es2015-typeof-symbol',
            'transform-es2015-unicode-regex',
            'transform-regenerator',
          ],
        })
      )
      .pipe(buble()) // used for classes
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'))
  );
});

gulp.task('core-es5', ['es5'], () =>
  gulp
    .src(['dist/interf.js'])
    .pipe(replace(reNotCore, 'Here was full version code'))
    .pipe(rename({ suffix: '-core' }))
    .pipe(gulp.dest('dist'))
);

gulp.task('compress-es5', ['core-es5'], () =>
  gulp
    .src(['dist/interf.js', 'dist/interf-core.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify(minifyOptions))
    .pipe(rename({ suffix: '.min' }))
    .pipe(iife())
    .pipe(sizeCompare('test/size/min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
);

gulp.task('default', ['compress-es5'], () => {});

// dev block ------------------------------------------------------------------

gulp.task('es', () =>
  gulp
    .src('src/interf.js')
    .pipe(replace(/\$VERSION\$/gm, pkg.version))
    .pipe(replace(/\$VERSION_COUNT\$/gm, pkg.versionsList.length))
    .pipe(replace("'use strict';", ''))
    .pipe(iife())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        plugins: [
          // trailingComma es2015 are slow
          'transform-es2015-parameters',
        ],
      })
    )
    .pipe(rename({ suffix: '-es' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('test/tmp/es'))
);

gulp.task('core-es', ['es'], () =>
  gulp
    .src(['test/tmp/es/interf-es.js'])
    .pipe(replace(reNotCore, 'Here was full version code'))
    .pipe(rename({ suffix: '-core' }))
    .pipe(gulp.dest('test/tmp/es'))
);

gulp.task('compress-es', ['core-es'], () =>
  gulp
    .src(['test/tmp/es/interf-es.js', 'test/tmp/es/interf-es-core.js'])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(minifyES(minifyOptions))
    .pipe(iife())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sizeCompare('test/size/es.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('test/tmp/es'))
);

gulp.task('dev-size', ['build-test'], () =>
  gulp
    .src(['dist/*.min.js', 'test/tmp/es/*.min.js'])
    .pipe(gzip({ append: true }))
    .pipe(sizeCompare('test/size/gz.js'))
    .pipe(gulp.dest('test/tmp/zip'))
);

gulp.task(
  'dev-depcheck',
  depcheck({
    ignoreDirs: ['protected'],
  })
);

gulp.task('build-test', ['compress-es5', 'compress-es'], () => {});

const testFilesSuffixES = ['-es-core', '-es-core.min', '-es', '-es.min'];
const testFilesSuffix = ['-core', '-core.min', '.min', ''];
const testFilesInterfsES = testFilesSuffixES.map(suffix => `test/tmp/es/interf${suffix}.js`);
const testFilesInterfs = testFilesSuffix.map(suffix => `dist/interf${suffix}.js`);

const testsFiles = [
  'test/main/test.js',
  'test/main/utils.js',
  'test/main/create.js',
  'test/main/implement.js',
  'test/main/remove.js',
  'test/main/empty.js',
  'test/main/in.js',
  'test/main/descriptor.js',
  'test/main/debug.js',
  'test/main/mix.js',
  'test/karma-define.js',
];

const testModules = ['AMD', 'CJS', 'CJS2', 'global'];

function moduleFiles(type) {
  const filePath = `dist/interf.js`;
  if (type === 'AMD') {
    return [
      'node_modules/requirejs/require.js',
      { pattern: filePath, included: false },
      'test/module-AMD.js',
    ];
  } else if (type === 'CJS' && !isWin) {
    return [
      'node_modules/require1k/require1k.js',
      { pattern: filePath, included: false },
      'test/module-CJS.js',
    ];
  } else if (type === 'CJS2') {
    return ['test/module-CJS2-exports.js', filePath, 'test/module-CJS2.js'];
  }

  return [filePath, 'test/module-global.js'];
}

gulp.task('dev-karma', done => {
  new KarmaServer(
    {
      configFile: path.join(__dirname, './karma.conf.js'),
      files: testsFiles.concat(testFilesInterfs, ['test/karma-exec.js']),
      // files: moduleFiles('CJS'),
      browsers: ['Firefox'],
      singleRun: false,
      client: {
        captureConsole: true,
      },
    },
    done
  ).start();
});

gulp.task(`test-karma-es5`, done => {
  try {
    new KarmaServer(
      {
        configFile: path.join(__dirname, './karma.conf.js'),
        files: testsFiles.concat(testFilesInterfs, ['test/karma-exec.js']),
        browsers: isWin
          ? [
              'Chrome',
              'ChromeCanary',
              'Firefox',
              'Safari',
              // 'Opera',
              // 'Edge',
              'IE',
              'IE10',
              'IE9',
              // 'IE8',
              'PhantomJS',
            ]
          : ['Chromium', 'Firefox', 'Opera', 'PhantomJS'],
      },
      done
    ).start();
  } catch (e) {
    console.error(e.message);
  }
});

gulp.task(`test-karma-es`, done => {
  try {
    new KarmaServer(
      {
        configFile: path.join(__dirname, './karma.conf.js'),
        files: testsFiles.concat(testFilesInterfsES, ['test/karma-exec.js']),
        browsers: isWin
          ? [
              'Chrome',
              'ChromeCanary',
              'Firefox',
              // 'Safari',
              // 'Opera',
              // 'Edge',
            ]
          : ['Chromium', 'Firefox', 'Opera'],
      },
      done
    ).start();
  } catch (e) {
    console.error(e.message);
  }
});

testModules.forEach(type => {
  gulp.task(`test-karma-interf${type}`, done => {
    try {
      new KarmaServer(
        {
          configFile: path.join(__dirname, './karma.conf.js'),
          files: moduleFiles(type),
          browsers: isWin
            ? [
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'Safari',
                // 'Opera',
                'IE',
                'IE10',
                'IE9',
                // 'IE8',
                // 'Edge',
                'PhantomJS',
              ]
            : ['Chromium', 'Firefox', 'Opera', 'PhantomJS'],
        },
        done
      ).start();
    } catch (e) {
      console.error(e.message);
    }
  });
});

gulp.task('test-karma', ['build-test'], callback => {
  runSequence(
    ...testModules.map(val => `test-karma-interf${val}`),
    'test-karma-es',
    'test-karma-es5',
    callback
  );
});

gulp.task(`test`, ['test-karma'], () => {});
