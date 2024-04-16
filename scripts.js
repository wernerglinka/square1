(() => {
  // js/modules/navigation.js
  var navigation = function() {
    "use strict";
    const init = () => {
      console.log("enter init navigation");
      if (!document.querySelector(".js-header")) {
        return;
      }
      console.log("init navigation");
      const header = document.querySelector(".js-header");
      const mainMenu = document.querySelector(".js-main-menu");
      const page = document.body;
      const main = document.querySelector("#main");
      header.addEventListener("click", (e) => {
        if (e.target.matches(".js-hamburger, .js-hamburger *")) {
          page.classList.toggle("hamburger-active");
        }
      });
      mainMenu.addEventListener("click", (e) => {
        if (e.target.matches("a")) {
          page.classList.add("menu-fadeout");
        }
      });
      window.addEventListener("scroll", (e) => {
        if (window.scrollY >= 100) {
          document.body.classList.add("is-scrolling");
        } else {
          document.body.classList.remove("is-scrolling");
        }
      });
    };
    return { init };
  }();
  var navigation_default = navigation;

  // js/modules/debounce.js
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
  var debounce_default = debounce;

  // js/modules/section-animation.js
  var sectionAnimations = function() {
    "use strict";
    const showSection = (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const thisSection = entry.target;
          thisSection.classList.remove("is-hidden");
          observer.unobserve(thisSection);
        }
      }
    };
    const updateSections = debounce_default(function() {
      const observer = new IntersectionObserver(showSection);
      const allSections = document.querySelectorAll(".js-is-animated");
      for (const section of allSections) {
        observer.observe(section);
      }
    }, 500);
    const init = () => {
      console.log("init section animations");
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const allSections = document.querySelectorAll(".js-is-animated");
      for (const section of allSections) {
        const rect = section.getBoundingClientRect();
        if (rect.top > viewportHeight) {
          console.log("hide section");
          section.classList.add("is-hidden");
        }
      }
      const resizeObserver = new ResizeObserver(updateSections);
      const resizeElement = document.body;
      resizeObserver.observe(resizeElement);
    };
    return {
      init
    };
  }();
  var section_animation_default = sectionAnimations;

  // js/modules/mobileFlipcardSupport.js
  var mobileFlipCardSupport = /* @__PURE__ */ function($) {
    const init = () => {
      const flipcards = document.querySelectorAll(".flip-card-wrapper");
      flipcards.forEach((flipcard) => {
        flipcard.addEventListener("touchstart", function() {
          flipcard.classList.toggle("flip");
        });
        flipcard.addEventListener("mouseenter", function() {
          flipcard.classList.add("flip");
        });
        flipcard.addEventListener("mouseleave", function() {
          flipcard.classList.remove("flip");
        });
      });
    };
    return {
      init
    };
  }();
  var mobileFlipcardSupport_default = mobileFlipCardSupport;

  // js/main.js
  function initPage() {
    navigation_default.init();
    section_animation_default.init();
    mobileFlipcardSupport_default.init();
  }
  window.addEventListener("load", function() {
    initPage();
  });
})();
