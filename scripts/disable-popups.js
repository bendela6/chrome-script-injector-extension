const originalCreateElement = document.createElement;

// override createElement to block certain tags
document.createElement = function (tagName) {
  const blackListElements = ["iframe", "script", "link", "meta", "a", "form"];
  const blackListAttributes = ["href", "src", "target", "action", "innerHTML"];
  if (!blackListElements.includes(tagName.toLowerCase())) {
    return originalCreateElement.apply(document, arguments);
  }
  const element = originalCreateElement.apply(document, arguments);
  element.style.display = "none";
  blackListAttributes.forEach((attr) => {
    Object.defineProperty(element, attr, {
      get: function () {
        return "";
      },
      set: function (value) {
        console.log(`Blocked setting ${attr} to ${value} on <${tagName}> element`);
      },
    });
  });
  return element;
};

document.addEventListener = function (type, listener, options) {
  console.log("Adding event listener for", type, listener, options);
  return EventTarget.prototype.addEventListener.call(this, type, listener, options);
};

// monitor certain events
["click", "submit", "contextmenu", "mousedown", "mouseup"].forEach((eventType) => {
  document.addEventListener(
    eventType,
    function (event) {
      console.log(`${eventType} event detected`, event);
    },
    true
  );
});

// disable window.open
window.open = function () {
  console.log("Disable window.open");
};

function isExternalLink(url) {
  try {
    const linkUrl = new URL(url, window.location.href);
    return linkUrl.origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

// const div = document.createElement("div");
// div.innerHTML =
//   "<a href='https://youtube.com' target='_blank' style='position: fixed; z-index: 1000; top:0; left:0; background:red'>youtube.com</a>";
// document.body.appendChild(div);
// const a = div.querySelector("a");
// a.click();
