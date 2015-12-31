var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  debug: {
    entry: {
      app: './src/public/bootstrap.ts',
      vendor: './src/public/vendor.ts'
    },

    output: {
      path: './build/public/app/',
      filename: '[name].js',
      publicPath: '/app/'
    },

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'
      }),
      new webpack.optimize.DedupePlugin(),
      new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
      new CommonsChunkPlugin({name: 'common', filename: 'common.js', minChunks: 2, chunks: ['app', 'vendor']})
    ],

    stats: true,

    progress: true,

    failOnError: true,

    watch: false,

    keepalive: false,

    inline: false,

    hot: false,

    module: {
      loaders: [
        {
          test: /\.jsx$/,
          loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader'
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url-loader?limit=8192'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.html$/,
          loader: 'raw-loader'
        },
        {
          test: /\.html\.tmpl$/,
          loader: 'raw-loader'
        },
        {
          test: /\.node$/,
          loader: 'node-loader'
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          query: {
            'ignoreDiagnostics': [
              2403, // 2403 Subsequent variable declarations
              2300, // 2300 Duplicate identifier
              //2374, // 2374 Duplicate number index signature
              2375, // 2375 Duplicate string index signature
              2420  // 2420 Class 'EventEmitter' incorrectly implements interface 'NodeJS.EventEmitter'
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
      extensions: ['', '.ts', '.js', '.json', '.css', '.html', '.html.tmpl', '.css', '.node']
    },

    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  },
};
