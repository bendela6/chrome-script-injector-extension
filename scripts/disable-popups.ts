// 1. Block window.open completely
window.open = function (...args: any[]): null {
  console.log("[BLOCKED] window.open attempt:", args);
  return null;
};

// 2. Block location changes
window.location.assign = function (url: string): void {
  console.log("[BLOCKED] location.assign attempt:", url);
};

window.location.replace = function (url: string): void {
  console.log("[BLOCKED] location.replace attempt:", url);
};

// Block location.href changes via intercepting the descriptor
// We can't redefine href directly, so we'll monitor it differently
const locationDescriptor = Object.getOwnPropertyDescriptor(
  window.location.constructor.prototype,
  "href"
);
if (locationDescriptor && locationDescriptor.set) {
  Object.defineProperty(window.location.constructor.prototype, "href", {
    ...locationDescriptor,
    set: function (value: string) {
      console.log("[BLOCKED] location.href change attempt:", value);
      // Don't call the original setter to block the navigation
    },
  });
}

// 3. Override EventTarget.prototype.addEventListener to intercept ALL event registrations
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  // Block navigation-related events
  const blockedEvents = [
    "click",
    "mousedown",
    "mouseup",
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
  ];

  if (blockedEvents.includes(type)) {
    console.log(`[BLOCKED] addEventListener for "${type}" on`, this);
    return;
  }

  return originalAddEventListener.call(this, type, listener, options);
};

// 4. Block all click events in capture phase
document.addEventListener(
  "click",
  function (event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log("[BLOCKED] Click event on", event.target);
  },
  true
);

// 5. Block mousedown/mouseup/pointer events that could simulate clicks
["mousedown", "mouseup", "pointerdown", "pointerup", "touchstart", "touchend"].forEach(
  (eventType) => {
    document.addEventListener(
      eventType,
      function (event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log(`[BLOCKED] ${eventType} event on`, event.target);
      },
      true
    );
  }
);

// 6. Block inline event handler attributes
const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string): void {
  const blockedAttrs = [
    "onclick",
    "onmousedown",
    "onmouseup",
    "onpointerdown",
    "onpointerup",
    "ontouchstart",
    "ontouchend",
  ];

  if (blockedAttrs.includes(name.toLowerCase())) {
    console.log(`[BLOCKED] setAttribute "${name}" on`, this);
    return;
  }

  // Block target="_blank" on anchors
  if (this.tagName === "A" && name === "target" && value === "_blank") {
    console.log("[BLOCKED] Setting target='_blank' on anchor", this);
    return;
  }

  originalSetAttribute.call(this, name, value);
};

// 7. Override event handler property setters
[
  "onclick",
  "onmousedown",
  "onmouseup",
  "onpointerdown",
  "onpointerup",
  "ontouchstart",
  "ontouchend",
].forEach((prop) => {
  Object.defineProperty(HTMLElement.prototype, prop, {
    set: function (_value: any) {
      console.log(`[BLOCKED] Setting ${prop} property on`, this);
    },
    get: function () {
      return null;
    },
  });
});

// 8. Block anchor navigation to external links or _blank targets
const originalAnchorClick = HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click = function (): void {
  const href = this.getAttribute("href");
  const target = this.getAttribute("target");

  if (target === "_blank" || (href && isExternalLink(href))) {
    console.log("[BLOCKED] Anchor click to", href, "with target", target);
    return;
  }

  originalAnchorClick.call(this);
};

// 9. Block form submissions with target="_blank"
document.addEventListener(
  "submit",
  function (event: Event): void {
    const form = event.target as HTMLFormElement;
    const target = form.getAttribute("target");

    if (target === "_blank") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      console.log("[BLOCKED] Form submission with target='_blank'", form);
    }
  },
  true
);

// 10. Monitor and block dynamically created elements with suspicious attributes
const originalAppendChild = Node.prototype.appendChild;
Node.prototype.appendChild = function <T extends Node>(node: T): T {
  if (node instanceof HTMLElement) {
    // Check for overlay-like elements
    const style = node.style;
    if (style.position === "fixed" || style.position === "absolute") {
      const hasFullCoverage =
        (style.width === "100%" || parseInt(style.width) > window.innerWidth * 0.8) &&
        (style.height === "100%" || parseInt(style.height) > window.innerHeight * 0.8);

      if (hasFullCoverage && parseInt(style.zIndex) > 1000) {
        console.log("[BLOCKED] Suspicious overlay element", node);
        node.style.display = "none";
        node.style.pointerEvents = "none";
      }
    }

    // Check for anchors with target="_blank"
    if (node instanceof HTMLAnchorElement && node.getAttribute("target") === "_blank") {
      console.log("[BLOCKED] Anchor with target='_blank'", node);
      node.removeAttribute("target");
    }
  }

  return originalAppendChild.call(this, node) as T;
};

// 11. Block postMessage that could trigger popups
window.postMessage = function (
  message: any,
  targetOrigin?: string | WindowPostMessageOptions,
  _transfer?: Transferable[]
): void {
  console.log("[BLOCKED] postMessage attempt:", message, targetOrigin);
};

// Helper function (already exists in your code)
function isExternalLink(url: string): boolean {
  try {
    const linkUrl = new URL(url, window.location.href);
    return linkUrl.origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}
