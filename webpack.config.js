const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './server.js',
  target: 'node', 
  output: {
    path: path.resolve(__dirname, 'dist/build-a-node-project'),
    filename: 'main.js'
  },
  mode: "production", // Mode production pour activer la minification et l'obfuscation
  // Exclude node_modules so it's not bundled  
  externals: [nodeExternals()],  

  module: {
    rules: [
      // Transpile ES6 to ES5 with Babel
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']  
          }
        }  
      }
    ]
  },

  plugins: [
    // Minify and optimize with Terser
    new TerserPlugin({
      terserOptions: {
        mangle: true, // Activer l'obfuscation
      },
    })
  ],

  optimization: {
    minimize: true
  },

  // Don't pull in external dependencies
  externalsPresets: { node: true },
};