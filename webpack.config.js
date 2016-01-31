var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/public/bootstrap.ts',
    vendor: './src/public/vendor.ts'
  },

  output: {
    chunkFilename: '[id].chunk.js',
    path: './build/public/app',
    filename: '[name].js',
    publicPath: '/app/'
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'
    }),
    new webpack.optimize.DedupePlugin(),
    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
    new CommonsChunkPlugin({name: 'common', filename: 'common.js', minChunks: 2, chunks: ['app', 'vendor']}),
    new CopyWebpackPlugin([{from: 'src/public/app/index.html', to: '/'}])
  ],

  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'jsx?insertPragma=React.DOM&harmony'},
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.scss$/,loader: 'style!css!sass'},
      {test: /\.(gif|jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'file'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.html$/, loader: 'raw'},
      {test: /\.html\.tmpl$/, loader: 'raw'},
      {test: /\.node$/, loader: 'node'},
      {
        test: /\.ts$/, loader: 'ts',
        query: {
          'ignoreDiagnostics': [
            2403, // Subsequent variable declarations
            2300, // Duplicate identifier
            2374, // Duplicate string index signature
            2375, // Duplicate number index signature
            2420, // Class 'EventEmitter' incorrectly implements interface 'NodeJS.EventEmitter'
            2661  // Cannot re-export name that is not defined in the module.
          ]
        },
        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
      },
    ],
    noParse: [/zone\.js\/dist\/.+/, /angular2\/bundles\/.+/]
  },

  resolve: {
    root: [
      path.resolve(__dirname, '../src/public/app'),
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../src/server')
    ],
    extensions: ['', '.ts', '.js', '.json', '.css', '.html', '.html.tmpl', '.node']
  },

  node: {fs: 'empty', net: 'empty', tls: 'empty'},
};
