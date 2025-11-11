module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo'],  'nativewind/babel',],
    plugins: [
      // ✅ NativeWind plugin
     

      // ✅ Module resolver plugin (standalone entry)
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@store': './src/store',
            '@services': './src/services',
            '@types': './src/types',
            '@constants': './src/constants',
            '@assets': './assets',
          },
        },
      ],

      // // ✅ Expo Router plugin (optional but recommended if you use expo-router)
      // require.resolve('expo-router/babel'),

      // ✅ Reanimated plugin must always be last
      'react-native-reanimated/plugin',
    ],
  };
};
