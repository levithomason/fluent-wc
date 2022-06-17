import { html } from "lit-html";

import "./../provider/provider";
import "./button";

export default {
  title: "Button",
};

const Template = () => {
  return html`<fui-provider>
    <fui-button>Click Me</fui-button>
  </fui-provider>`;
};

export const Default = Template.bind({});
