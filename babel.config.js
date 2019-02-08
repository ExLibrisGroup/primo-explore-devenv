module.exports = function (api) {
  api.cache.never();

  return {
    "presets": [
      ["@babel/preset-env", {
        targets: {
          browsers: [
            ">.25%",
            "not dead",
            "ie >= 11",
          ]
        },
        useBuiltIns: "usage"
      }]
    ],
    plugins: [
      "transform-html-import-to-string",
      ["@babel/plugin-transform-runtime", {
        regenerator: true,
      }],
    ],
    sourceMaps: "both",
    overrides: [{
      test: "./node_modules",
      sourceType: "unambiguous"
    }]
  };
};
