// 1. Store the original document.createElement
const originalCreateElement = document.createElement;

const blackList = ["iframe", "script", "link", "meta", "a"];

// 2. Override the global document.createElement function
document.createElement = function (tagName) {
  if (!blackList.includes(tagName.toLowerCase())) {
    return originalCreateElement.apply(document, arguments);
  }

  const element = originalCreateElement.apply(document, arguments);
  element.style.display = "none";
  ["href", "src", "target"].forEach((attr) => {
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

window.open = function () {
  console.log("Disable window.open");
};
