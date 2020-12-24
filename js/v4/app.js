import {Sheet} from './classes/sheet.js';
import {GrandStaff} from './classes/grandStaff.js';
import {Mover} from './classes/mover.js';

class App {
  constructor() {
    this.grandStaff = new GrandStaff(this);
    this.sheet = new Sheet(this);
    this.mover = new Mover(this);
  }

  load(url) {
    this.sheet
      .load(url)
      .then(() => {
        this.mover.updateStartPoint();
      });
    // this.grandStaff.load(url)
    //   .then(() => {
    //
    //   });
  }
}

window.addEventListener('load', function( event ) {
  var app = new App();
  app.load('data/xml/test1.musicxml');
});
