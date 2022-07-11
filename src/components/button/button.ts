import { styles } from "./button.styles";

class Button extends HTMLElement {
  _style: HTMLStyleElement;
  _template: HTMLTemplateElement;
  _root: ShadowRoot;

  static get observedAttributes() {
    return ["appearance"];
  }

  constructor() {
    super();

    this._style = document.createElement("style");
    this._template = document.createElement("template");

    this._root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    this._style.innerHTML = styles;

    this._template.innerHTML = `
    <button class="root">
      <slot id="content"></slot>
    </button>
  `;

    this._root.appendChild(this._style);
    this._root.appendChild(this._template.content.cloneNode(true));

    const slot = this._root.querySelector("slot#content");
    slot.addEventListener("slotchange", function (e) {
      console.log(e);
      let nodes = slot.assignedNodes();
      console.log(nodes);
      console.log(
        `Element in Slot "${slot.name}" changed to "${nodes[0]?.outerHTML}".`
      );
    });
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
    const slotElement = this._root.querySelector("slot#content");
    console.log(slotElement);
    console.log(slotElement.innerHTML);
    slotElement.innerHTML = newValue;
    console.log(slotElement.innerHTML);
  }

  render() {
    // this._root.innerHTML = "";
  }
}

customElements.define("fui-button", Button);
