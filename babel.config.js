module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: [] // Temporarily remove all plugins for debugging
  };
};
