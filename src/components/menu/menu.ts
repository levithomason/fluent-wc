import { html, LitElement } from "lit";
import { ref } from "lit/directives/ref";
import {
  autoPlacement,
  autoUpdate,
  computePosition,
  hide,
  shift,
} from "@floating-ui/dom";

export class FluentMenu extends LitElement {
  static properties = {
    open: { value: false, type: Boolean },
  };

  _cleanupAutoUpdate: () => void = () => void 0;
  open: boolean = false;

  // get _triggerNode() {
  //   const slot = this.shadowRoot?.querySelector("slot[name=menu-trigger]");
  //   return !slot
  //     ? null
  //     : (slot as HTMLSlotElement).assignedNodes({ flatten: true })[0];
  // }
  //
  // get _listNode() {
  //   const slot = this.shadowRoot?.querySelector("slot[name=menu-list]");
  //   return !slot
  //     ? null
  //     : (slot as HTMLSlotElement).assignedElements({ flatten: true })[0];
  // }

  constructor() {
    super();

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleListRef = this._handleListRef.bind(this);
    this._handleTriggerRef = this._handleTriggerRef.bind(this);
  }

  _handleClick(e: Event) {
    this.toggleMenu();
    e.stopPropagation();
  }

  _handleClickOutside() {
    if (!this.open) return;

    this.closeMenu();
  }

  openMenu() {
    console.log("menu _handleClick", this.open, !this.open);
    document.addEventListener("click", this._handleClickOutside);

    this.open = true;
    this._position();
  }

  closeMenu() {
    console.log("menu _handleClick", this.open, !this.open);
    document.removeEventListener("click", this._handleClickOutside);

    this.open = false;
  }

  toggleMenu() {
    this.open ? this.closeMenu() : this.openMenu();
  }

  _position() {
    console.log("menu _position");

    const referenceEl = this._triggerNode;
    const floatingEl = this._listNode;

    console.log("menu _position", { referenceEl, floatingEl });

    if (!referenceEl || !floatingEl) return;

    this._cleanupAutoUpdate = autoUpdate(
      referenceEl,
      floatingEl,
      this._updatePosition.bind(this)
    );
  }

  _updatePosition = () => {
    const referenceEl = this._triggerNode;
    const floatingEl = this._listNode;

    if (!referenceEl || !floatingEl) return;

    computePosition(referenceEl, floatingEl, {
      middleware: [autoPlacement() /*, shift()*/, hide()],
    }).then(({ x, y }) => {
      console.log("menu handleSlotChange computePosition", x, y);
      Object.assign(floatingEl.style, { left: x, top: y });
    });
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("disconnectedCallback");

    document.removeEventListener("click", this._handleClickOutside);
  }

  _handleTriggerRef(el) {
    this._triggerNode = el;
  }

  _handleListRef(el) {
    this._listNode = el;
  }

  render() {
    console.log("menu render open =", this.open);
    return html`<div>
      <slot
        name="menu-trigger"
        @click=${this._handleClick}
        ${ref(this._handleTriggerRef)}
      ></slot>
      ${this.open
        ? html`<slot name="menu-list" ${ref(this._handleListRef)}></slot>`
        : ""}
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
