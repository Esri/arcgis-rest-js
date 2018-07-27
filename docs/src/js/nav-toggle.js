Vue.component("nav-toggle", {
  props: ["index", "packageName"],
  mounted: function() {
    this.trigger = document.getElementById("trigger" + this.index);
    this.list = document.getElementById("list" + this.index);
    this.toggle = false;

    const match = window.location.pathname.match(/\/api\/([^\/]+)\//);
    const partialPath = match ? match[1] : null;
    if (partialPath && this.packageName.indexOf(partialPath) > -1) {
      this.show();
    }

    this.trigger.onclick = () => {
      if (this.toggle) {
        this.hide();
      } else {
        this.show();
      }
    };
  },
  methods: {
    hide: function() {
      for (var i = 0; i < this.list.children.length; i++) {
        this.trigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="svg-icon"><path d="M7 4h5l12 12-12 12H7l12-12L7 4z"/></svg>`;
        this.list.children[i].classList.add("visually-hidden");
      }
      this.toggle = false;
    },
    show: function() {
      for (var i = 0; i < this.list.children.length; i++) {
        this.trigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="svg-icon"><path d="M28 9v5L16 26 4 14V9l12 12L28 9z"/></svg>`;
        this.list.children[i].classList.remove("visually-hidden");
        if (this.list.children[i].children[0].classList.contains("is-active")) {
          this.list.children[i].classList.add("list-item-active");
        }
      }
      this.toggle = true;
    }
  }
});
