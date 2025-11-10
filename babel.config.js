module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@store": "./src/store",
            "@services": "./src/services",
            "@types": "./src/types",
            "@constants": "./src/constants",
            "@assets": "./assets",
          },
        },
      ],
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};