import { css, html, LitElement } from "lit";

export class FluentMenuListitem extends LitElement {
  static styles = css`
    :host > div {
      display: block;
      padding: 4px 12px;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
    }

    :host div:hover {
      background: #eee;
    }
  `;

  render() {
    console.log("menu-listitem render");
    return html`<div role="listitem">
      <slot></slot>
    </li>`;
  }
}

const TAG_NAME = "fui-menu-listitem";

customElements.define(TAG_NAME, FluentMenuListitem);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: FluentMenuListitem;
  }
  namespace JSX {
    interface IntrinsicElements {
      [TAG_NAME]: FluentMenuListitem;
    }
  }
}
