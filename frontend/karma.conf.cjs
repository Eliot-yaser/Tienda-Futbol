
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      "src/tests/**/*.spec.js"
    ],

    preprocessors: {
      "src/tests/**/*.spec.js": ["webpack"]
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",

      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }]
                ],
                plugins: [
                  [
                    "babel-plugin-istanbul",
                    {
                      exclude: [
                        "**/*.spec.js",
                        "**/tests/**"
                      ]
                    }
                  ]
                ]
              }
            }
          }
        ]
      },

      resolve: {
        extensions: [".js", ".jsx"]
      }
    },

    reporters: ["progress", "coverage"],

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" }
      ]
    },

    browsers: ["ChromeHeadless"],

    singleRun: true
  });
};
