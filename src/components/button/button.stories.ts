import { html } from "lit-html";
import { ref, createRef } from "lit/directives/ref.js";

import "./../provider/provider";
import "./button";

export default {
  title: "Button",
};

const Template = () => {
  return html`<fui-provider>
    <fui-button>Default</fui-button>
    <p>
      Note, changing properties that affect styles only do not need to cause a
      re-render.
    </p>
    <fui-button appearance="primary">appearance="primary"</fui-button>
  </fui-provider>`;
};

export const Default = Template.bind({});

export const StyleAttributes = () => {
  const appearances = ["outline", "primary", "subtle", "transparent"];

  const buttonRef = createRef<HTMLButtonElement>();
  let appearance = "outline";

  const setNextAppearance = () => {
    const i = appearances.indexOf(appearance);
    appearance = appearances[i + 1] || appearances[0];
    buttonRef?.value?.setAttribute("appearance", appearance);
  };

  setInterval(setNextAppearance, 1000);

  return html`<fui-provider>
    <p>
      Mutating the <code>appearance</code> property does not update the same
      value used in the template.
    </p>
    <fui-button ${ref(buttonRef)} appearance="${appearance}">
      appearance="${appearance}"
    </fui-button>
    <p>
      The button text "outline" never changes, yet the attribute does and the
      CSS selector matches.
    </p>
  </fui-provider>`;
};
