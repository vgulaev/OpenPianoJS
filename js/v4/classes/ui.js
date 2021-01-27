import {Menu} from './ui/menu.js'

export class UI {
  constructor(app) {
    this.app = app;
    this.UIHeader = document.getElementById('Header');
    this.UIFooter = document.getElementById('Footer');
    this.createSheetList();
    this.createTodayPlay();
    this.createIndexInfo();
    this.createTempInfo();
  }

  createSheetList() {
    this.menu = new Menu(this.UIHeader);
    this.menu.addEventListener('onItemSelected', e => {
      let peace = e.itemDiv.children[0];
      this.app.load(peace.getAttribute('fileName'));
    });
  }

  createTodayPlay() {
    let e = document.createElement('div');
    e.innerHTML = 'Play today: ' + this.app.stats.info();
    this.UIFooter.append(e);
    this.app.piano.addEventListener('onMIDIKeyPressed', (event) => {
      e.innerHTML = 'Play today: ' + this.app.stats.info();
    });
  }

  createIndexInfo() {
    let e = document.createElement('div');
    e.innerHTML = 'Index: ' + this.app.stats.info();
    this.UIFooter.append(e);
    this.app.mover.addEventListener('afterIndexUpdated', (event) => {
      e.innerHTML = 'Index: ' + this.app.mover.curIndex;
    });
  }

  createTempInfo() {
    let e = document.createElement('div');
    e.innerHTML = 'Temp: 60';
    e.style.cssText = "position: absolute; text-align: center; font-family: sans-serif; font-size: 30px; margin-left: auto; margin-right: auto; left: 0; right: 0;";
    this.UIFooter.append(e);
  }
}
