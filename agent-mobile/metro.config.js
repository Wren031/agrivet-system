const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const os = require("os");

const config = getDefaultConfig(__dirname);

config.maxWorkerThreads = Math.max(2, os.cpus().length - 2);

config.transformer.minifierConfig = {
  mangle: false,
  compress: false,
};

config.resolver.disableHierarchicalLookup = false;
config.resolver.unstable_enableSymlinks = false;

module.exports = withNativeWind(config, { input: "./global.css" });
