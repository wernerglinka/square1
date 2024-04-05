(() => {
  // js/modules/module1.js
  var module1 = /* @__PURE__ */ function module12() {
    const init = () => {
      console.log("module1.js loaded");
    };
    return {
      init
    };
  }();
  var module1_default = module1;

  // js/modules/module2.js
  var module2 = /* @__PURE__ */ function module22() {
    const init = () => {
      console.log("module2.js loaded");
    };
    return {
      init
    };
  }();
  var module2_default = module2;

  // js/main.js
  function initPage() {
    module1_default.init();
    module2_default.init();
  }
  window.addEventListener("load", function() {
    initPage();
  });
})();
