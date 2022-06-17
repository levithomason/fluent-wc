import {
  getCompatibleStyle,
  adoptStyles,
  CSSResultGroup,
  CSSResultOrNative,
} from "./css-tag.js";
import type {
  ReactiveController,
  ReactiveControllerHost,
} from "./reactive-controller.js";

export * from "./css-tag.js";
export type {
  ReactiveController,
  ReactiveControllerHost,
} from "./reactive-controller.js";

const DEV_MODE = true;

let requestUpdateThenable: (name: string) => {
  then: (
    onfulfilled?: (value: boolean) => void,
    _onrejected?: () => void
  ) => void;
};

let issueWarning: (code: string, warning: string) => void;

const trustedTypes = (
  window as unknown as { trustedTypes?: { emptyScript: "" } }
).trustedTypes;

const emptyStringForBooleanAttribute = trustedTypes
  ? (trustedTypes.emptyScript as unknown as "")
  : "";

const polyfillSupport = DEV_MODE
  ? window.reactiveElementPolyfillSupportDevMode
  : window.reactiveElementPolyfillSupport;

if (DEV_MODE) {
  const issuedWarnings: Set<string | undefined> =
    (globalThis.litIssuedWarnings ??= new Set());

  issueWarning = (code: string, warning: string) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };

  issueWarning(
    "dev-mode",
    `Lit is in dev mode. Not recommended for production!`
  );

  if (window.ShadyDOM?.inUse && polyfillSupport === undefined) {
    issueWarning(
      "polyfill-support-missing",
      `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
        `the \`polyfill-support\` module has not been loaded.`
    );
  }

  requestUpdateThenable = (name) => ({
    then: (
      onfulfilled?: (value: boolean) => void,
      _onrejected?: () => void
    ) => {
      issueWarning(
        "request-update-promise",
        `The \`requestUpdate\` method should no longer return a Promise but ` +
          `does so on \`${name}\`. Use \`updateComplete\` instead.`
      );
      if (onfulfilled !== undefined) {
        onfulfilled(false);
      }
    },
  });
}

export namespace ReactiveUnstable {
  export namespace DebugLog {
    export type Entry = Update;
    export interface Update {
      kind: "update";
    }
  }
}

interface DebugLoggingWindow {
  emitLitDebugLogEvents?: boolean;
}

const debugLogEvent = DEV_MODE
  ? (event: ReactiveUnstable.DebugLog.Entry) => {
      const shouldEmit = (window as unknown as DebugLoggingWindow)
        .emitLitDebugLogEvents;
      if (!shouldEmit) {
        return;
      }
      window.dispatchEvent(
        new CustomEvent<ReactiveUnstable.DebugLog.Entry>("lit-debug", {
          detail: event,
        })
      );
    }
  : undefined;

/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = <P extends PropertyKey>(
  prop: P,
  _obj: unknown
): P => prop;

export interface ComplexAttributeConverter<Type = unknown, TypeHint = unknown> {
  fromAttribute?(value: string | null, type?: TypeHint): Type;

  toAttribute?(value: Type, type?: TypeHint): unknown;
}

type AttributeConverter<Type = unknown, TypeHint = unknown> =
  | ComplexAttributeConverter<Type>
  | ((value: string | null, type?: TypeHint) => Type);

export interface PropertyDeclaration<Type = unknown, TypeHint = unknown> {
  readonly state?: boolean;

  readonly attribute?: boolean | string;

  readonly type?: TypeHint;

  readonly converter?: AttributeConverter<Type, TypeHint>;

  readonly reflect?: boolean;

  hasChanged?(value: Type, oldValue: Type): boolean;

  readonly noAccessor?: boolean;
}

export interface PropertyDeclarations {
  readonly [key: string]: PropertyDeclaration;
}

type PropertyDeclarationMap = Map<PropertyKey, PropertyDeclaration>;

type AttributeMap = Map<string, PropertyKey>;

