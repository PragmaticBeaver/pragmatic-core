const path = require("path");

module.exports = {
  target: "node",
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/",

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader?configFile=tsconfig.webpack.json",
        exclude: /node_modules/,
      },
    ],
  },
};
