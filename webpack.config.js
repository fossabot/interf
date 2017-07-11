const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const pkg = require(path.join(__dirname, './package.json'));

module.exports = function(env) {
  if (env === undefined) env = 'dev';

  return {
    devtool: env === 'dev' ? 'inline-source-map' : 'cheap-module-source-map',

    entry: {
      test: './test/test.js',
      main: './test/main.js',
    },
    output: {
      path: path.join(__dirname, ''),
      publicPath: '/',
      filename: 'build/[name].js',
      sourceMapFilename: '[file].map',
    },
    devServer: {
      inline: true,
      //hot: true,
      https: true,
      overlay: true,
      watchContentBase: false,
      // historyApiFallback: {
      //   rewrites: [
      //     // { from: /^\/$/, to: '/views/landing.html' },
      //     { from: /^\/test/, to: '/test.html' },
      //     // { from: /./, to: '/views/404.html' }
      //   ]
      // },
      // performance fixing
      watchOptions: {
        aggregateTimeout: 300, // <---------
        poll: 350, // <---------
        ignored: /node_modules/,
      },
    },
    module: {
      rules: [
        // es6 to es5
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            // babel-runtime minimizing
            // plugins: env === 'dev' ? [] : ['transform-runtime'],
            // presets: [['es2015', { modules: false }]]
            // with those params are equal to presets: [['es2015', { modules: false }]]
            plugins: [
              'check-es2015-constants',
              'transform-es2015-arrow-functions',
              'transform-es2015-block-scoped-functions',
              'transform-es2015-block-scoping',
              'transform-es2015-classes', // Firefox need, increse speed x3 for FF
              'transform-es2015-computed-properties',
              'transform-es2015-destructuring',
              'transform-es2015-duplicate-keys',
              'transform-es2015-for-of',
              'transform-es2015-function-name',
              'transform-es2015-literals',
              //'transform-es2015-modules-commonjs', // Webpack modules are slow
              'transform-es2015-object-super',
              'transform-es2015-parameters', // trailingComma es5 are slow
              'transform-es2015-shorthand-properties',
              'transform-es2015-spread',
              'transform-es2015-sticky-regex',
              'transform-es2015-template-literals',
              // 'transform-es2015-typeof-symbol', // this add unneessary _typeof() func, works slow and contain some space
              'transform-es2015-unicode-regex',
              'transform-regenerator',
            ],
          },
        },
      ],
    },
    plugins: [
      // new UglifyJSPlugin({
      //     warnings: false,
      //     compress: {
      //         collapse_vars: true,
      //         unsafe: true,
      //         negate_iife: false,
      //         warnings: false,
      //     },
      //     output: {
      //         ascii_only: true,
      //         comments: /@license/gm,
      //         // max_line_len: 500,
      //     },
      //     warningsFilter: () => true,
      // }),
      // create custom index.html
      new HtmlWebpackPlugin({
        title: 'Interf',
        template: 'template.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      // provide some variables
      new webpack.DefinePlugin({
        $VERSION$: pkg.version,
        $VERSION_COUNT$: pkg.versionsList.length,
      }),
    ],
  };
};