export type PropertyValues<T = any> = T extends object
  ? PropertyValueMap<T>
  : Map<PropertyKey, unknown>;

export interface PropertyValueMap<T> extends Map<PropertyKey, unknown> {
  get<K extends keyof T>(k: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): this;
  has<K extends keyof T>(k: K): boolean;
  delete<K extends keyof T>(k: K): boolean;
}

export const defaultConverter: ComplexAttributeConverter = {
  toAttribute(value: unknown, type?: unknown): unknown {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },

  fromAttribute(value: string | null, type?: unknown) {
    let fromValue: unknown = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value!) as unknown;
        } catch (e) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  },
};

export interface HasChanged {
  (value: unknown, old: unknown): boolean;
}

export const notEqual: HasChanged = (value: unknown, old: unknown): boolean => {
  return old !== value && (old === old || value === value);
};

const defaultPropertyDeclaration: PropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual,
};

const finalized = "finalized";

export type WarningKind = "change-in-update" | "migration";

export type Initializer = (element: ReactiveElement) => void;

export abstract class ReactiveElement
  extends HTMLElement
  implements ReactiveControllerHost
{
  static enabledWarnings?: WarningKind[];

  static enableWarning?: (warningKind: WarningKind) => void;

  static disableWarning?: (warningKind: WarningKind) => void;

  static addInitializer(initializer: Initializer) {
    this._initializers ??= [];
    this._initializers.push(initializer);
  }

  static _initializers?: Initializer[];

  /*
   * Due to closure compiler ES6 compilation bugs, @nocollapse is required on
   * all static methods and properties with initializers.  Reference:
   * - https://github.com/google/closure-compiler/issues/1776
   */

  private static __attributeToPropertyMap: AttributeMap;

  protected static [finalized] = true;

  static elementProperties: PropertyDeclarationMap = new Map();

  static properties: PropertyDeclarations;

  static elementStyles: Array<CSSResultOrNative> = [];

  static styles?: CSSResultGroup;

  private static __reactivePropertyKeys?: Set<PropertyKey>;

  static get observedAttributes() {
    this.finalize();
    const attributes: string[] = [];

    this.elementProperties.forEach((v, p) => {
      const attr = this.__attributeNameForProperty(p, v);
      if (attr !== undefined) {
        this.__attributeToPropertyMap.set(attr, p);
        attributes.push(attr);
      }
    });
    return attributes;
  }

  static createProperty(
    name: PropertyKey,
    options: PropertyDeclaration = defaultPropertyDeclaration
  ) {
    if (options.state) {
      (options as any).attribute = false;
    }

    this.finalize();
    this.elementProperties.set(name, options);

    if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
      const key = typeof name === "symbol" ? Symbol() : `__${name}`;
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== undefined) {
        Object.defineProperty(this.prototype, name, descriptor);
        if (DEV_MODE) {
          if (!this.hasOwnProperty("__reactivePropertyKeys")) {
            this.__reactivePropertyKeys = new Set(
              this.__reactivePropertyKeys ?? []
            );
          }
          this.__reactivePropertyKeys!.add(name);
        }
      }
    }
  }

  protected static getPropertyDescriptor(
    name: PropertyKey,
    key: string | symbol,
    options: PropertyDeclaration
  ): PropertyDescriptor | undefined {
    return {
      get(): any {
        return (this as { [key: string]: unknown })[key as string];
      },
      set(this: ReactiveElement, value: unknown) {
        const oldValue = (this as {} as { [key: string]: unknown })[
          name as string
        ];
        (this as {} as { [key: string]: unknown })[key as string] = value;
        (this as unknown as ReactiveElement).requestUpdate(
          name,
          oldValue,
          options
        );
      },
      configurable: true,
      enumerable: true,
    };
  }

  static getPropertyOptions(name: PropertyKey) {
    return this.elementProperties.get(name) || defaultPropertyDeclaration;
  }

  protected static finalize() {
    if (this.hasOwnProperty(finalized)) {
      return false;
    }
    this[finalized] = true;

    const superCtor = Object.getPrototypeOf(this) as typeof ReactiveElement;
    superCtor.finalize();
    this.elementProperties = new Map(superCtor.elementProperties);

    this.__attributeToPropertyMap = new Map();

    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;

      const propKeys = [
        ...Object.getOwnPropertyNames(props),
        ...Object.getOwnPropertySymbols(props),
      ];

      for (const p of propKeys) {
        this.createProperty(p, (props as any)[p]);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);

    if (DEV_MODE) {
      const warnRemovedOrRenamed = (name: string, renamed = false) => {
        if (this.prototype.hasOwnProperty(name)) {
          issueWarning(
            renamed ? "renamed-api" : "removed-api",
            `\`${name}\` is implemented on class ${this.name}. It ` +
              `has been ${renamed ? "renamed" : "removed"} ` +
              `in this version of LitElement.`
          );
        }
      };
      warnRemovedOrRenamed("initialize");
      warnRemovedOrRenamed("requestUpdateInternal");
      warnRemovedOrRenamed("_getUpdateComplete", true);
    }
    return true;
  }

  static shadowRootOptions: ShadowRootInit = { mode: "open" };

  protected static finalizeStyles(
    styles?: CSSResultGroup
  ): Array<CSSResultOrNative> {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set((styles as Array<unknown>).flat(Infinity).reverse());

      for (const s of set) {
        elementStyles.unshift(getCompatibleStyle(s as CSSResultOrNative));
      }
    } else if (styles !== undefined) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }

  readonly renderRoot!: HTMLElement | ShadowRoot;

  private static __attributeNameForProperty(
    name: PropertyKey,
    options: PropertyDeclaration
  ) {
    const attribute = options.attribute;
    return attribute === false
      ? undefined
      : typeof attribute === "string"
      ? attribute
      : typeof name === "string"
      ? name.toLowerCase()
      : undefined;
  }

  private __instanceProperties?: PropertyValues = new Map();

  private __updatePromise!: Promise<boolean>;

  isUpdatePending = false;

  hasUpdated = false;

  _$changedProperties!: PropertyValues;

  private __reflectingProperties?: Map<PropertyKey, PropertyDeclaration>;

  private __reflectingProperty: PropertyKey | null = null;

  private __controllers?: ReactiveController[];

  constructor() {
    super();
    this._initialize();
  }

  _initialize() {
    this.__updatePromise = new Promise<boolean>(
      (res) => (this.enableUpdating = res)
    );
    this._$changedProperties = new Map();
    this.__saveInstanceProperties();

    this.requestUpdate();
    (this.constructor as typeof ReactiveElement)._initializers?.forEach((i) =>
      i(this)
    );
  }

  addController(controller: ReactiveController) {
    (this.__controllers ??= []).push(controller);

    if (this.renderRoot !== undefined && this.isConnected) {
      controller.hostConnected?.();
    }
  }

  removeController(controller: ReactiveController) {
    this.__controllers?.splice(this.__controllers.indexOf(controller) >>> 0, 1);
  }

  private __saveInstanceProperties() {
    (this.constructor as typeof ReactiveElement).elementProperties.forEach(
      (_v, p) => {
        if (this.hasOwnProperty(p)) {
          this.__instanceProperties!.set(p, this[p as keyof this]);
          delete this[p as keyof this];
        }
      }
    );
  }

  protected createRenderRoot(): Element | ShadowRoot {
    const renderRoot =
      this.shadowRoot ??
      this.attachShadow(
        (this.constructor as typeof ReactiveElement).shadowRootOptions
      );
    adoptStyles(
      renderRoot,
      (this.constructor as typeof ReactiveElement).elementStyles
    );
    return renderRoot;
  }

  connectedCallback() {
    if (this.renderRoot === undefined) {
      (
        this as {
          renderRoot: Element | DocumentFragment;
        }
      ).renderRoot = this.createRenderRoot();
    }
    this.enableUpdating(true);
    this.__controllers?.forEach((c) => c.hostConnected?.());
  }

  protected enableUpdating(_requestedUpdate: boolean) {}

  disconnectedCallback() {
    this.__controllers?.forEach((c) => c.hostDisconnected?.());
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    this._$attributeToProperty(name, value);
  }

  private __propertyToAttribute(
    name: PropertyKey,
    value: unknown,
    options: PropertyDeclaration = defaultPropertyDeclaration
  ) {
    const attr = (
      this.constructor as typeof ReactiveElement
    ).__attributeNameForProperty(name, options);
    if (attr !== undefined && options.reflect === true) {
      const toAttribute =
        (options.converter as ComplexAttributeConverter)?.toAttribute ??
        defaultConverter.toAttribute;
      const attrValue = toAttribute!(value, options.type);
      if (
        DEV_MODE &&
        (this.constructor as typeof ReactiveElement).enabledWarnings!.indexOf(
          "migration"
        ) >= 0 &&
        attrValue === undefined
      ) {
        issueWarning(
          "undefined-attribute-value",
          `The attribute value for the ${name as string} property is ` +
            `undefined on element ${this.localName}. The attribute will be ` +
            `removed, but in the previous version of \`ReactiveElement\`, ` +
            `the attribute would not have changed.`
        );
      }

      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue as string);
      }

      this.__reflectingProperty = null;
    }
  }

  _$attributeToProperty(name: string, value: string | null) {
    const ctor = this.constructor as typeof ReactiveElement;

    const propName = (ctor.__attributeToPropertyMap as AttributeMap).get(name);

    if (propName !== undefined && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = options.converter;
      const fromAttribute =
        (converter as ComplexAttributeConverter)?.fromAttribute ??
        (typeof converter === "function"
          ? (converter as (value: string | null, type?: unknown) => unknown)
          : null) ??
        defaultConverter.fromAttribute;

      this.__reflectingProperty = propName;

      this[propName as keyof this] = fromAttribute!(value, options.type) as any;

      this.__reflectingProperty = null;
    }
  }

  requestUpdate(
    name?: PropertyKey,
    oldValue?: unknown,
    options?: PropertyDeclaration
  ): void {
    let shouldRequestUpdate = true;

    if (name !== undefined) {
      options =
        options ||
        (this.constructor as typeof ReactiveElement).getPropertyOptions(name);
      const hasChanged = options.hasChanged || notEqual;
      if (hasChanged(this[name as keyof this], oldValue)) {
        if (!this._$changedProperties.has(name)) {
          this._$changedProperties.set(name, oldValue);
        }

        if (options.reflect === true && this.__reflectingProperty !== name) {
          if (this.__reflectingProperties === undefined) {
            this.__reflectingProperties = new Map();
          }
          this.__reflectingProperties.set(name, options);
        }
      } else {
        shouldRequestUpdate = false;
      }
    }
    if (!this.isUpdatePending && shouldRequestUpdate) {
      this.__updatePromise = this.__enqueueUpdate();
    }

    return DEV_MODE
      ? (requestUpdateThenable(this.localName) as unknown as void)
      : undefined;
  }

  private async __enqueueUpdate() {
    this.isUpdatePending = true;
    try {
      await this.__updatePromise;
    } catch (e) {
      Promise.reject(e);
    }
    const result = this.scheduleUpdate();

    if (result != null) {
      await result;
    }
    return !this.isUpdatePending;
  }

  protected scheduleUpdate(): void | Promise<unknown> {
    return this.performUpdate();
  }

  protected performUpdate(): void | Promise<unknown> {
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent?.({ kind: "update" });

    if (!this.hasUpdated) {
      if (DEV_MODE) {
        const shadowedProperties: string[] = [];
        (
          this.constructor as typeof ReactiveElement
        ).__reactivePropertyKeys?.forEach((p) => {
          if (this.hasOwnProperty(p) && !this.__instanceProperties?.has(p)) {
            shadowedProperties.push(p as string);
          }
        });
        if (shadowedProperties.length) {
          throw new Error(
            `The following properties on element ${this.localName} will not ` +
              `trigger updates as expected because they are set using class ` +
              `fields: ${shadowedProperties.join(", ")}. ` +
              `Native class fields and some compiled output will overwrite ` +
              `accessors used for detecting changes. See ` +
              `https://lit.dev/msg/class-field-shadowing ` +
              `for more information.`
          );
        }
      }
    }

    if (this.__instanceProperties) {
      this.__instanceProperties!.forEach((v, p) => ((this as any)[p] = v));
      this.__instanceProperties = undefined;
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        this.__controllers?.forEach((c) => c.hostUpdate?.());
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e) {
      shouldUpdate = false;

      this.__markUpdated();
      throw e;
    }

    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }

  protected willUpdate(_changedProperties: PropertyValues): void {}

  _$didUpdate(changedProperties: PropertyValues) {
    this.__controllers?.forEach((c) => c.hostUpdated?.());
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (
      DEV_MODE &&
      this.isUpdatePending &&
      (this.constructor as typeof ReactiveElement).enabledWarnings!.indexOf(
        "change-in-update"
      ) >= 0
    ) {
      issueWarning(
        "change-in-update",
        `Element ${this.localName} scheduled an update ` +
          `(generally because a property was set) ` +
          `after an update completed, causing a new update to be scheduled. ` +
          `This is inefficient and should be avoided unless the next update ` +
          `can only be scheduled as a side effect of the previous update.`
      );
    }
  }

  private __markUpdated() {
    this._$changedProperties = new Map();
    this.isUpdatePending = false;
  }

  get updateComplete(): Promise<boolean> {
    return this.getUpdateComplete();
  }

  protected getUpdateComplete(): Promise<boolean> {
    return this.__updatePromise;
  }

  protected shouldUpdate(_changedProperties: PropertyValues): boolean {
    return true;
  }

  protected update(_changedProperties: PropertyValues) {
    if (this.__reflectingProperties !== undefined) {
      this.__reflectingProperties.forEach((v, k) =>
        this.__propertyToAttribute(k, this[k as keyof this], v)
      );
      this.__reflectingProperties = undefined;
    }
    this.__markUpdated();
  }

  protected updated(_changedProperties: PropertyValues) {}

  protected firstUpdated(_changedProperties: PropertyValues) {}
}

polyfillSupport?.({ ReactiveElement });

if (DEV_MODE) {
  ReactiveElement.enabledWarnings = ["change-in-update"];
  const ensureOwnWarnings = function (ctor: typeof ReactiveElement) {
    if (
      !ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))
    ) {
      ctor.enabledWarnings = ctor.enabledWarnings!.slice();
    }
  };
  ReactiveElement.enableWarning = function (
    this: typeof ReactiveElement,
    warning: WarningKind
  ) {
    ensureOwnWarnings(this);
    if (this.enabledWarnings!.indexOf(warning) < 0) {
      this.enabledWarnings!.push(warning);
    }
  };
  ReactiveElement.disableWarning = function (
    this: typeof ReactiveElement,
    warning: WarningKind
  ) {
    ensureOwnWarnings(this);
    const i = this.enabledWarnings!.indexOf(warning);
    if (i >= 0) {
      this.enabledWarnings!.splice(i, 1);
    }
  };
}

(globalThis.reactiveElementVersions ??= []).push("1.3.2");
if (DEV_MODE && globalThis.reactiveElementVersions.length > 1) {
  issueWarning!(
    "multiple-versions",
    `Multiple versions of Lit loaded. Loading multiple versions ` +
      `is not recommended.`
  );
}
