"use strict";
var RichHtmlEditor = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/core/events.ts
  function getEditorEventEmitter() {
    return editorEventEmitter;
  }
  var EditorEventEmitter, editorEventEmitter;
  var init_events = __esm({
    "src/core/events.ts"() {
      "use strict";
      EditorEventEmitter = class {
        constructor() {
          this.listeners = /* @__PURE__ */ new Map();
        }
        on(type, handler) {
          if (!this.listeners.has(type)) {
            this.listeners.set(type, /* @__PURE__ */ new Set());
          }
          this.listeners.get(type).add(handler);
          return () => this.off(type, handler);
        }
        once(type, handler) {
          const unsubscribe = this.on(type, (event) => {
            handler(event);
            unsubscribe();
          });
        }
        off(type, handler) {
          const handlers = this.listeners.get(type);
          if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) this.listeners.delete(type);
          }
        }
        emit(event) {
          const handlers = this.listeners.get(event.type);
          if (handlers) {
            handlers.forEach((handler) => {
              try {
                handler(event);
              } catch (error) {
                console.error(
                  `[rich-html-editor] Error in event handler for ${event.type}:`,
                  error
                );
              }
            });
          }
        }
        removeAllListeners(type) {
          if (type) this.listeners.delete(type);
          else this.listeners.clear();
        }
        listenerCount(type) {
          var _a, _b;
          return (_b = (_a = this.listeners.get(type)) == null ? void 0 : _a.size) != null ? _b : 0;
        }
      };
      editorEventEmitter = new EditorEventEmitter();
    }
  });

  // src/core/constants.ts
  var TOOLBAR_ID, STYLE_ID, CLASS_EDITABLE, CLASS_ACTIVE, DEFAULT_MAX_STACK, TOOLBAR_BG, TOOLBAR_BORDER, BUTTON_BORDER, BUTTON_ACTIVE_BG, BUTTON_BG, BUTTON_COLOR, INFO_COLOR, HOVER_OUTLINE, ACTIVE_OUTLINE, LABEL_BOLD, LABEL_ITALIC, LABEL_UNDERLINE, LABEL_STRIKETHROUGH, LABEL_UNDO, LABEL_REDO, LABEL_LINK, LABEL_UNORDERED_LIST, LABEL_ORDERED_LIST, LABEL_ALIGN_LEFT, LABEL_ALIGN_CENTER, LABEL_ALIGN_RIGHT, FONT_OPTIONS, SIZE_OPTIONS, FORMAT_OPTIONS, LABEL_CLEAR_FORMAT, MAX_FILE_SIZE;
  var init_constants = __esm({
    "src/core/constants.ts"() {
      "use strict";
      TOOLBAR_ID = "editor-toolbar";
      STYLE_ID = "editor-styles";
      CLASS_EDITABLE = "editor-editable-element";
      CLASS_ACTIVE = "editor-active-element";
      DEFAULT_MAX_STACK = 60;
      TOOLBAR_BG = "#f8fafc";
      TOOLBAR_BORDER = "#e5e7eb";
      BUTTON_BORDER = "#d1d5db";
      BUTTON_ACTIVE_BG = "#e0e7ff";
      BUTTON_BG = "#fff";
      BUTTON_COLOR = "#222";
      INFO_COLOR = "#888";
      HOVER_OUTLINE = "#2563eb";
      ACTIVE_OUTLINE = "#16a34a";
      LABEL_BOLD = "<b>B</b>";
      LABEL_ITALIC = "<i>I</i>";
      LABEL_UNDERLINE = "<u>U</u>";
      LABEL_STRIKETHROUGH = "<s>S</s>";
      LABEL_UNDO = "\u21BA";
      LABEL_REDO = "\u21BB";
      LABEL_LINK = "\u{1F517}";
      LABEL_UNORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
      LABEL_ORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text x="1" y="4" font-size="4" fill="currentColor">1.</text>
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="8" font-size="4" fill="currentColor">2.</text>
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="12" font-size="4" fill="currentColor">3.</text>
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
      LABEL_ALIGN_LEFT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="1" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
      LABEL_ALIGN_CENTER = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="3" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="3" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
      LABEL_ALIGN_RIGHT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="5" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="5" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
      FONT_OPTIONS = [
        { label: "Arial", value: "Arial" },
        { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
        { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
        { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
        { label: "Trebuchet MS", value: "Trebuchet MS, Helvetica, sans-serif" },
        { label: "Georgia", value: "Georgia, serif" },
        { label: "Times New Roman", value: "Times New Roman, Times, serif" },
        { label: "Palatino", value: "Palatino, 'Palatino Linotype', serif" },
        { label: "Garamond", value: "Garamond, serif" },
        { label: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
        { label: "Courier New", value: "'Courier New', Courier, monospace" },
        { label: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
        { label: "Impact", value: "Impact, Charcoal, sans-serif" },
        { label: "Comic Sans MS", value: "'Comic Sans MS', 'Comic Sans', cursive" },
        { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, sans-serif" },
        {
          label: "Roboto",
          value: "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        },
        { label: "Open Sans", value: "'Open Sans', Arial, sans-serif" },
        { label: "Lato", value: "Lato, 'Helvetica Neue', Arial, sans-serif" },
        { label: "Montserrat", value: "Montserrat, Arial, sans-serif" },
        { label: "Source Sans Pro", value: "'Source Sans Pro', Arial, sans-serif" },
        { label: "Fira Sans", value: "'Fira Sans', Arial, sans-serif" },
        { label: "Ubuntu", value: "Ubuntu, Arial, sans-serif" },
        { label: "Noto Sans", value: "'Noto Sans', Arial, sans-serif" },
        { label: "Droid Sans", value: "'Droid Sans', Arial, sans-serif" },
        {
          label: "Helvetica Neue",
          value: "'Helvetica Neue', Helvetica, Arial, sans-serif"
        },
        {
          label: "System UI",
          value: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }
      ];
      SIZE_OPTIONS = [
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
        { label: "14", value: "14" },
        { label: "16", value: "16" },
        { label: "18", value: "18" },
        { label: "20", value: "20" },
        { label: "22", value: "22" },
        { label: "24", value: "24" },
        { label: "26", value: "26" },
        { label: "28", value: "28" },
        { label: "36", value: "36" },
        { label: "48", value: "48" },
        { label: "72", value: "72" }
      ];
      FORMAT_OPTIONS = [
        { label: "Heading 1", value: "h1" },
        { label: "Heading 2", value: "h2" },
        { label: "Heading 3", value: "h3" },
        { label: "Heading 4", value: "h4" },
        { label: "Heading 5", value: "h5" },
        { label: "Heading 6", value: "h6" }
      ];
      LABEL_CLEAR_FORMAT = "\u{1F9F9} Clear";
      MAX_FILE_SIZE = 1024 * 1024;
    }
  });

  // node_modules/dompurify/dist/purify.es.mjs
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const [property, value] of entries(object)) {
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (Array.isArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.3.1";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let {
      document: document2
    } = window2;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node: Node2,
      Element: Element2,
      NodeFilter,
      NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser: DOMParser2,
      trustedTypes
    } = window2;
    const ElementPrototype = Element2.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document2;
    const {
      importNode
    } = originalDocument;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const {
      MUSTACHE_EXPR: MUSTACHE_EXPR2,
      ERB_EXPR: ERB_EXPR2,
      TMPLIT_EXPR: TMPLIT_EXPR2,
      DATA_ATTR: DATA_ATTR2,
      ARIA_ATTR: ARIA_ATTR2,
      IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
      ATTR_WHITESPACE: ATTR_WHITESPACE2,
      CUSTOM_ELEMENT: CUSTOM_ELEMENT2
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
      FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
      HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      if (cfg.ADD_TAGS) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (cfg.ADD_ATTR) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (cfg.ADD_FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        emptyHTML = trustedTypesPolicy.createHTML("");
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        }
        if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
          emptyHTML = trustedTypesPolicy.createHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "svg";
        }
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }
        return Boolean(ALL_SVG_TAGS[tagName]);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "math";
        }
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
        }
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
        null
      );
    };
    const _isClobbered = function _isClobbered2(element) {
      return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
    };
    const _isNode = function _isNode2(value) {
      return typeof Node2 === "function" && value instanceof Node2;
    };
    function _executeHooks(hooks2, currentNode, data) {
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _sanitizeElements = function _sanitizeElements2(currentNode) {
      let content = null;
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(currentNode.nodeName);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
        _forceRemove(currentNode);
        return true;
      }
      if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
        if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
            return false;
          }
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
            return false;
          }
        }
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
          if (childNodes && parentNode) {
            const childCount = childNodes.length;
            for (let i = childCount - 1; i >= 0; --i) {
              const childClone = cloneNode(childNodes[i], true);
              childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
              parentNode.insertBefore(childClone, getNextSibling(currentNode));
            }
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        content = currentNode.textContent;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          content = stringReplace(content, expr, " ");
        });
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
      else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
      else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const {
        attributes
      } = currentNode;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      while (l--) {
        const attr = attributes[l];
        const {
          name,
          namespaceURI,
          value: attrValue
        } = attr;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
            value = stringReplace(value, expr, " ");
          });
        }
        const lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
          if (namespaceURI) ;
          else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case "TrustedHTML": {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
              case "TrustedScriptURL": {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
            }
          }
        }
        if (value !== initValue) {
          try {
            if (namespaceURI) {
              currentNode.setAttributeNS(namespaceURI, name, value);
            } else {
              currentNode.setAttribute(name, value);
            }
            if (_isClobbered(currentNode)) {
              _forceRemove(currentNode);
            } else {
              arrayPop(DOMPurify.removed);
            }
          } catch (_) {
            _removeAttribute(name, currentNode);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode);
        _sanitizeAttributes(shadowNode);
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        if (typeof dirty.toString === "function") {
          dirty = dirty.toString();
          if (typeof dirty !== "string") {
            throw typeErrorCreate("dirty is not a string, aborting");
          }
        } else {
          throw typeErrorCreate("toString is not a function");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      DOMPurify.removed = [];
      if (typeof dirty === "string") {
        IN_PLACE = false;
      }
      if (IN_PLACE) {
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
      } else if (dirty instanceof Node2) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
      while (currentNode = nodeIterator.nextNode()) {
        _sanitizeElements(currentNode);
        _sanitizeAttributes(currentNode);
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
      }
      if (IN_PLACE) {
        return dirty;
      }
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          serializedHTML = stringReplace(serializedHTML, expr, " ");
        });
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var entries, setPrototypeOf, isFrozen, getPrototypeOf, getOwnPropertyDescriptor, freeze, seal, create, apply, construct, arrayForEach, arrayLastIndexOf, arrayPop, arrayPush, arraySplice, stringToLowerCase, stringToString, stringMatch, stringReplace, stringIndexOf, stringTrim, objectHasOwnProperty, regExpTest, typeErrorCreate, html$1, svg$1, svgFilters, svgDisallowed, mathMl$1, mathMlDisallowed, text, html, svg, mathMl, xml, MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR, DATA_ATTR, ARIA_ATTR, IS_ALLOWED_URI, IS_SCRIPT_OR_DATA, ATTR_WHITESPACE, DOCTYPE_NAME, CUSTOM_ELEMENT, EXPRESSIONS, NODE_TYPE, getGlobal, _createTrustedTypesPolicy, _createHooksMap, purify;
  var init_purify_es = __esm({
    "node_modules/dompurify/dist/purify.es.mjs"() {
      "use strict";
      ({
        entries,
        setPrototypeOf,
        isFrozen,
        getPrototypeOf,
        getOwnPropertyDescriptor
      } = Object);
      ({
        freeze,
        seal,
        create
      } = Object);
      ({
        apply,
        construct
      } = typeof Reflect !== "undefined" && Reflect);
      if (!freeze) {
        freeze = function freeze2(x) {
          return x;
        };
      }
      if (!seal) {
        seal = function seal2(x) {
          return x;
        };
      }
      if (!apply) {
        apply = function apply2(func, thisArg) {
          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }
          return func.apply(thisArg, args);
        };
      }
      if (!construct) {
        construct = function construct2(Func) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          return new Func(...args);
        };
      }
      arrayForEach = unapply(Array.prototype.forEach);
      arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
      arrayPop = unapply(Array.prototype.pop);
      arrayPush = unapply(Array.prototype.push);
      arraySplice = unapply(Array.prototype.splice);
      stringToLowerCase = unapply(String.prototype.toLowerCase);
      stringToString = unapply(String.prototype.toString);
      stringMatch = unapply(String.prototype.match);
      stringReplace = unapply(String.prototype.replace);
      stringIndexOf = unapply(String.prototype.indexOf);
      stringTrim = unapply(String.prototype.trim);
      objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
      regExpTest = unapply(RegExp.prototype.test);
      typeErrorCreate = unconstruct(TypeError);
      html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
      svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
      svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
      svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
      mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
      mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
      text = freeze(["#text"]);
      html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
      svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
      mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
      xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
      MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
      ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
      TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
      DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
      ARIA_ATTR = seal(/^aria-[\-\w]+$/);
      IS_ALLOWED_URI = seal(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        // eslint-disable-line no-useless-escape
      );
      IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
      ATTR_WHITESPACE = seal(
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
        // eslint-disable-line no-control-regex
      );
      DOCTYPE_NAME = seal(/^html$/i);
      CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
      EXPRESSIONS = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        ARIA_ATTR,
        ATTR_WHITESPACE,
        CUSTOM_ELEMENT,
        DATA_ATTR,
        DOCTYPE_NAME,
        ERB_EXPR,
        IS_ALLOWED_URI,
        IS_SCRIPT_OR_DATA,
        MUSTACHE_EXPR,
        TMPLIT_EXPR
      });
      NODE_TYPE = {
        element: 1,
        attribute: 2,
        text: 3,
        cdataSection: 4,
        entityReference: 5,
        // Deprecated
        entityNode: 6,
        // Deprecated
        progressingInstruction: 7,
        comment: 8,
        document: 9,
        documentType: 10,
        documentFragment: 11,
        notation: 12
        // Deprecated
      };
      getGlobal = function getGlobal2() {
        return typeof window === "undefined" ? null : window;
      };
      _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
        if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
          return null;
        }
        let suffix = null;
        const ATTR_NAME = "data-tt-policy-suffix";
        if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
          suffix = purifyHostElement.getAttribute(ATTR_NAME);
        }
        const policyName = "dompurify" + (suffix ? "#" + suffix : "");
        try {
          return trustedTypes.createPolicy(policyName, {
            createHTML(html2) {
              return html2;
            },
            createScriptURL(scriptUrl) {
              return scriptUrl;
            }
          });
        } catch (_) {
          console.warn("TrustedTypes policy " + policyName + " could not be created.");
          return null;
        }
      };
      _createHooksMap = function _createHooksMap2() {
        return {
          afterSanitizeAttributes: [],
          afterSanitizeElements: [],
          afterSanitizeShadowDOM: [],
          beforeSanitizeAttributes: [],
          beforeSanitizeElements: [],
          beforeSanitizeShadowDOM: [],
          uponSanitizeAttribute: [],
          uponSanitizeElement: [],
          uponSanitizeShadowNode: []
        };
      };
      purify = createDOMPurify();
    }
  });

  // src/utils/sanitize.ts
  function sanitizeHtml(html2, ctx) {
    if (!html2) return "";
    let win = null;
    if (ctx && ctx.defaultView) {
      win = ctx.defaultView;
    } else if (ctx && ctx.document) {
      win = ctx;
    } else if (typeof window !== "undefined") {
      win = window;
    }
    if (win) {
      try {
        const DOMPurify = purify(win);
        try {
          DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
            try {
              if (data && data.attrName && data.attrName.startsWith("data-")) {
                data.keepAttr = true;
              }
            } catch (e) {
            }
          });
        } catch (e) {
        }
        return DOMPurify.sanitize(html2, {
          // Use sensible defaults: allow common formatting tags but strip scripts
          ALLOWED_TAGS: [
            "a",
            "b",
            "i",
            "em",
            "strong",
            "u",
            "p",
            "div",
            "span",
            // Common semantic elements: preserve document structure so undo/redo
            // does not flatten header/section/nav into plain content.
            "header",
            "nav",
            "section",
            "main",
            "footer",
            "article",
            "aside",
            "figure",
            "figcaption",
            "time",
            // Interactive / form elements that may appear in content
            "button",
            "input",
            "label",
            "select",
            "option",
            "textarea",
            "details",
            "summary",
            // Allow <style> tags so user/content-provided CSS is preserved
            // when taking snapshots and during undo/redo operations.
            // DOMPurify will still sanitize the contents of style blocks.
            "style",
            // Preserve linked stylesheets so page/editor styling isn't lost
            "link",
            "ul",
            "ol",
            "li",
            "br",
            "hr",
            "blockquote",
            "pre",
            "code",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "img"
          ],
          ALLOWED_ATTR: [
            "href",
            "title",
            "alt",
            "src",
            "class",
            "style",
            // Attributes used by <link> tags
            "rel",
            "type",
            "media"
          ],
          // Also allow `id` attributes so element ids survive sanitization.
          ADD_ATTR: ["id"]
        });
      } catch (e) {
      }
    }
    return html2.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/on[a-z]+=\"[^"]*\"/gi, "");
  }
  var init_sanitize = __esm({
    "src/utils/sanitize.ts"() {
      "use strict";
      init_purify_es();
    }
  });

  // src/core/state.ts
  var state_exports = {};
  __export(state_exports, {
    _getCurrentEditable: () => _getCurrentEditable,
    _getDoc: () => _getDoc,
    _getRedoStack: () => _getRedoStack,
    _getUndoStack: () => _getUndoStack,
    _restoreSelection: () => _restoreSelection,
    _saveSelection: () => _saveSelection,
    _setCurrentEditable: () => _setCurrentEditable,
    _setDoc: () => _setDoc,
    _setRedoStack: () => _setRedoStack,
    _setUndoStack: () => _setUndoStack,
    pushStandaloneSnapshot: () => pushStandaloneSnapshot,
    setMaxStackSize: () => setMaxStackSize
  });
  function _setDoc(doc) {
    _doc = doc;
  }
  function _getDoc() {
    return _doc;
  }
  function _setUndoStack(stack) {
    _undoStack = stack;
    editorEventEmitter.emit({
      type: "undoStateChanged",
      timestamp: Date.now(),
      data: { canUndo: _undoStack.length > 1 }
    });
  }
  function _getUndoStack() {
    return _undoStack;
  }
  function _setRedoStack(stack) {
    _redoStack = stack;
    editorEventEmitter.emit({
      type: "redoStateChanged",
      timestamp: Date.now(),
      data: { canRedo: _redoStack.length > 0 }
    });
  }
  function _getRedoStack() {
    return _redoStack;
  }
  function _setCurrentEditable(el) {
    _currentEditable = el;
    editorEventEmitter.emit({
      type: "selectionChanged",
      timestamp: Date.now(),
      data: { element: el == null ? void 0 : el.tagName }
    });
  }
  function _getCurrentEditable() {
    return _currentEditable;
  }
  function _saveSelection() {
    try {
      if (!_doc) return;
      const sel = _doc.getSelection();
      if (!sel) return;
      if (!sel.rangeCount) return;
      _savedRange = sel.getRangeAt(0).cloneRange();
    } catch (e) {
    }
  }
  function _restoreSelection() {
    try {
      if (!_doc) return;
      const sel = _doc.getSelection();
      if (!sel) return;
      if (_savedRange) {
        sel.removeAllRanges();
        sel.addRange(_savedRange);
        _savedRange = null;
      }
    } catch (e) {
    }
  }
  function pushStandaloneSnapshot(clearRedo = true) {
    if (!_doc) return;
    const clone2 = _doc.documentElement.cloneNode(true);
    const toolbarNode = clone2.querySelector(`#${TOOLBAR_ID}`);
    if (toolbarNode && toolbarNode.parentNode)
      toolbarNode.parentNode.removeChild(toolbarNode);
    const styleNode = clone2.querySelector(`#${STYLE_ID}`);
    if (styleNode && styleNode.parentNode)
      styleNode.parentNode.removeChild(styleNode);
    try {
      const editableNodes = clone2.querySelectorAll(
        "[contenteditable], ." + CLASS_EDITABLE + ", ." + CLASS_ACTIVE
      );
      editableNodes.forEach((el) => {
        try {
          if (el instanceof Element) {
            if (el.hasAttribute("contenteditable"))
              el.removeAttribute("contenteditable");
            if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
            el.classList.remove(CLASS_EDITABLE, CLASS_ACTIVE);
          }
        } catch (e) {
        }
      });
    } catch (e) {
    }
    try {
      const scripts = Array.from(
        clone2.querySelectorAll("script")
      );
      scripts.forEach((s) => {
        var _a;
        try {
          const code = s.textContent || "";
          const attrs = {};
          Array.from(s.attributes).forEach((a) => attrs[a.name] = a.value);
          const placeholder = clone2.ownerDocument.createElement("span");
          try {
            const safe = typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(code))) : encodeURIComponent(code);
            placeholder.setAttribute("data-rhe-script", safe);
          } catch (e) {
            placeholder.setAttribute("data-rhe-script", encodeURIComponent(code));
          }
          if (Object.keys(attrs).length) {
            placeholder.setAttribute(
              "data-rhe-script-attrs",
              encodeURIComponent(JSON.stringify(attrs))
            );
          }
          const parentMarker = s.closest("[data-rhe-id]");
          if (parentMarker && parentMarker.getAttribute("data-rhe-id")) {
            placeholder.setAttribute(
              "data-rhe-script-parent",
              parentMarker.getAttribute("data-rhe-id")
            );
          } else {
            placeholder.setAttribute("data-rhe-script-parent", "head");
          }
          (_a = s.parentNode) == null ? void 0 : _a.replaceChild(placeholder, s);
        } catch (e) {
        }
      });
    } catch (e) {
    }
    const snapRaw = clone2.outerHTML;
    const snap = sanitizeHtml(snapRaw, _doc);
    if (!_undoStack.length || _undoStack[_undoStack.length - 1] !== snap) {
      _undoStack.push(snap);
      if (_undoStack.length > _maxStackSize) _undoStack.shift();
      editorEventEmitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
        data: { htmlLength: snap.length }
      });
    }
    if (clearRedo) {
      _redoStack = [];
      editorEventEmitter.emit({
        type: "redoStateChanged",
        timestamp: Date.now(),
        data: { canRedo: false }
      });
    }
  }
  function setMaxStackSize(size) {
    _maxStackSize = Math.max(1, size);
  }
  var _doc, _undoStack, _redoStack, _currentEditable, _savedRange, _maxStackSize;
  var init_state = __esm({
    "src/core/state.ts"() {
      "use strict";
      init_events();
      init_constants();
      init_sanitize();
      _doc = null;
      _undoStack = [];
      _redoStack = [];
      _currentEditable = null;
      _savedRange = null;
      _maxStackSize = DEFAULT_MAX_STACK;
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    RichHtmlEditor: () => RichHtmlEditor,
    editorEventEmitter: () => editorEventEmitter,
    getCleanHTML: () => getCleanHTML,
    getEditorEventEmitter: () => getEditorEventEmitter,
    initRichEditor: () => initRichEditor
  });

  // src/core/editor.ts
  init_state();

  // src/dom/styles.ts
  init_constants();
  function injectStyles(doc) {
    const styleId = STYLE_ID;
    let styleEl = doc.getElementById(styleId);
    const css = `
/* Scoped conservative reset for editor UI root to prevent template styles leaking in */
#rhe-editor-root {
  box-sizing: border-box;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#rhe-editor-root *,
#rhe-editor-root *::before,
#rhe-editor-root *::after {
  box-sizing: inherit;
}
/* Restore user-agent defaults for native controls inside the root */
#rhe-editor-root button,
#rhe-editor-root input,
#rhe-editor-root textarea,
#rhe-editor-root select {
  all: revert;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}
/* Basic focus visibility for accessibility inside root */
#rhe-editor-root :focus {
  outline: 2px solid Highlight;
  outline-offset: 2px;
}

.${CLASS_EDITABLE}{outline:2px dashed ${HOVER_OUTLINE};cursor:text}
.${CLASS_ACTIVE}{outline:2px solid ${ACTIVE_OUTLINE};cursor:text}
#${TOOLBAR_ID} img{cursor:auto}
/* Make images inside editable regions show a pointer to indicate click/edit */
.${CLASS_EDITABLE} img, .${CLASS_ACTIVE} img { cursor: pointer; }
#${TOOLBAR_ID}{
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${TOOLBAR_BG};
  border-bottom: 1px solid ${TOOLBAR_BORDER};
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(2,6,23,0.08);
  backdrop-filter: blur(6px);
  /* Allow toolbar items to wrap onto multiple lines on narrow screens */
  flex-wrap: wrap;
  justify-content: flex-start;
}
#${TOOLBAR_ID} button{
  padding: 6px 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  outline: none;
  margin-right: 2px;
}
#${TOOLBAR_ID} button[aria-pressed="true"]{
  background: ${BUTTON_ACTIVE_BG};
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(99,102,241,0.12);
}
#${TOOLBAR_ID} button:hover:not(:disabled){
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2,6,23,0.08);
}
#${TOOLBAR_ID} select{
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} input[type="color"]{
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} .color-input-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}

/* Labeled color inputs (e.g. "Text Color <input type=color>") */
#${TOOLBAR_ID} .color-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}
#${TOOLBAR_ID} .color-input-label .color-icon{
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
#${TOOLBAR_ID} .text-color-icon{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 3px solid currentColor;
  transform-origin: center;
}
#${TOOLBAR_ID} .highlight-icon{
  width: 16px;
  height: 16px;
  display: inline-block;
}
#${TOOLBAR_ID} .color-icon svg{
  width: 16px;
  height: 16px;
  display: block;
}
/* Text color wrapper: A with a small swatch on the right */
#${TOOLBAR_ID} .text-color-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .text-color-wrapper .text-A{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}
#${TOOLBAR_ID} .text-color-wrapper .color-swatch{
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset;
  background: currentColor;
}

/* Highlight wrapper: small colored bar under/behind the A to mimic highlighter */
#${TOOLBAR_ID} .highlight-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
#${TOOLBAR_ID} .highlight-wrapper .highlight-bar{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 8px;
  border-radius: 3px;
  background: #ffeb3b; /* default yellow */
  z-index: 0;
}
#${TOOLBAR_ID} .highlight-wrapper .text-A{
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  padding: 0 4px;
}
#${TOOLBAR_ID} span{
  color: ${INFO_COLOR};
  font-size: 90%;
}

/* Grouping and separators */
#${TOOLBAR_ID} .toolbar-group{
  display: flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .toolbar-group{
  /* groups may wrap internally to avoid overflow on narrow screens */
  flex-wrap: wrap;
}
/* Overflow button + menu styling */
#${TOOLBAR_ID} .toolbar-overflow-btn{
  display: none;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  font-weight: 600;
}
#${TOOLBAR_ID} .toolbar-overflow-menu{
  position: absolute;
  top: calc(100% + 6px);
  right: 12px;
  min-width: 160px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 12px 40px rgba(2,6,23,0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10000;
}
#${TOOLBAR_ID} .toolbar-overflow-menu[hidden]{
  display: none;
}
#${TOOLBAR_ID} .toolbar-sep{
  width: 1px;
  height: 28px;
  background: rgba(15,23,42,0.06);
  margin: 0 8px;
  border-radius: 1px;
}
#${TOOLBAR_ID} .toolbar-spacer{
  flex: 1 1 auto;
}
#${TOOLBAR_ID} button svg{
  width: 16px;
  height: 16px;
  display: block;
  /* Default icon appearance */
  fill: none;
}

/* Active/pressed: switch to filled appearance */
#${TOOLBAR_ID} button[aria-pressed="true"] svg{
  fill: currentColor;
}

/* Focus and accessibility */
#${TOOLBAR_ID} button:focus{
  outline: none;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}

/* Disabled state */
#${TOOLBAR_ID} button:disabled{
  opacity: 0.48;
  cursor: not-allowed;
}
/* Responsive tweaks: reduce spacing and allow horizontal scroll on very small screens */
@media (max-width: 720px){
  #${TOOLBAR_ID}{
    padding: 6px 8px;
    gap: 6px;
  }
  #${TOOLBAR_ID} button,
  #${TOOLBAR_ID} select,
  #${TOOLBAR_ID} input[type="color"]{
    padding: 4px 6px;
    border-radius: 6px;
  }
  /* Hide visual separators to save horizontal space */
  #${TOOLBAR_ID} .toolbar-sep{
    display: none;
  }
  /* Collapse labeled color text visually but preserve accessibility on the input */
  #${TOOLBAR_ID} .color-label{
    font-size: 0;
  }
  #${TOOLBAR_ID} .color-label input{
    font-size: initial;
  }
}
@media (max-width: 420px){
  /* On very small screens prefer a single-line scrollable toolbar */
  #${TOOLBAR_ID}{
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  #${TOOLBAR_ID} .toolbar-group{
    flex: 0 0 auto;
  }
  #${TOOLBAR_ID} button{ margin-right: 6px; }
  /* Show overflow button and hide the groups marked for collapse */
  #${TOOLBAR_ID} .toolbar-overflow-btn{
    display: inline-flex;
  }
  #${TOOLBAR_ID} .collapse-on-small{
    display: none;
  }
}
/* Image editor modal */
.rhe-img-modal-overlay{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2,6,23,0.48);
  z-index: 11000;
}
.rhe-img-modal{
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  width: 360px;
  max-width: calc(100% - 24px);
  box-shadow: 0 24px 60px rgba(2,6,23,0.28);
  font-family: inherit;
}
.rhe-img-modal h3{ margin: 0 0 8px 0; font-size: 16px }
.rhe-img-tabs{ display: flex; gap: 8px; margin-bottom: 12px }
.rhe-img-tabs button{ padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(15,23,42,0.06); background: #fff }
.rhe-img-tabs button.active{ background: #f3f4ff }
.rhe-img-pane{ margin-bottom: 12px }
.rhe-img-pane input[type="file"], .rhe-img-pane input[type="url"]{ width: 100%; padding: 8px; border-radius: 8px; border: 1px solid rgba(15,23,42,0.06) }
.rhe-img-msg{ color: #b91c1c; font-size: 13px; min-height: 18px; margin-top: 8px }
.rhe-img-actions{ display:flex; gap:8px; justify-content:flex-end }
.rhe-img-actions button{ padding: 8px 12px; border-radius: 8px }
.rhe-img-actions button.primary{ background: #6366f1; color: #fff; border: none }

`;
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = styleId;
      doc.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  // src/toolbar/render.ts
  init_constants();

  // src/dom/root.ts
  var EDITOR_ROOT_ID = "rhe-editor-root";
  function getEditorRoot(doc) {
    let root = doc.getElementById(EDITOR_ROOT_ID);
    if (root) return root;
    root = doc.createElement("div");
    root.id = EDITOR_ROOT_ID;
    root.setAttribute("data-rhe-root", "true");
    try {
      if (doc.body && doc.body.firstChild)
        doc.body.insertBefore(root, doc.body.firstChild);
      else if (doc.body) doc.body.appendChild(root);
      else doc.documentElement.appendChild(root);
    } catch (e) {
      try {
        doc.documentElement.appendChild(root);
      } catch (err) {
      }
    }
    return root;
  }

  // src/toolbar/color.ts
  function makeColorInput(doc, options, title, command, initialColor) {
    const input = doc.createElement("input");
    input.type = "color";
    input.className = "toolbar-color-input";
    const wrapper = doc.createElement("label");
    wrapper.className = "color-label";
    wrapper.appendChild(doc.createTextNode(title + " "));
    wrapper.appendChild(input);
    let savedRange = null;
    input.addEventListener("pointerdown", () => {
      const s = doc.getSelection();
      if (s && s.rangeCount) savedRange = s.getRangeAt(0).cloneRange();
    });
    input.onchange = (e) => {
      try {
        const s = doc.getSelection();
        if (savedRange && s) {
          s.removeAllRanges();
          s.addRange(savedRange);
        }
      } catch (err) {
      }
      options.onCommand(command, e.target.value);
      savedRange = null;
    };
    function rgbToHex(input2) {
      if (!input2) return null;
      const v = input2.trim();
      if (v.startsWith("#")) {
        if (v.length === 4) {
          return ("#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
        }
        return v.toLowerCase();
      }
      const rgbMatch = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (rgbMatch) {
        const r = Number(rgbMatch[1]);
        const g = Number(rgbMatch[2]);
        const b = Number(rgbMatch[3]);
        const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toLowerCase();
        return hex;
      }
      return null;
    }
    const setColor = (val) => {
      if (!val) return;
      const hex = rgbToHex(val) || val;
      try {
        if (hex && hex.startsWith("#") && input.value !== hex) {
          input.value = hex;
        }
      } catch (e) {
      }
    };
    if (initialColor) setColor(initialColor);
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      setColor(val);
    });
    input.title = title;
    input.setAttribute("aria-label", title);
    return wrapper;
  }

  // src/toolbar/overflow.ts
  function setupOverflow(doc, toolbar, options, format, helpers) {
    const overflowBtn = doc.createElement("button");
    overflowBtn.type = "button";
    overflowBtn.className = "toolbar-overflow-btn";
    overflowBtn.title = "More";
    overflowBtn.setAttribute("aria-label", "More toolbar actions");
    overflowBtn.setAttribute("aria-haspopup", "true");
    overflowBtn.setAttribute("aria-expanded", "false");
    overflowBtn.tabIndex = 0;
    overflowBtn.innerHTML = "\u22EF";
    const overflowMenu = doc.createElement("div");
    overflowMenu.className = "toolbar-overflow-menu";
    overflowMenu.setAttribute("role", "menu");
    overflowMenu.hidden = true;
    function openOverflow() {
      overflowMenu.hidden = false;
      overflowBtn.setAttribute("aria-expanded", "true");
      const first = overflowMenu.querySelector(
        "button, select, input"
      );
      first == null ? void 0 : first.focus();
    }
    function closeOverflow() {
      overflowMenu.hidden = true;
      overflowBtn.setAttribute("aria-expanded", "false");
      overflowBtn.focus();
    }
    overflowBtn.addEventListener("click", () => {
      if (overflowMenu.hidden) openOverflow();
      else closeOverflow();
    });
    overflowBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (overflowMenu.hidden) openOverflow();
        else closeOverflow();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (overflowMenu.hidden) openOverflow();
      }
    });
    overflowMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeOverflow();
      }
    });
    doc.addEventListener("pointerdown", (ev) => {
      if (!overflowMenu.hidden && !overflowMenu.contains(ev.target) && ev.target !== overflowBtn) {
        closeOverflow();
      }
    });
    overflowMenu.appendChild(
      helpers.makeSelect(
        "Format",
        "formatBlock",
        window.RHE_FORMAT_OPTIONS || [],
        format.formatBlock
      )
    );
    overflowMenu.appendChild(
      helpers.makeSelect(
        "Font",
        "fontName",
        window.RHE_FONT_OPTIONS || [],
        format.fontName
      )
    );
    overflowMenu.appendChild(
      helpers.makeSelect(
        "Size",
        "fontSize",
        window.RHE_SIZE_OPTIONS || [],
        format.fontSize
      )
    );
    overflowMenu.appendChild(
      helpers.makeColorInput(
        "Text color",
        "foreColor",
        format.foreColor
      )
    );
    overflowMenu.appendChild(
      helpers.makeColorInput(
        "Highlight color",
        "hiliteColor",
        format.hiliteColor
      )
    );
    overflowMenu.appendChild(helpers.makeButton("Link", "Insert link", "link"));
    const overflowWrap = helpers.makeGroup();
    overflowWrap.className = "toolbar-group toolbar-overflow-wrap";
    overflowWrap.appendChild(overflowBtn);
    overflowWrap.appendChild(overflowMenu);
    toolbar.appendChild(overflowWrap);
  }

  // src/toolbar/buttons.ts
  init_state();
  function makeButton(doc, options, label, title, command, value, isActive, disabled) {
    const btn = doc.createElement("button");
    btn.type = "button";
    if (label && label.trim().startsWith("<")) {
      btn.innerHTML = label;
    } else {
      btn.textContent = label;
    }
    btn.title = title;
    btn.setAttribute("aria-label", title);
    if (typeof isActive !== "undefined")
      btn.setAttribute("aria-pressed", String(!!isActive));
    btn.tabIndex = 0;
    if (disabled) btn.disabled = true;
    btn.onclick = () => {
      _restoreSelection();
      options.onCommand(command, value);
    };
    btn.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      _saveSelection();
    });
    btn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        btn.click();
      }
    });
    return btn;
  }
  function makeGroup(doc) {
    const g = doc.createElement("div");
    g.className = "toolbar-group";
    return g;
  }
  function makeSep(doc) {
    const s = doc.createElement("div");
    s.className = "toolbar-sep";
    return s;
  }

  // src/toolbar/selects.ts
  function makeSelect(doc, options, title, command, optionsList, initialValue) {
    const select = doc.createElement("select");
    select.title = title;
    select.setAttribute("aria-label", title);
    select.appendChild(new Option(title, "", true, true));
    for (const opt of optionsList) {
      select.appendChild(new Option(opt.label, opt.value));
    }
    try {
      if (initialValue) select.value = initialValue;
    } catch (e) {
    }
    select.onchange = (e) => {
      const val = e.target.value;
      options.onCommand(command, val);
      select.selectedIndex = 0;
    };
    return select;
  }

  // src/toolbar/navigation.ts
  function setupNavigation(toolbar) {
    toolbar.addEventListener("keydown", (e) => {
      const focusable = Array.from(
        toolbar.querySelectorAll(
          "button, select, input, [tabindex]"
        )
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const idx = focusable.indexOf(document.activeElement);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = focusable[Math.min(focusable.length - 1, Math.max(0, idx + 1))];
        next == null ? void 0 : next.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = focusable[Math.max(0, idx - 1)] || focusable[0];
        prev == null ? void 0 : prev.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        focusable[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    });
  }

  // src/toolbar/render.ts
  function injectToolbar(doc, options) {
    const existing = doc.getElementById(TOOLBAR_ID);
    if (existing) existing.remove();
    const toolbar = doc.createElement("div");
    toolbar.id = TOOLBAR_ID;
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Rich text editor toolbar");
    const makeButton2 = (label, title, command, value, isActive, disabled) => makeButton(
      doc,
      { onCommand: options.onCommand },
      label,
      title,
      command,
      value,
      isActive,
      disabled
    );
    const makeSelect2 = (title, command, optionsList, initialValue) => makeSelect(
      doc,
      { onCommand: options.onCommand },
      title,
      command,
      optionsList,
      initialValue
    );
    const format = options.getFormatState();
    const makeGroup2 = () => makeGroup(doc);
    const makeSep2 = () => makeSep(doc);
    const undoBtn = makeButton2(
      LABEL_UNDO,
      "Undo",
      "undo",
      void 0,
      false,
      !options.canUndo()
    );
    undoBtn.onclick = () => options.onUndo();
    const redoBtn = makeButton2(
      LABEL_REDO,
      "Redo",
      "redo",
      void 0,
      false,
      !options.canRedo()
    );
    redoBtn.onclick = () => options.onRedo();
    const grp1 = makeGroup2();
    grp1.appendChild(undoBtn);
    grp1.appendChild(redoBtn);
    toolbar.appendChild(grp1);
    toolbar.appendChild(makeSep2());
    const grp2 = makeGroup2();
    grp2.className = "toolbar-group collapse-on-small";
    grp2.appendChild(
      makeSelect2(
        "Format",
        "formatBlock",
        FORMAT_OPTIONS,
        format.formatBlock
      )
    );
    grp2.appendChild(
      makeSelect2("Font", "fontName", FONT_OPTIONS, format.fontName)
    );
    grp2.appendChild(
      makeSelect2("Size", "fontSize", SIZE_OPTIONS, format.fontSize)
    );
    toolbar.appendChild(grp2);
    toolbar.appendChild(makeSep2());
    const grp3 = makeGroup2();
    grp3.appendChild(
      makeButton2(LABEL_BOLD, "Bold", "bold", void 0, format.bold)
    );
    grp3.appendChild(
      makeButton2(LABEL_ITALIC, "Italic", "italic", void 0, format.italic)
    );
    grp3.appendChild(
      makeButton2(
        LABEL_UNDERLINE,
        "Underline",
        "underline",
        void 0,
        format.underline
      )
    );
    grp3.appendChild(makeButton2(LABEL_STRIKETHROUGH, "Strikethrough", "strike"));
    grp3.appendChild(
      makeButton2(LABEL_CLEAR_FORMAT, "Clear formatting", "clearFormat")
    );
    grp3.appendChild(
      makeButton2(
        LABEL_UNORDERED_LIST,
        "Unordered list",
        "unorderedList",
        void 0,
        format.listType === "ul"
      )
    );
    grp3.appendChild(
      makeButton2(
        LABEL_ORDERED_LIST,
        "Ordered list",
        "orderedList",
        void 0,
        format.listType === "ol"
      )
    );
    toolbar.appendChild(grp3);
    toolbar.appendChild(makeSep2());
    const grp4 = makeGroup2();
    grp4.appendChild(makeButton2(LABEL_ALIGN_LEFT, "Align left", "align", "left"));
    grp4.appendChild(
      makeButton2(LABEL_ALIGN_CENTER, "Align center", "align", "center")
    );
    grp4.appendChild(
      makeButton2(LABEL_ALIGN_RIGHT, "Align right", "align", "right")
    );
    toolbar.appendChild(grp4);
    toolbar.appendChild(makeSep2());
    const grp5 = makeGroup2();
    grp5.className = "toolbar-group collapse-on-small";
    grp5.appendChild(
      makeColorInput(
        doc,
        options,
        "Text color",
        "foreColor",
        format.foreColor
      )
    );
    grp5.appendChild(
      makeColorInput(
        doc,
        options,
        "Highlight color",
        "hiliteColor",
        format.hiliteColor
      )
    );
    toolbar.appendChild(grp5);
    toolbar.appendChild(makeSep2());
    const grp6 = makeGroup2();
    grp6.className = "toolbar-group collapse-on-small";
    grp6.appendChild(makeButton2(LABEL_LINK, "Insert link", "link"));
    toolbar.appendChild(grp6);
    setupOverflow(doc, toolbar, options, format, {
      makeSelect: makeSelect2,
      makeColorInput: (title, command, initial) => makeColorInput(doc, options, title, command, initial),
      makeButton: makeButton2,
      makeGroup: makeGroup2
    });
    setupNavigation(toolbar);
    try {
      const root = getEditorRoot(doc);
      root.insertBefore(toolbar, root.firstChild);
    } catch (e) {
      doc.body.insertBefore(toolbar, doc.body.firstChild);
    }
  }

  // src/dom/handlers.ts
  init_state();

  // src/dom/candidates.ts
  function isEditableCandidate(el) {
    if (!el) return false;
    const tag = el.tagName;
    const DISALLOWED = [
      "HTML",
      "HEAD",
      "BODY",
      "SCRIPT",
      "STYLE",
      "LINK",
      "META",
      "NOSCRIPT"
    ];
    if (DISALLOWED.includes(tag)) return false;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
    return true;
  }

  // src/dom/imageEditor.ts
  init_constants();
  init_state();
  function createModal(doc) {
    const overlay = doc.createElement("div");
    overlay.className = "rhe-img-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    const modal = doc.createElement("div");
    modal.className = "rhe-img-modal";
    const title = doc.createElement("h3");
    title.textContent = "Edit image";
    const tabs = doc.createElement("div");
    tabs.className = "rhe-img-tabs";
    const uploadBtn = doc.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.textContent = "Upload file";
    uploadBtn.className = "active";
    const urlBtn = doc.createElement("button");
    urlBtn.type = "button";
    urlBtn.textContent = "Image URL";
    tabs.appendChild(uploadBtn);
    tabs.appendChild(urlBtn);
    const uploadPane = doc.createElement("div");
    uploadPane.className = "rhe-img-pane rhe-img-pane-upload";
    const fileInput = doc.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.width = "100%";
    fileInput.style.boxSizing = "border-box";
    uploadPane.appendChild(fileInput);
    const uploadMsg = doc.createElement("div");
    uploadMsg.className = "rhe-img-msg";
    uploadPane.appendChild(uploadMsg);
    const urlPane = doc.createElement("div");
    urlPane.className = "rhe-img-pane rhe-img-pane-url";
    urlPane.style.display = "none";
    const urlInput = doc.createElement("input");
    urlInput.type = "url";
    urlInput.placeholder = "https://example.com/image.jpg";
    urlInput.style.width = "100%";
    urlInput.style.boxSizing = "border-box";
    urlPane.appendChild(urlInput);
    const urlMsg = doc.createElement("div");
    urlMsg.className = "rhe-img-msg";
    urlPane.appendChild(urlMsg);
    const actions = doc.createElement("div");
    actions.className = "rhe-img-actions";
    const cancel = doc.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    const apply2 = doc.createElement("button");
    apply2.type = "button";
    apply2.textContent = "Apply";
    apply2.className = "primary";
    actions.appendChild(cancel);
    actions.appendChild(apply2);
    modal.appendChild(title);
    modal.appendChild(tabs);
    modal.appendChild(uploadPane);
    modal.appendChild(urlPane);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    uploadBtn.addEventListener("click", () => {
      uploadBtn.classList.add("active");
      urlBtn.classList.remove("active");
      uploadPane.style.display = "block";
      urlPane.style.display = "none";
    });
    urlBtn.addEventListener("click", () => {
      urlBtn.classList.add("active");
      uploadBtn.classList.remove("active");
      uploadPane.style.display = "none";
      urlPane.style.display = "block";
    });
    return {
      overlay,
      fileInput,
      uploadMsg,
      urlInput,
      urlMsg,
      cancel,
      apply: apply2
    };
  }
  function validateUrl(u) {
    try {
      const url = new URL(u);
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      return true;
    } catch (err) {
      return false;
    }
  }
  function openImageEditor(doc, img) {
    const existing = doc.querySelector(".rhe-img-modal-overlay");
    if (existing) return;
    const { overlay, fileInput, uploadMsg, urlInput, urlMsg, cancel, apply: apply2 } = createModal(doc);
    function close() {
      overlay.remove();
    }
    fileInput.addEventListener("change", () => {
      uploadMsg.textContent = "";
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (!f.type.startsWith("image/")) {
        uploadMsg.textContent = "Invalid file type";
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        uploadMsg.textContent = "File is larger than 1 MB";
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => {
        uploadMsg.textContent = "Failed to read file";
      };
      reader.onload = () => {
        const result = reader.result;
        if (!result) {
          uploadMsg.textContent = "Failed to read file";
          return;
        }
        img.src = result;
        try {
          pushStandaloneSnapshot();
        } catch (err) {
        }
        close();
      };
      reader.readAsDataURL(f);
    });
    apply2.addEventListener("click", async () => {
      urlMsg.textContent = "";
      const val = urlInput.value.trim();
      if (val) {
        if (!validateUrl(val)) {
          urlMsg.textContent = "Enter a valid http/https URL";
          return;
        }
        try {
          const head = await fetch(val, { method: "HEAD" });
          const ct = head.headers.get("content-type");
          const cl = head.headers.get("content-length");
          if (ct && !ct.startsWith("image/")) {
            urlMsg.textContent = "URL does not point to an image";
            return;
          }
          if (cl && Number(cl) > MAX_FILE_SIZE) {
            urlMsg.textContent = "Image appears larger than 1 MB";
            return;
          }
          img.src = val;
          try {
            pushStandaloneSnapshot();
          } catch (err) {
          }
          close();
          return;
        } catch (err) {
          img.src = val;
          try {
            pushStandaloneSnapshot();
          } catch (err2) {
          }
          close();
          return;
        }
      } else {
        close();
      }
    });
    cancel.addEventListener("click", () => close());
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    try {
      const root = getEditorRoot(doc);
      root.appendChild(overlay);
    } catch (e) {
      doc.body.appendChild(overlay);
    }
    fileInput.focus();
  }

  // src/dom/format.ts
  function computeFormatState(doc) {
    var _a, _b;
    try {
      const s = doc.getSelection();
      let el = null;
      if (s && s.anchorNode)
        el = s.anchorNode.nodeType === Node.ELEMENT_NODE ? s.anchorNode : s.anchorNode.parentElement;
      if (!el)
        return {
          bold: false,
          italic: false,
          underline: false,
          foreColor: null,
          hiliteColor: null,
          fontName: null,
          fontSize: null,
          formatBlock: null,
          listType: null
        };
      const computed = (_a = doc.defaultView) == null ? void 0 : _a.getComputedStyle(el);
      const bold = !!(el.closest("strong, b") || computed && (computed.fontWeight === "700" || Number(computed.fontWeight) >= 700));
      const italic = !!(el.closest("em, i") || computed && computed.fontStyle === "italic");
      const underline = !!(el.closest("u") || computed && (computed.textDecorationLine || "").includes("underline"));
      const foreColor = ((_b = el.closest("font[color]")) == null ? void 0 : _b.getAttribute(
        "color"
      )) || computed && computed.color || null;
      const mark = el.closest("mark");
      const hiliteColor = mark && (mark.getAttribute("style") || "") || (computed && computed.backgroundColor && computed.backgroundColor !== "rgba(0, 0, 0, 0)" ? computed.backgroundColor : null);
      const fontName = computed && computed.fontFamily || null;
      const fontSize = computed && computed.fontSize || null;
      let blockEl = el;
      while (blockEl && blockEl.parentElement) {
        const tag = blockEl.tagName;
        if ([
          "P",
          "DIV",
          "SECTION",
          "ARTICLE",
          "LI",
          "TD",
          "BLOCKQUOTE",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6"
        ].includes(tag)) {
          break;
        }
        blockEl = blockEl.parentElement;
      }
      const formatBlock = blockEl ? blockEl.tagName.toLowerCase() : null;
      let listType = null;
      try {
        if (blockEl && blockEl.tagName === "LI") {
          const list = blockEl.closest("ul,ol");
          if (list) listType = list.tagName.toLowerCase();
        } else {
          const possible = el.closest("ul,ol");
          if (possible) listType = possible.tagName.toLowerCase();
        }
      } catch (e) {
        listType = null;
      }
      return {
        bold,
        italic,
        underline,
        foreColor,
        hiliteColor,
        fontName,
        fontSize,
        formatBlock,
        listType
      };
    } catch (err) {
      return {
        bold: false,
        italic: false,
        underline: false,
        foreColor: null,
        hiliteColor: null,
        fontName: null,
        fontSize: null,
        formatBlock: null,
        listType: null
      };
    }
  }
  function getElementLabel(el) {
    if (!el) return null;
    const id = el.id ? `#${el.id}` : "";
    const cls = el.className ? `.${String(el.className).split(" ")[0]}` : "";
    const tag = el.tagName.toLowerCase();
    return `${tag}${id}${cls}`;
  }

  // src/core/sanitizeURL.ts
  function sanitizeURL(url) {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (trimmed.toLowerCase().startsWith("javascript:") || trimmed.toLowerCase().startsWith("data:")) {
      console.warn("Blocked potentially dangerous URL protocol");
      return "";
    }
    if (!trimmed.startsWith("http") && !trimmed.startsWith("#")) {
      return "https://" + trimmed;
    }
    return trimmed;
  }

  // src/core/history.ts
  init_state();
  init_sanitize();
  function handleUndo() {
    try {
      const doc = _getDoc();
      if (!doc) {
        console.warn(
          "[rich-html-editor] handleUndo called before initialization"
        );
        return;
      }
      if (_getUndoStack().length < 2) return;
      const undoStack = _getUndoStack();
      const redoStack = _getRedoStack();
      const current = undoStack.pop();
      redoStack.push(current);
      const prev = undoStack[undoStack.length - 1];
      if (!doc.documentElement) {
        throw new Error("Document is missing documentElement");
      }
      const safe = sanitizeHtml(prev.replace(/^<!doctype html>\n?/i, ""), doc);
      try {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(safe, "text/html");
        if (parsed && parsed.body && doc.body) {
          const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
          if (parsedEls && parsedEls.length) {
            const loadPromises = [];
            parsedEls.forEach((pe) => {
              const id = pe.getAttribute("data-rhe-id");
              if (!id) return;
              const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
              if (!local) return;
              try {
                Array.from(local.attributes).forEach((a) => {
                  if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
                });
                Array.from(pe.attributes).forEach((a) => {
                  if (a.name !== "data-rhe-id")
                    local.setAttribute(a.name, a.value);
                });
              } catch (err) {
              }
              try {
                local.innerHTML = pe.innerHTML;
              } catch (err) {
              }
              try {
                const placeholders = pe.querySelectorAll("[data-rhe-script]");
                placeholders.forEach((ph) => {
                  const encoded = ph.getAttribute("data-rhe-script") || "";
                  let code = "";
                  try {
                    code = typeof atob !== "undefined" ? decodeURIComponent(escape(atob(encoded))) : decodeURIComponent(encoded);
                  } catch (e) {
                    try {
                      code = decodeURIComponent(encoded);
                    } catch (er) {
                      code = "";
                    }
                  }
                  const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                  let attrs = {};
                  if (attrsRaw) {
                    try {
                      attrs = JSON.parse(decodeURIComponent(attrsRaw));
                    } catch (e) {
                      attrs = {};
                    }
                  }
                  const parentId = ph.getAttribute("data-rhe-script-parent");
                  try {
                    const s = doc.createElement("script");
                    try {
                      s.type = "text/javascript";
                      s.async = false;
                    } catch (err) {
                    }
                    Object.keys(attrs).forEach(
                      (k) => s.setAttribute(k, attrs[k])
                    );
                    if (attrs.src) {
                      const p = new Promise((resolve) => {
                        s.addEventListener("load", () => resolve());
                        s.addEventListener("error", () => resolve());
                      });
                      loadPromises.push(p);
                      s.src = attrs.src;
                    } else {
                      s.textContent = code;
                    }
                    if (parentId === "head") {
                      doc.head.appendChild(s);
                    } else {
                      const target = doc.body.querySelector(
                        `[data-rhe-id="${parentId}"]`
                      );
                      if (target) target.appendChild(s);
                      else doc.body.appendChild(s);
                    }
                  } catch (e) {
                  }
                });
              } catch (e) {
              }
            });
            try {
              if (loadPromises.length) {
                const waiter = Promise.allSettled ? Promise.allSettled(loadPromises) : Promise.all(
                  loadPromises.map((p) => p.catch(() => void 0))
                );
                waiter.then(() => {
                  try {
                    doc.dispatchEvent(new Event("rhe:scripts-restored"));
                  } catch (e) {
                  }
                });
              } else {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                }
              }
            } catch (e) {
            }
          } else {
            doc.body.innerHTML = parsed.body.innerHTML;
          }
        } else {
          doc.documentElement.innerHTML = safe;
        }
      } catch (err) {
        doc.documentElement.innerHTML = safe;
      }
      injectStyles(doc);
      try {
        doc.dispatchEvent(new Event("selectionchange"));
      } catch (err) {
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Undo failed:", message);
    }
  }
  function handleRedo() {
    try {
      const doc = _getDoc();
      if (!doc) {
        console.warn(
          "[rich-html-editor] handleRedo called before initialization"
        );
        return;
      }
      if (!_getRedoStack().length) return;
      const undoStack = _getUndoStack();
      const redoStack = _getRedoStack();
      const next = redoStack.pop();
      undoStack.push(next);
      if (!doc.documentElement) {
        throw new Error("Document is missing documentElement");
      }
      const safeNext = sanitizeHtml(
        next.replace(/^<!doctype html>\n?/i, ""),
        doc
      );
      try {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(safeNext, "text/html");
        if (parsed && parsed.body && doc.body) {
          const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
          if (parsedEls && parsedEls.length) {
            const loadPromises = [];
            parsedEls.forEach((pe) => {
              const id = pe.getAttribute("data-rhe-id");
              if (!id) return;
              const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
              if (!local) return;
              try {
                Array.from(local.attributes).forEach((a) => {
                  if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
                });
                Array.from(pe.attributes).forEach((a) => {
                  if (a.name !== "data-rhe-id")
                    local.setAttribute(a.name, a.value);
                });
              } catch (err) {
              }
              try {
                local.innerHTML = pe.innerHTML;
              } catch (err) {
              }
              try {
                const placeholders = pe.querySelectorAll("[data-rhe-script]");
                placeholders.forEach((ph) => {
                  const encoded = ph.getAttribute("data-rhe-script") || "";
                  let code = "";
                  try {
                    code = typeof atob !== "undefined" ? decodeURIComponent(escape(atob(encoded))) : decodeURIComponent(encoded);
                  } catch (e) {
                    try {
                      code = decodeURIComponent(encoded);
                    } catch (er) {
                      code = "";
                    }
                  }
                  const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                  let attrs = {};
                  if (attrsRaw) {
                    try {
                      attrs = JSON.parse(decodeURIComponent(attrsRaw));
                    } catch (e) {
                      attrs = {};
                    }
                  }
                  const parentId = ph.getAttribute("data-rhe-script-parent");
                  try {
                    const s = doc.createElement("script");
                    try {
                      s.type = "text/javascript";
                      s.async = false;
                    } catch (err) {
                    }
                    Object.keys(attrs).forEach(
                      (k) => s.setAttribute(k, attrs[k])
                    );
                    if (attrs.src) {
                      const p = new Promise((resolve) => {
                        s.addEventListener("load", () => resolve());
                        s.addEventListener("error", () => resolve());
                      });
                      loadPromises.push(p);
                      s.src = attrs.src;
                    } else {
                      s.textContent = code;
                    }
                    if (parentId === "head") {
                      doc.head.appendChild(s);
                    } else {
                      const target = doc.body.querySelector(
                        `[data-rhe-id="${parentId}"]`
                      );
                      if (target) target.appendChild(s);
                      else doc.body.appendChild(s);
                    }
                  } catch (e) {
                  }
                });
              } catch (e) {
              }
            });
            try {
              if (loadPromises.length) {
                const waiter = Promise.allSettled ? Promise.allSettled(loadPromises) : Promise.all(
                  loadPromises.map((p) => p.catch(() => void 0))
                );
                waiter.then(() => {
                  try {
                    doc.dispatchEvent(new Event("rhe:scripts-restored"));
                  } catch (e) {
                  }
                });
              } else {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                }
              }
            } catch (e) {
            }
          } else {
            doc.body.innerHTML = parsed.body.innerHTML;
          }
        } else {
          doc.documentElement.innerHTML = safeNext;
        }
      } catch (err) {
        doc.documentElement.innerHTML = safeNext;
      }
      injectStyles(doc);
      try {
        doc.dispatchEvent(new Event("selectionchange"));
      } catch (err) {
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Redo failed:", message);
    }
  }

  // src/core/formatActions.ts
  init_state();
  function handleToolbarCommand(command, value) {
    try {
      const doc = _getDoc();
      if (!doc) {
        console.warn(
          "[rich-html-editor] handleToolbarCommand called before initialization"
        );
        return;
      }
      if (command === "undo") return;
      if (command === "redo") return;
      if (command === "link") {
        const url = window.prompt("Enter URL (https://...):", "https://");
        if (url) {
          const sanitized = sanitizeURL(url);
          if (sanitized) applyStandaloneCommand("link", sanitized);
        }
        return;
      }
      applyStandaloneCommand(command, value);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Command handler failed:", message);
    }
  }
  function applyStandaloneCommand(command, value) {
    try {
      const doc = _getDoc();
      if (!doc) {
        console.warn(
          "[rich-html-editor] applyStandaloneCommand called before initialization"
        );
        return;
      }
      if (command === "bold") wrapSelectionWithElement(doc, "strong");
      else if (command === "italic") wrapSelectionWithElement(doc, "em");
      else if (command === "underline") wrapSelectionWithElement(doc, "u");
      else if (command === "strike") wrapSelectionWithElement(doc, "s");
      else if (command === "fontName")
        wrapSelectionWithElement(doc, "span", { fontFamily: value });
      else if (command === "fontSize") {
        const raw = value || "14";
        const n = parseInt(raw, 10);
        const sz = Number.isFinite(n) ? `${n}px` : raw;
        wrapSelectionWithElement(doc, "span", { fontSize: sz });
      } else if (command === "link") {
        const sel = doc.getSelection();
        if (!sel || !sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        const content = range.extractContents();
        const a = doc.createElement("a");
        a.href = sanitizeURL(value || "#");
        a.appendChild(content);
        a.dataset.rheFormat = "true";
        range.insertNode(a);
      } else if (command === "foreColor")
        wrapSelectionWithElement(doc, "span", { color: value });
      else if (command === "hiliteColor")
        wrapSelectionWithElement(doc, "span", { backgroundColor: value });
      else if (command === "align") {
        const sel = doc.getSelection();
        const node = (sel == null ? void 0 : sel.anchorNode) || null;
        const block = findBlockAncestor(node);
        if (block) block.style.textAlign = value || "left";
        else wrapSelectionWithElement(doc, "div", { textAlign: value });
      } else if (command === "formatBlock") {
        const sel = doc.getSelection();
        const node = (sel == null ? void 0 : sel.anchorNode) || null;
        const block = findBlockAncestor(node);
        const tag = (value || "p").toLowerCase();
        if (block && block.parentElement) {
          const newEl = doc.createElement(tag);
          newEl.className = block.className || "";
          while (block.firstChild) newEl.appendChild(block.firstChild);
          newEl.dataset.rheFormat = "true";
          block.parentElement.replaceChild(newEl, block);
        } else {
          wrapSelectionWithElement(doc, tag);
        }
      } else if (command === "unorderedList" || command === "orderedList") {
        const tag = command === "unorderedList" ? "ul" : "ol";
        toggleList(doc, tag);
      } else if (command === "clearFormat") {
        clearSelectionFormatting(doc);
      }
      pushStandaloneSnapshot();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Apply command failed:", message);
    }
  }
  function wrapSelectionWithElement(doc, tagName, style) {
    const sel = doc.getSelection();
    if (!sel) return;
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      const el = doc.createElement(tagName);
      if (style) Object.assign(el.style, style);
      el.dataset.rheFormat = "true";
      const zw = doc.createTextNode("\u200B");
      el.appendChild(zw);
      range.insertNode(el);
      const newRange2 = doc.createRange();
      newRange2.setStart(zw, 1);
      newRange2.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange2);
      return;
    }
    const content = range.extractContents();
    const wrapper = doc.createElement(tagName);
    if (style) Object.assign(wrapper.style, style);
    wrapper.dataset.rheFormat = "true";
    wrapper.appendChild(content);
    range.insertNode(wrapper);
    sel.removeAllRanges();
    const newRange = doc.createRange();
    newRange.selectNodeContents(wrapper);
    sel.addRange(newRange);
  }
  function toggleList(doc, listTag) {
    var _a, _b;
    const sel = doc.getSelection();
    if (!sel || !sel.rangeCount) return;
    const node = sel.anchorNode || null;
    const block = findBlockAncestor(node);
    if (block && block.tagName === "LI" && block.parentElement) {
      const parentList = block.parentElement;
      const parentTag = parentList.tagName.toLowerCase();
      if (parentTag === listTag) {
        const frag = doc.createDocumentFragment();
        Array.from(parentList.children).forEach((li2) => {
          const p = doc.createElement("p");
          while (li2.firstChild) p.appendChild(li2.firstChild);
          frag.appendChild(p);
        });
        (_a = parentList.parentElement) == null ? void 0 : _a.replaceChild(frag, parentList);
        return;
      } else {
        const newList = doc.createElement(listTag);
        while (parentList.firstChild) newList.appendChild(parentList.firstChild);
        (_b = parentList.parentElement) == null ? void 0 : _b.replaceChild(newList, parentList);
        return;
      }
    }
    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      const list2 = doc.createElement(listTag);
      const li2 = doc.createElement("li");
      const zw = doc.createTextNode("\u200B");
      li2.appendChild(zw);
      list2.appendChild(li2);
      range.insertNode(list2);
      const newRange2 = doc.createRange();
      newRange2.setStart(zw, 1);
      newRange2.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange2);
      return;
    }
    const content = range.extractContents();
    const list = doc.createElement(listTag);
    const li = doc.createElement("li");
    li.appendChild(content);
    list.appendChild(li);
    range.insertNode(list);
    sel.removeAllRanges();
    const newRange = doc.createRange();
    newRange.selectNodeContents(li);
    sel.addRange(newRange);
  }
  function findBlockAncestor(node) {
    let n = node;
    const BLOCKS = [
      "P",
      "DIV",
      "SECTION",
      "ARTICLE",
      "LI",
      "TD",
      "BLOCKQUOTE",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6"
    ];
    while (n) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n;
        if (BLOCKS.includes(el.tagName)) return el;
      }
      n = n.parentNode;
    }
    return null;
  }
  function clearSelectionFormatting(doc) {
    var _a, _b, _c;
    const sel = doc.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    try {
      let getMarkedAncestors2 = function(node) {
        const out = [];
        let n = node && node.nodeType === Node.ELEMENT_NODE ? node : node && node.parentElement;
        while (n) {
          if (n.nodeType === Node.ELEMENT_NODE) {
            const el = n;
            if (el.dataset && el.dataset.rheFormat === "true") out.push(el);
          }
          n = n.parentNode;
        }
        return out;
      };
      var getMarkedAncestors = getMarkedAncestors2;
      const INLINE_WRAP = ["STRONG", "B", "EM", "I", "U", "S", "SPAN", "A"];
      const startAnc = getMarkedAncestors2(range.startContainer);
      const endAnc = getMarkedAncestors2(range.endContainer);
      let outer = null;
      for (let i = startAnc.length - 1; i >= 0; i--) {
        const a = startAnc[i];
        if (endAnc.includes(a)) {
          outer = a;
          break;
        }
      }
      if (!outer) {
        if (startAnc.length) outer = startAnc[startAnc.length - 1];
        else if (endAnc.length) outer = endAnc[endAnc.length - 1];
      }
      if (outer && INLINE_WRAP.includes(outer.tagName)) {
        try {
          range.setStartBefore(outer);
          range.setEndAfter(outer);
        } catch (e) {
        }
      }
    } catch (e) {
    }
    const content = range.extractContents();
    try {
      const container = doc.createElement("div");
      container.appendChild(content);
      let seen = 0;
      while (true) {
        const el = container.querySelector('[data-rhe-format="true"]');
        if (!el) break;
        const tagName = el.tagName;
        if (/^H[1-6]$/.test(tagName)) {
          const p = doc.createElement("p");
          while (el.firstChild) p.appendChild(el.firstChild);
          (_a = el.parentNode) == null ? void 0 : _a.replaceChild(p, el);
        } else {
          try {
            el.style.cssText = "";
          } catch (e) {
          }
          const frag = doc.createDocumentFragment();
          while (el.firstChild) frag.appendChild(el.firstChild);
          (_b = el.parentNode) == null ? void 0 : _b.replaceChild(frag, el);
        }
        seen++;
        if (seen > 200) break;
      }
      const cleaned = doc.createDocumentFragment();
      while (container.firstChild) cleaned.appendChild(container.firstChild);
      var contentToInsert = cleaned;
      while (contentToInsert.firstChild)
        content.appendChild(contentToInsert.firstChild);
    } catch (e) {
    }
    function cleanNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        const isMarked = el.dataset && el.dataset.rheFormat === "true";
        const tag = el.tagName;
        if (isMarked && (tag === "STRONG" || tag === "B" || tag === "EM" || tag === "I" || tag === "U" || tag === "S")) {
          const frag = doc.createDocumentFragment();
          while (el.firstChild) frag.appendChild(el.firstChild);
          const parent2 = el.parentNode;
          if (parent2) parent2.replaceChild(frag, el);
          Array.from(frag.childNodes).forEach((c) => cleanNode(c));
          return;
        }
        if (isMarked && tag === "SPAN") {
          el.style.cssText = "";
          const frag = doc.createDocumentFragment();
          while (el.firstChild) frag.appendChild(el.firstChild);
          const parent2 = el.parentNode;
          if (parent2) parent2.replaceChild(frag, el);
          Array.from(frag.childNodes).forEach((c) => cleanNode(c));
          return;
        }
        if (isMarked && /^H[1-6]$/.test(tag)) {
          const p = doc.createElement("p");
          while (el.firstChild) p.appendChild(el.firstChild);
          const parent2 = el.parentNode;
          if (parent2) parent2.replaceChild(p, el);
          Array.from(p.childNodes).forEach((c) => cleanNode(c));
          return;
        }
        if (isMarked) {
          el.style.cssText = "";
        }
        Array.from(el.childNodes).forEach((c) => cleanNode(c));
      }
    }
    Array.from(content.childNodes).forEach((n) => cleanNode(n));
    const wrapper = doc.createElement("span");
    wrapper.appendChild(content);
    range.insertNode(wrapper);
    sel.removeAllRanges();
    const newRange = doc.createRange();
    newRange.selectNodeContents(wrapper);
    sel.addRange(newRange);
    const parent = wrapper.parentElement;
    if (parent) {
      const frag = doc.createDocumentFragment();
      while (wrapper.firstChild) frag.appendChild(wrapper.firstChild);
      parent.replaceChild(frag, wrapper);
    }
    const root = parent || doc.body;
    const leftover = Array.from(
      root.querySelectorAll('[data-rhe-format="true"]')
    );
    leftover.forEach((el) => {
      var _a2, _b2, _c2;
      const tag = el.tagName;
      if (/^H[1-6]$/.test(tag)) {
        const p = doc.createElement("p");
        while (el.firstChild) p.appendChild(el.firstChild);
        (_a2 = el.parentElement) == null ? void 0 : _a2.replaceChild(p, el);
        return;
      }
      if (el.firstChild) {
        const frag = doc.createDocumentFragment();
        while (el.firstChild) frag.appendChild(el.firstChild);
        (_b2 = el.parentElement) == null ? void 0 : _b2.replaceChild(frag, el);
      } else {
        (_c2 = el.parentElement) == null ? void 0 : _c2.removeChild(el);
      }
    });
    const possibleBlock = findBlockAncestor(range.startContainer);
    if (possibleBlock && possibleBlock.dataset.rheFormat === "true" && /^H[1-6]$/.test(possibleBlock.tagName)) {
      const p = doc.createElement("p");
      while (possibleBlock.firstChild) p.appendChild(possibleBlock.firstChild);
      (_c = possibleBlock.parentElement) == null ? void 0 : _c.replaceChild(p, possibleBlock);
    }
  }

  // src/dom/handlers.ts
  init_constants();
  function attachStandaloneHandlers(doc) {
    try {
      const selector = [
        "p",
        "div",
        "section",
        "article",
        "header",
        "footer",
        "aside",
        "nav",
        "span",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "figure",
        "figcaption",
        "blockquote",
        "pre",
        "code"
      ].join(",");
      const candidates = Array.from(
        doc.querySelectorAll(selector)
      ).filter((el) => isEditableCandidate(el));
      candidates.forEach((target) => {
        if (!target.hasAttribute("data-rhe-id")) {
          const uid = `rhe-init-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          try {
            target.setAttribute("data-rhe-id", uid);
          } catch (err) {
          }
        }
      });
    } catch (err) {
    }
    doc.addEventListener(
      "click",
      (e) => {
        var _a, _b;
        const target = e.target;
        if (target && target.tagName === "IMG") {
          try {
            openImageEditor(doc, target);
          } catch (err) {
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (!isEditableCandidate(target)) return;
        if (_getCurrentEditable() && _getCurrentEditable() !== target) {
          (_a = _getCurrentEditable()) == null ? void 0 : _a.removeAttribute("contenteditable");
          (_b = _getCurrentEditable()) == null ? void 0 : _b.classList.remove(CLASS_ACTIVE);
        }
        if (!target.hasAttribute("data-rhe-id")) {
          const uid = `rhe-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          try {
            target.setAttribute("data-rhe-id", uid);
          } catch (err) {
          }
        }
        _setCurrentEditable(target);
        target.classList.add(CLASS_ACTIVE);
        target.setAttribute("contenteditable", "true");
        target.focus();
      },
      true
    );
    doc.addEventListener("selectionchange", () => {
      injectToolbar(doc, {
        onCommand: handleToolbarCommand,
        canUndo: () => _getUndoStack().length > 1,
        canRedo: () => _getRedoStack().length > 0,
        onUndo: handleUndo,
        onRedo: handleRedo,
        getFormatState: () => computeFormatState(doc),
        getSelectedElementInfo: () => getElementLabel(_getCurrentEditable())
      });
    });
    doc.addEventListener("input", () => pushStandaloneSnapshot(), true);
    doc.addEventListener(
      "keydown",
      (e) => {
        const meta = e.ctrlKey || e.metaKey;
        if (!meta) return;
        const key = e.key.toLowerCase();
        if (key === "b") {
          e.preventDefault();
          handleToolbarCommand("bold");
          return;
        }
        if (key === "i") {
          e.preventDefault();
          handleToolbarCommand("italic");
          return;
        }
        if (key === "u") {
          e.preventDefault();
          handleToolbarCommand("underline");
          return;
        }
        if (key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          return;
        }
        if (key === "y") {
          e.preventDefault();
          handleRedo();
          return;
        }
      },
      true
    );
    doc.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Enter") return;
        if (e.shiftKey) return;
        const sel = doc.getSelection();
        if (!sel || !sel.rangeCount) return;
        const node = sel.anchorNode;
        const el = node && node.nodeType === Node.ELEMENT_NODE ? node : node && node.parentElement || null;
        if (!el) return;
        const li = el.closest("li");
        if (!li || !li.parentElement) return;
        e.preventDefault();
        const list = li.parentElement;
        const newLi = doc.createElement("li");
        const zw = doc.createTextNode("\u200B");
        newLi.appendChild(zw);
        if (li.nextSibling) list.insertBefore(newLi, li.nextSibling);
        else list.appendChild(newLi);
        const range = doc.createRange();
        range.setStart(zw, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      },
      true
    );
  }

  // src/core/editor.ts
  init_constants();
  function initRichEditor(iframe, config) {
    try {
      if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
        throw new Error("Invalid iframe element provided to initRichEditor");
      }
      const doc = iframe.contentDocument;
      if (!doc) {
        throw new Error(
          "Unable to access iframe contentDocument. Ensure iframe src is same-origin."
        );
      }
      _setDoc(doc);
      injectStyles(doc);
      _setUndoStack([]);
      _setRedoStack([]);
      _setCurrentEditable(null);
      if (config == null ? void 0 : config.maxStackSize) {
        Promise.resolve().then(() => (init_state(), state_exports)).then((m) => m.setMaxStackSize(config.maxStackSize)).catch(() => {
        });
      }
      attachStandaloneHandlers(doc);
      pushStandaloneSnapshot();
      injectToolbar(doc, {
        onCommand: handleToolbarCommand,
        canUndo: () => _getUndoStack().length > 1,
        canRedo: () => _getRedoStack().length > 0,
        onUndo: handleUndo,
        onRedo: handleRedo,
        getFormatState: () => computeFormatState(doc),
        getSelectedElementInfo: () => getElementLabel(_getCurrentEditable())
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Failed to initialize editor:", message);
      throw error;
    }
  }
  function getCleanHTML() {
    try {
      const doc = _getDoc();
      if (!doc) {
        console.warn(
          "[rich-html-editor] getCleanHTML called before editor initialization"
        );
        return "";
      }
      if (!doc.documentElement) {
        throw new Error("Document is missing documentElement");
      }
      const clone2 = doc.documentElement.cloneNode(true);
      const toolbarNode = clone2.querySelector(`#${TOOLBAR_ID}`);
      if (toolbarNode && toolbarNode.parentNode)
        toolbarNode.parentNode.removeChild(toolbarNode);
      const styleNode = clone2.querySelector(`#${STYLE_ID}`);
      if (styleNode && styleNode.parentNode)
        styleNode.parentNode.removeChild(styleNode);
      try {
        const cleanElement = (el) => {
          try {
            if (el.hasAttribute("contenteditable"))
              el.removeAttribute("contenteditable");
            if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
          } catch (e) {
          }
          try {
            const attrs = Array.from(el.attributes || []);
            attrs.forEach((a) => {
              const rawName = a.name;
              const name = rawName.toLowerCase();
              if (name.startsWith("on")) {
                try {
                  el.removeAttribute(rawName);
                } catch (e) {
                }
                return;
              }
              if (name === "data-rhe-id" || name.startsWith("data-rhe-") || name === "data-rhe") {
                try {
                  el.removeAttribute(rawName);
                } catch (e) {
                }
                return;
              }
            });
          } catch (e) {
          }
          try {
            if (el.id) {
              const id = el.id;
              if (id === TOOLBAR_ID || id === STYLE_ID || id.startsWith("editor-") || id.startsWith("rhe-")) {
                el.removeAttribute("id");
              }
            }
          } catch (e) {
          }
          try {
            const cls = Array.from(el.classList || []);
            cls.forEach((c) => {
              if (c === CLASS_EDITABLE || c === CLASS_ACTIVE || c.startsWith("editor-") || c.startsWith("rhe-")) {
                try {
                  el.classList.remove(c);
                } catch (e) {
                }
              }
            });
            if (el.hasAttribute("class") && (el.getAttribute("class") || "").trim() === "") {
              try {
                el.removeAttribute("class");
              } catch (e) {
              }
            }
          } catch (e) {
          }
          try {
            const children = Array.from(el.children || []);
            children.forEach((child) => cleanElement(child));
          } catch (e) {
          }
        };
        if (clone2.nodeType === Node.ELEMENT_NODE) {
          cleanElement(clone2);
        }
      } catch (e) {
      }
      return "<!doctype html>\n" + clone2.outerHTML;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[rich-html-editor] Failed to get clean HTML:", message);
      throw error;
    }
  }

  // src/RichHtmlEditor.ts
  var RichHtmlEditor = class _RichHtmlEditor {
    constructor(options) {
      const { iframe, ...cfg } = options;
      this.config = Object.keys(cfg).length ? cfg : void 0;
      if (typeof iframe === "string") {
        const el = document.querySelector(iframe);
        if (!el) throw new Error(`Iframe selector "${iframe}" not found`);
        if (!(el instanceof HTMLIFrameElement))
          throw new Error(`Selector "${iframe}" did not resolve to an iframe`);
        if (!el.contentWindow) throw new Error("Iframe has no contentWindow");
        this.iframeEl = el;
        this.iframeWindow = el.contentWindow;
      } else if (iframe && iframe.contentWindow) {
        const el = iframe;
        if (!el.contentWindow) throw new Error("Iframe has no contentWindow");
        this.iframeEl = el;
        this.iframeWindow = el.contentWindow;
      } else if (iframe && iframe.document) {
        this.iframeWindow = iframe;
        try {
          const candidates = Array.from(
            document.querySelectorAll("iframe")
          );
          const found = candidates.find(
            (f) => f.contentWindow === this.iframeWindow
          );
          if (found) this.iframeEl = found;
        } catch (e) {
        }
      } else {
        throw new Error(
          "Invalid `iframe` option. Provide a `Window`, `HTMLIFrameElement`, or selector string."
        );
      }
    }
    init() {
      if (!this.iframeEl) {
        throw new Error(
          "Unable to initialize: iframe element not available. Provide an iframe element or selector."
        );
      }
      initRichEditor(this.iframeEl, this.config);
    }
    getHTML() {
      return getCleanHTML();
    }
    static attachToWindow(force = false) {
      if (typeof window === "undefined") return;
      if (!window.RichHtmlEditor || force) {
        window.RichHtmlEditor = _RichHtmlEditor;
      }
    }
  };
  if (typeof window !== "undefined") {
    RichHtmlEditor.attachToWindow();
  }

  // src/index.ts
  init_events();
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/
//# sourceMappingURL=index.global.js.map