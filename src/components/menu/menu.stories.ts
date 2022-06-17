import { html } from "lit-html";

import "./menu";
import "./menu-list";
import "./menu-listitem";

export default {
  title: "Menu",
};

const Template = () => {
  return html`
    <div
      style="position: relative; border: 2px solid; padding: 20px; height: 120px; overflow: scroll;"
    >
      <strong
        style="position:absolute; top:0; left:0; background: #000; color: #fff; font-size: 10px; padding: 1px 3px;"
        >overflow: hidden;</strong
      >
      <br />
      <br />
      <br />
      <br />
      <fui-menu>
        <button slot="menu-trigger">Toggle Menu</button>
        <fui-menu-list slot="menu-list">
          <fui-menu-listitem>Item 1</fui-menu-listitem>
          <fui-menu-listitem>Item 2</fui-menu-listitem>
          <fui-menu-listitem>Item 3</fui-menu-listitem>
          <fui-menu-listitem>Item 4</fui-menu-listitem>
        </fui-menu-list>
      </fui-menu>

      <div>1 This container clips content</div>
      <div>2 This container clips content</div>
      <div>3 This container clips content</div>
      <div>4 This container clips content</div>
      <div>5 This container clips content</div>
      <div>6 This container clips content</div>
      <div>7 This container clips content</div>
      <div>8 This container clips content</div>
      <div>9 This container clips content</div>
      <div>10 This container clips content</div>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
};
