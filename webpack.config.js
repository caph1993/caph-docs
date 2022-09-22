
// const CompressionPlugin = require("compression-webpack-plugin");
// const zlib = require("zlib");
import path  from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'caph-docs.min.js',
    library: 'caph',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  mode: 'production',
  devtool: 'source-map',
  // plugins: [
  //   new CompressionPlugin({
  //     filename: "[path][base].br",
  //     algorithm: "brotliCompress",
  //     test: /\.(js|css|html|svg)$/,
  //     compressionOptions: {
  //       params: {
  //         [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
  //       },
  //     },
  //     threshold: 10240,
  //     minRatio: 0.8,
  //     deleteOriginalAssets: false,
  //   }),
  // ],
};