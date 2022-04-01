import { css, html, LitElement } from "lit";

export class FluentToggle extends LitElement {
  static styles = css`
    :host button {
      padding: 40px 80px;
    }
    :host([active]) button {
      background: greenyellow;
    }
  `;
  static properties = {
    active: { value: false, type: Boolean, reflect: true },
  };

  active: boolean = false;

  _handleClick() {
    console.log("menu _handleClick", this.active, !this.active);
    this.active = !this.active;
  }

  render() {
    return html`<button @click=${this._handleClick}>
      ${this.active ? "On" : "Off"}
    </button>`;
  }
}

const TAG_NAME = "fui-toggle";

customElements.define(TAG_NAME, FluentToggle);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: FluentToggle;
  }
  namespace JSX {
    interface IntrinsicElements {
      [TAG_NAME]: FluentToggle;
    }
  }
}
