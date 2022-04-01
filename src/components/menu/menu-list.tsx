import { css, html, LitElement } from "lit";

export class FluentMenuList extends LitElement {
  static styles = css`
    :host ul {
      padding: 4px 4px 8px;
      margin: 0;
      width: 200px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px #ddd;
      overflow: hidden;
    }
  `;

  render() {
    console.log("menu-list render");
    return html`<ul role="list">
      <slot></slot>
    </ul>`;
  }
}

const TAG_NAME = "fui-menu-list";

customElements.define(TAG_NAME, FluentMenuList);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: FluentMenuList;
  }
  namespace JSX {
    interface IntrinsicElements {
      [TAG_NAME]: FluentMenuList;
    }
  }
}
