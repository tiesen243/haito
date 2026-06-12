const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {}

module.exports = withUniwindConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    cssEntryFile: './src/globals.css',
    dtsFile: './src/uniwind-types.d.ts',
  }
)
