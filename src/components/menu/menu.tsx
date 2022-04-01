import { html, LitElement } from "lit";
// import { computePosition } from "@floating-ui/dom";
// import { ref } from "lit/directives/ref";

export class FluentMenu extends LitElement {
  static properties = {
    open: { value: false, type: Boolean },
  };

  open: boolean = false;

  _handleClick() {
    console.log("menu _handleClick", this.open, !this.open);
    this.open = !this.open;
  }

  // TODO
  // updated() {
  //   const menuTrigger = this.shadowRoot?.querySelector(
  //     "slot[name=menu-trigger]"
  //   );
  //   if (!menuTrigger) return;
  //   const [triggerEl] = menuTrigger.assignedElements();
  //
  //   const listSlot = this.shadowRoot?.querySelector("slot[name=menu-list]");
  //   if (!listSlot) return;
  //   const [listEl] = listSlot.assignedElements();
  //
  //   console.log("menu _handleListRef", { triggerEl, listEl });
  //   if (!triggerEl || !listEl) return;
  //
  //   computePosition(triggerEl, listEl).then(({ x, y }) => {
  //     console.log("menu handleSlotChange computePosition", x, y);
  //     Object.assign(listEl.style, {
  //       left: x,
  //       top: y,
  //     });
  //   });
  // }

  render() {
    console.log("menu render open =", this.open);
    return html`<div>
      <slot name="menu-trigger" @click=${this._handleClick}></slot>
      ${this.open ? html`<slot name="menu-list"></slot>` : ""}
    </div>`;
  }
}

const TAG_NAME = "fui-menu";

customElements.define(TAG_NAME, FluentMenu);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: FluentMenu;
  }
  namespace JSX {
    interface IntrinsicElements {
      [TAG_NAME]: FluentMenu;
    }
  }
}
