document.addEventListener("DOMContentLoaded", () => {
  const copies = document.querySelectorAll("[data-copy]");
  if (copies.length) {
    copies.forEach((el) => {
      const elem = document.getElementById(el.dataset.copy);
      if (elem) {
        elem.appendChild(el.cloneNode(true));
      }
    });
  }

  const xl = matchMedia("(max-width: 1024px)");

  class Menu {
    constructor(menuElement, buttonElement) {
      this.menu =
        typeof menuElement === "string"
          ? document.querySelector(menuElement)
          : menuElement;
      this.button =
        typeof buttonElement === "string"
          ? document.querySelector(buttonElement)
          : buttonElement;
      this.overlay = document.createElement("div");
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      document.body.appendChild(this.overlay);
      this.overlay.classList.add("overlay");

      this.overlay.addEventListener("click", this.toggleMenu.bind(this));
      this.button.addEventListener("click", this.toggleMenu.bind(this));
    }

    toggleMenu() {
      this.menu.classList.toggle("menu--open");
      this.button.classList.toggle("menu-button--active");
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.disableScroll();
      } else {
        this.enableScroll();
      }
    }

    closeMenu() {
      this.menu.classList.remove("header__nav--active");
      this.button.classList.remove("header__menu-button--active");
      this.overlay.hidden = true;

      this.enableScroll();
    }

    isMenuOpen() {
      return this.menu.classList.contains("menu--open");
    }

    disableScroll() {
      // Get the current page scroll position;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    }

    enableScroll() {
      window.onscroll = function () {};
    }
  }

  const menu = document.querySelector(".menu");
  const menuButton = document.querySelector(".menu-button");

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  const header = document.querySelector("header");

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener("scroll", handler, false);
  }

  function scrollRemove() {
    /* ... */
    document.removeEventListener("scroll", handler, false);
  }

  if (xl.matches) {
    scrollAdd();
    document.removeEventListener("scroll", scrollHeader);
  } else {
    document.addEventListener("scroll", scrollHeader);
    scrollRemove();
  }

  xl.addEventListener("change", () => {
    if (xl.matches) {
      document.removeEventListener("scroll", scrollHeader);
      scrollAdd();
    } else {
      document.addEventListener("scroll", scrollHeader);
      scrollRemove();
    }
  });

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.style.setProperty("scroll-behavior", "auto");

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.style.setProperty("scroll-behavior", null);
    window.onscroll = function () {};
  }

  var prevScrollpos =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    }
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    }
    const num = xl.matches ? 50 : 100;
    if (currentScrollPos > num) {
      header.classList.add("header--active");
    } else {
      header.classList.remove("header--active");
    }
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove("out");
    } else {
      header.classList.add("out");
    }
    prevScrollpos = currentScrollPos;
  }

  function initHeader() {
    var currentScrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add("header--active");
    } else {
      header.classList.remove("header--active");
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {
      if (isThrottled) {
        // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  class Search {
    constructor(search) {
      this.wrap = search;

      this.dropdownbtn = search.querySelector(".js-dropdown");
      this.dropdownbtnmobile = search.querySelector(".js-dropdown-mobile");

      this.searchblock = search.querySelector(".main-search.desctop");

      this.dropdown = search.querySelector(".js-checkboxes");
      this.dropdowncopy = search.querySelector(".js-checkboxes-copy");

      this.searchMobile = search.querySelector(".js-search-mobile");
      this.searchInput = search.querySelector(".js-search");

      this.popup = search.querySelector(".main-searchpopup");

      this.dropdownHandle = function () {
        if (!event.target.closest(".dropdown-items, .dropdown-opened")) {
          this.closeDropdown();
        }
      };

      this.boundDropdownHandle = this.dropdownHandle.bind(this);

      this.chipsWrapper = search.querySelector(".js-chips");

      if (!this.chipsWrapper) {
        return;
      }

      if (!this.popup) {
        return;
      }

      if (!this.searchMobile || !this.searchInput) {
        return;
      }

      if (!this.dropdown || !this.dropdowncopy) {
        return;
      }

      if (!this.dropdownbtn || !this.dropdownbtnmobile) {
        return;
      }

      if (!this.searchblock) {
        return;
      }

      this.init();
    }

    init() {
      this.dropdownbtn.addEventListener("click", () => {
        this.toggleDropdown();

        if (xl.matches) {
          this.openPopup();
        }
      });

      this.dropdownbtnmobile.addEventListener("click", () => {
        this.toggleDropdown();
      });

      this.searchblock.addEventListener("click", () => {
        if (xl.matches) {
          event.preventDefault();
          this.openPopup();
        }
      });

      if (xl.matches) {
        this.dropdowncopy.appendChild(this.dropdown);
      }

      this.popup.addEventListener("click", () => {
        if (xl.matches && event.target === this.popup) {
          this.closePopup();
          this.closeDropdown();
        }
      });

      this.initChips();

      this.initSearchInput();
    }

    initChips() {
      const checkboxes = this.dropdown.querySelectorAll(
        '.checkbox-label input[type="checkbox"]',
      );

      if (checkboxes.length && this.chipsWrapper && this.wrap) {
        checkboxes.forEach((checkbox) => {
          const chip = checkbox
            .closest(".checkbox-label")
            .querySelector(".js-chip");

          if (!chip) return;

          chip.addEventListener("click", () => {
            chip.hidden = true;
            checkbox.checked = false;

            const isAnyChecked = [...checkboxes].some((el) => el.checked);
            this.wrap.classList.toggle("has-level", isAnyChecked);
          });

          this.chipsWrapper.appendChild(chip);

          checkbox.addEventListener("change", () => {
            chip.hidden = !checkbox.checked;

            const isAnyChecked = [...checkboxes].some((el) => el.checked);
            this.wrap.classList.toggle("has-level", isAnyChecked);
          });
        });
      }
    }

    initSearchInput() {
      const change = new Event("change", { bubbles: true });

      const debouncedInputHandler = debounce(() => {
        if (this.searchInput.value.length > 3) {
          this.searchInput.dispatchEvent(change);
          this.wrap.classList.add("has-text");
        } else if (this.searchInput.value.length === 0) {
          this.wrap.classList.remove("has-text");
        }

        if (this.searchInput.value === "") {
          this.searchInput.dispatchEvent(change);
        }
      }, 300);

      this.searchInput.addEventListener("input", debouncedInputHandler);

      if (this.searchMobile) {
        const debouncedMobileInputHandler = debounce(() => {
          if (this.searchMobile.value.length > 3) {
            this.searchMobile.dispatchEvent(change);
            this.wrap.classList.add("has-text");
          } else if (this.searchMobile.value.length === 0) {
            this.wrap.classList.remove("has-text");
          }

          if (this.searchMobile.value === "") {
            this.searchMobile.dispatchEvent(change);
          }
        }, 300);

        this.searchMobile.addEventListener(
          "input",
          debouncedMobileInputHandler,
        );
      }
    }

    dropdownOpened() {
      return this.wrap.classList.contains("dropdown-opened");
    }

    toggleDropdown() {
      this.wrap.classList.toggle("dropdown-opened");

      if (this.dropdownOpened()) {
        document.addEventListener("click", this.boundDropdownHandle);
      } else {
        document.removeEventListener("click", this.boundDropdownHandle);
      }
    }

    openDropdown() {
      if (!this.dropdownOpened()) {
        this.wrap.classList.add("dropdown-opened");
        document.addEventListener("click", this.boundDropdownHandle);
      }
    }

    closeDropdown() {
      if (this.dropdownOpened()) {
        this.wrap.classList.remove("dropdown-opened");
        document.removeEventListener("click", this.boundDropdownHandle);
      }
    }

    openPopup() {
      this.wrap.classList.add("popup-opened");
      this.searchMobile.focus();
    }

    closePopup() {
      this.wrap.classList.remove("popup-opened");
    }
  }

  const search = document.getElementById("search-wrap");

  if (search) {
    new Search(search);
  }

  const catalogbtn = document.querySelector(".main-catalogbtn");
  const catalog = document.getElementById("main-catalog");
  const catalogback = document.querySelector(".js-catalog-back");

  function catalogHandle() {
    if (!event.target.closest(".main-catalog, .main-catalogbtn.opened")) {
      catalog.closeCatalog();
    }

    if (xl.matches && event.target.classList.contains("main-catalog")) {
      catalog.closeCatalog();
    }
  }

  if (catalogbtn && catalog && catalogback) {
    catalog.toggleOpened = function () {
      catalogbtn.classList.toggle("opened");
      catalog.classList.toggle("opened");

      if (catalogbtn.classList.contains("opened")) {
        document.addEventListener("click", catalogHandle);
        if (xl.matches) {
          disableScroll();
        }
      } else {
        document.removeEventListener("click", catalogHandle);
        enableScroll();
      }
    };

    catalog.closeCatalog = function () {
      catalogbtn.classList.remove("opened");
      catalog.classList.remove("opened");
      enableScroll();
      document.removeEventListener("click", catalogHandle);
    };

    catalogbtn.addEventListener("click", function (event) {
      catalog.toggleOpened();
    });

    catalogback.addEventListener("click", function () {
      catalog.closeCatalog();
    });
  }

  const summaries = document.querySelectorAll(".main-summary");
  const tabcontent = document.querySelector(".main-tabcontent");
  if (summaries.length && tabcontent) {
    summaries.forEach((el) => {
      el.addEventListener("click", function () {
        if (xl.matches) {
          this.classList.toggle("active");
        } else {
          summaries.forEach((el) => el.classList.remove("active"));
          this.classList.add("active");
        }
        tabcontent.innerHTML = this.nextElementSibling.innerHTML;
      });
    });

    if (!xl.matches) {
      summaries[0].click();
    }
  }

  const mainswipers = document.querySelectorAll(".main-swiperwrap");
  if (mainswipers.length) {
    mainswipers.forEach((el) => {
      const nextEl = el.querySelector(".next");
      const prevEl = el.querySelector(".prev");
      const pagination = el.querySelector(".swiper-pagination");
      const swiper = el.querySelector(".swiper");
      if (!swiper) {
        return;
      }
      new Swiper(swiper, {
        slidesPerView: "auto",
        pagination: {
          clickable: true,
          el: pagination,
        },
        navigation: {
          prevEl,
          nextEl,
        },
      });
    });
  }

  const galleryswipers = document.querySelectorAll(".gallery-wrap");
  if (galleryswipers.length) {
    galleryswipers.forEach((el) => {
      const nextEl = el.querySelector(".next");
      const prevEl = el.querySelector(".prev");
      const pagination = el.querySelector(".swiper-pagination");
      const slides = el.querySelectorAll(".swiper-slide");
      const swiper = el.querySelector(".swiper");

      if (!swiper) {
        return;
      }
      new Swiper(swiper, {
        loop: slides.length > 3,
        slidesPerView: "auto",
        pagination: {
          clickable: true,
          el: pagination,
        },
        navigation: {
          prevEl,
          nextEl,
        },
      });
    });
  }

  const maininput = document.querySelectorAll(".main-input");

  if (maininput.length && xl.matches) {
    maininput.forEach((el) => {
      el.placeholder = el.placeholder.slice(0, 12) + "...";
    });
  }
});
