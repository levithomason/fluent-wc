module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.ts"],
  addons: [
    // "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-jest",
  ],
  framework: "@storybook/web-components",
  // babel: async (options) => ({
  //   // Update your babel configuration here
  //   ...options,
  // }),
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need
  //   // Return the altered config
  //   return config;
  // },
};
