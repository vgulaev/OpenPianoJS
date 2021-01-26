import {MusicFiles} from '../../../../conf/settings.js'

export class Menu {
  constructor(root) {
    this.items = MusicFiles;
    this.div = document.createElement('div');
    this.div.style.display = 'inline-block';
    this.createInput();
    root.append(this.div);
  }

  createItem(item) {
    let e = document.createElement('div');
    e.setAttribute('fileName', item.fileName);
    e.innerHTML = item.name;
    this.itemDiv.append(e);
  }

  showItems() {
    this.itemDiv.innerHTML = '';
    this.items.map(e => e.toLowerCase()).filter().forEach(e => {
      this.createItem(e);
    });
  }

  createInput() {
    let wrapDiv = document.createElement('div');
    wrapDiv.setAttribute('id', 'wrapDiv');

    this.itemDiv = document.createElement('div');
    this.itemDiv.style.position = 'absolute';
    this.itemDiv.style.width = 'inherit';

    let e = document.createElement('input');
    wrapDiv.append(e);
    wrapDiv.append(this.itemDiv);
    this.div.append(wrapDiv);
    requestAnimationFrame(() => {
      wrapDiv.style.width = e.clientWidth + 'px';
      console.log(e.clientWidth);
    });

    // wrapDiv.style.width = e.getBoundingClientRect();
    this.showItems();
    e.setAttribute('id', 'SheetList');
    e.addEventListener('keydown', event => {
      this.showItems();
    });
  }
}
