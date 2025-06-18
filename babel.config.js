module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['@react-native/babel-preset', {jsxImportSource: 'nativewind'}],
      'nativewind/babel',
    ],
  };
};
