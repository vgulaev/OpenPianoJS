class Menu {
  async checkTemplate() {
    if (undefined == Menu.template) {
      Menu.template = {};
      await Ut.get("templates/menu/main.html", function() {
        Menu.template["main"] = this.responseText;
      });
      await Ut.get("templates/menu/item.html", function() {
        Menu.template["item"] = this.responseText;
      });
    }
  }

  constructor(button, items) {
    this.button = button;
    this.items = items;
  }

  centeredElement() {
    this.element.style.left = this.button.offsetLeft + "px";
    this.element.style.top = this.button.offsetTop + this.button.clientHeight + "px";
    this.element.style.width = this.button.clientWidth + "px";
  }

  renderItem(parent, item) {
    //parent.innerHTML += Menu.template["item"];
    parent.insertAdjacentHTML("beforeend", Menu.template["item"]);
    var obj = this;
    var e = parent.lastChild;
    e.innerHTML = item[1];
    e.setAttribute("id", item[0]);
    e.addEventListener("click", function() {
      obj.onSelect(this.id, this.innerHTML);
      obj.destroy();
    }, false);
  }

  destroy() {
    this.element.parentElement.remove();
  }

  addEventListeners() {
    var obj = this;
    this.mouseout = {
      name: 'mouseout',
      handleEvent: function(event) {
        if (event.toElement.parentElement == obj.element) return;
        obj.destroy();
     }
   }
   this.element.addEventListener("mouseout", this.mouseout, false);
 }

  async select(callBack) {
    await this.checkTemplate();
    var el = document.createElement("div");
    el.innerHTML = Menu.template["main"];
    this.element = el.firstChild;
    for (var e of this.items) {
      this.renderItem(this.element, e);
    }
    this.centeredElement();
    this.addEventListeners();
    this.onSelect = callBack;
    document.body.append(el);
  }
}