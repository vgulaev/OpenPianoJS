import {Sheet} from './classes/sheet.js';
import {GrandStaff} from './classes/grandStaff.js';

class App {
  constructor() {
    this.sheet = new Sheet();
    this.grandStaff = new GrandStaff();
    // this.mover = new Mover(this.grandStaff);
  }

  load(url) {
    this.sheet.load(url);
    // this.grandStaff.load(url)
    //   .then(() => {
    //     this.mover.updateStartPoint();
    //   });
  }
}

window.addEventListener('load', function( event ) {
  var app = new App();
  app.load('data/xml/test1.musicxml');
});
