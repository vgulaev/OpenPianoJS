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
        this.mover.assign(this.sheet);
      });
    // this.grandStaff.load(url)
    //   .then(() => {
    //
    //   });
  }
}

globalThis.app = new App();
window.addEventListener('load', function( event ) {
  // app.load('data/xml/test2.musicxml');
  // app.load('data/xml/Beethoven Symphony No. 5 1 st movement Piano solo.musicxml');
  // app.load('data/xml/BWV 847 Prelude C Minor.musicxml');
  // app.load('data/xml/Canon_in_D_full.musicxml');
  // app.load('data/xml/Chopin_Nocture_opus_9_number2.musicxml');
  app.load('data/xml/Debussy - Clair de Lune Suite Bergamasque No. 3.musicxml');
  // app.load('data/xml/Jingle_Bells.musicxml');
  // app.load('data/xml/Maksim Mrvica - Croatian Rhapsody.musicxml');
  // app.load('data/xml/Mozart-Fantasia in D Minor K. 397.musicxml');
  // app.load('data/xml/Prelude_in_G_Minor_Op._23_No._5.musicxml');
});
