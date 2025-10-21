const originalCreateElement = document.createElement;

// override createElement to block certain tags
document.createElement = function (tagName) {
  const blackListElements = ["iframe", "script", "link", "meta", "a"];
  const blackListAttributes = ["href", "src", "target"];
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

// disable click popups
document.addEventListener(
  "click",
  function (event) {
    let target = event.target;
    while (target && target !== document) {
      if (target?.tagName?.toLowerCase() === "a") {
        const href = target?.getAttribute("href");
        const targetAttr = target?.getAttribute("target");
        if (href && targetAttr) {
          event.preventDefault();
          console.log(`Blocked popup link to ${href}`);
          return;
        }
      }
      target = target?.parentNode;
    }
  },
  true
);

// disable window.open
window.open = function () {
  console.log("Disable window.open");
};

// const div = document.createElement("div");
// div.innerHTML =
//   "<a href='https://youtube.com' target='_blank' style='position: fixed; z-index: 1000; top:0; left:0; background:red'>youtube.com</a>";
// document.body.appendChild(div);
// const a = div.querySelector("a");
// a.click();
