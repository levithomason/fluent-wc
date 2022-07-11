import { addDecorator } from "@storybook/web-components";
import { withTests } from "@storybook/addon-jest";

import jestTestResults from "../.jest-test-results.json";

addDecorator(withTests({ results: jestTestResults }));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
