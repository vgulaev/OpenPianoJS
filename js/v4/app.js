import {ChordChain} from './classes/chordChain.js';
import {FragmentCoacher} from './coachers/fragmentCoacher.js'
import {GrandStaff} from './classes/grandStaff.js';
import {Mover} from './classes/mover.js';
import {MusicFiles} from '../../conf/settings.js'
import {Piano} from './classes/piano.js';
import {Sheet} from './classes/sheet.js';
import {Stats} from './classes/stats.js';
import {UI} from './classes/ui.js'

class App {
  constructor() {
    this.stats = Stats;
    this.stats.init();
    this.stats.loadState();
    this.grandStaff = new GrandStaff(this);
    this.sheet = new Sheet(this);
    this.mover = new Mover(this);
    this.piano = new Piano(this);
    this.piano.init(this.mover);
    this.ui = new UI(this);
    this.sensei = new FragmentCoacher(this);
  }

  load(url) {
    this.sheet.name = MusicFiles.filter(e => e['fileName'] == url)[0].name;
    this.sheet
      .load(url)
      .then(() => {
        this.cc = new ChordChain(this.sheet);
        this.mover.assign(this.cc);
        this.sensei.init();
      });
  }
}

globalThis.app = new App();
window.addEventListener('load', function( event ) {
  // app.load('data/xml/Beethoven Bagatelle No. 25 in A minor.musicxml');
  // app.load('data/xml/Beethoven Piano_Sonata_No.21_Op.53.musicxml');
  // app.load('data/xml/Beethoven Sonata 14 C Sharp Minor.musicxml');
  // app.load('data/xml/Beethoven Sonata No. 8 Op. 13 Pathetique - Second Ab major.musicxml');
  // app.load('data/xml/Beethoven Sonate No. 17 Tempest 3rd Movement.musicxml');
  // app.load('data/xml/Beethoven Symphony No. 5 1 st movement Piano solo.musicxml');
  // app.load('data/xml/billie jean.musicxml');
  // app.load('data/xml/BWV 847 Prelude C Minor.musicxml');
  // app.load('data/xml/BWV-565.musicxml');
  // app.load('data/xml/Canon_in_D_full.musicxml');
  // app.load('data/xml/Chopin Sonata_No.2_in_B-flat_minor.musicxml');
  // app.load('data/xml/Chopin_-_Nocturne_Op_9_No_1_B_Flat_Minor.musicxml');
  app.load('data/xml/Chopin_Nocture_opus_9_number2.musicxml');
  // app.load('data/xml/Debussy - Clair de Lune Suite Bergamasque No. 3.musicxml');
  // app.load('data/xml/Jingle_Bells.musicxml');
  // app.load('data/xml/Maksim Mrvica - Croatian Rhapsody.musicxml');
  // app.load('data/xml/Mozart-Fantasia in D Minor K. 397.musicxml');
  // app.load('data/xml/Mozart-Sonata_16.musicxml');
  // app.load('data/xml/Prelude_in_G_Minor_Op._23_No._5.musicxml');
  // app.load('data/xml/River_Flows_in_You.musicxml');
  // app.load('data/xml/Tchaikovsky_Op._39_Childrens_Album_-_P._I._IX. Новая кукла.musicxml');

  // app.load('data/xml/test.musicxml');
});
