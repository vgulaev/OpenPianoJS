import {MusicFiles} from '../../../../conf/settings.js'
import {Ut} from '../ut.js'

export class Menu {
  constructor(root) {
    this.items = MusicFiles;
    this.items.forEach(e => e['lowerCase'] = e.name.toLowerCase());
    this.div = document.createElement('div');
    this.div.style.display = 'inline-block';
    this.createInput();
    root.append(this.div);
    Ut.addEvents(this, ['onItemSelected']);
  }

  createItem(item) {
    let e = document.createElement('div');
    e.setAttribute('fileName', item.fileName);
    e.style.border = '1px solid red';
    e.style.background = 'white';
    e.innerHTML = item.name;
    this.itemDiv.append(e);
  }

  showItems() {
    let re = new RegExp(this.input.value.toLowerCase().replace(/ /g, '.*'));
    this.itemDiv.textContent = '';
    this.items.filter(e => re.test(e['name'].toLowerCase())).sort(e => e['name']).forEach(e => {
      this.createItem(e);
    });
  }

  createInput() {
    let wrapDiv = document.createElement('div');
    wrapDiv.setAttribute('id', 'wrapDiv');

    this.itemDiv = document.createElement('div');
    this.itemDiv.style.position = 'absolute';
    this.itemDiv.style.width = 'inherit';

    this.input = document.createElement('input');
    wrapDiv.append(this.input);
    wrapDiv.append(this.itemDiv);
    this.div.append(wrapDiv);
    requestAnimationFrame(() => {
      wrapDiv.style.width = this.input.clientWidth + 'px';
    });

    this.input.addEventListener('keyup', event => {
      if ('Enter' == event.key) {
        this.dispatchEvent('onItemSelected');
        this.itemDiv.textContent = '';
      } else {
        this.showItems();
      }
    });
  }
}
