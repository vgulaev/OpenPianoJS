import {Menu} from './ui/menu.js'

export class UI {
  constructor(app) {
    this.app = app;
    this.UIHeader = document.getElementById('Header');
    this.UIFooter = document.getElementById('Footer');
    this.createSheetList();
    this.createRestart();
    this.createTodayPlay();
    this.createIndexInfo();
    this.createSheetActivity();
    this.createTempAndRepeatsInfo();
  }

  createSheetList() {
    this.menu = new Menu(this.UIHeader);
    this.menu.addEventListener('onItemSelected', e => {
      let peace = e.itemDiv.children[0];
      this.app.load(peace.getAttribute('fileName'));
    });
  }

  createRestart() {
    let restartButton = document.createElement('button');
    restartButton.innerHTML = 'restart';
    restartButton.addEventListener('click', () => {
      this.app.mover.setCurIndex(0);
    });
    this.UIHeader.append(restartButton);
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
    e.innerHTML = 'Index: 0';
    this.UIFooter.append(e);
    this.app.mover.addEventListener('afterIndexUpdated', (event) => {
      e.innerHTML = 'Index: ' + this.app.mover.curIndex + ` of ${this.app.mover.cc.items.length}`;
    });
  }

  createSheetActivity() {
    let e = document.createElement('div');
    e.innerHTML = 'sheet acctivity';
    this.UIFooter.append(e);
    this.sheetActivity = e;
  }

  createTempAndRepeatsInfo() {
    let e = document.createElement('div');
    e.style.cssText = "position: absolute; text-align: center; font-family: sans-serif; font-size: 30px; margin-left: auto; margin-right: auto; left: 0; right: 0;";
    // e.innerHTML = 'Temp: 60';
    this.temp = document.createElement('div');
    this.temp.innerHTML = 'Temp: 60';
    this.repeats = document.createElement('div');
    this.repeats.innerHTML = 'Repeat: 1';
    this.errors = document.createElement('div');
    this.errors.innerHTML = 'Errors: 0';

    e.append(this.temp);
    e.append(this.repeats);
    e.append(this.errors);
    this.UIFooter.append(e);

    this.app.mover.addEventListener('onErrorNotePressed', (event) => {
      this.errors.innerHTML = 'Errors: ' + this.app.sheet.errors;
    });
  }
}
