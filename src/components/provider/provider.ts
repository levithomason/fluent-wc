import { styles } from "./provider.styles";

class Provider extends HTMLElement {
  _style: HTMLStyleElement;
  _template: HTMLTemplateElement;
  _root: ShadowRoot;

  constructor() {
    super();

    this._style = document.createElement("style");
    this._template = document.createElement("template");

    this._root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    this._style.innerHTML = styles;

    this._template.innerHTML = `
    <div>
      <slot></slot>
    </div>
  `;

    this._root.appendChild(this._style);
    this._root.appendChild(this._template.content.cloneNode(true));
  }

  // Invoked each time the custom element is appended into a document-connected element.
  // This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
  // Note: connectedCallback may be called once your element is no longer connected, use Node.isConnected to make sure.
  connectedCallback() {
    console.log("connectedCallback");
  }

  // Invoked each time the custom element is disconnected from the document's DOM.
  disconnectedCallback() {
    console.log("disconnectedCallback");
  }

  // Invoked each time the custom element is moved to a new document.
  adoptedCallback() {
    console.log("adoptedCallback");
  }

  // Invoked each time one of the custom element's attributes is added, removed, or changed.
  // Which attributes to notice change for is specified in a static get observedAttributes method
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log("attributeChangedCallback", { name, oldValue, newValue });
  }
}

customElements.define("fui-provider", Provider);
