const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack")
const { EnvironmentPlugin, ProvidePlugin, DefinePlugin } = require("webpack")
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env')
});


module.exports = (webpackConfigEnv, argv) => {
  const orgName = "Imalipay";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin( {
        "process.env": JSON.stringify(dotenv.parsed)
      }),
      new EnvironmentPlugin({
        
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
  });
};
