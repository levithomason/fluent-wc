module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    //
  ],
  addons: [
    // "@storybook/addon-links",
    "@storybook/addon-essentials",
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
