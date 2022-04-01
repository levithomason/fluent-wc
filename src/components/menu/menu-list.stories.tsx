import { html } from "lit-html";

import "./menu-list";
import "./menu-listitem";

export default {
  title: "Menu List",
};

const Template = () => {
  return html`<fui-menu-list>
    <fui-menu-listitem>Item 1</fui-menu-listitem>
    <fui-menu-listitem>Item 2</fui-menu-listitem>
    <fui-menu-listitem>Item 3</fui-menu-listitem>
  </fui-menu-list>`;
};

export const Default = Template.bind({});
