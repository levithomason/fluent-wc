import { html } from "lit-html";

import "./menu";
import "./menu-list";
import "./menu-listitem";

export default {
  title: "Menu",
};

const Template = () => {
  return html`
    <fui-menu>
      <button slot="menu-trigger">Toggle Menu</button>
      <fui-menu-list slot="menu-list">
        <fui-menu-listitem>Item 1</fui-menu-listitem>
        <fui-menu-listitem>Item 2</fui-menu-listitem>
        <fui-menu-listitem>Item 3</fui-menu-listitem>
      </fui-menu-list>
    </fui-menu>
  `;
};
export const Default = Template.bind({});
Default.args = {
  open: true,
};
