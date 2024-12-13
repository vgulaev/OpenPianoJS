import {ChordChain} from './classes/chordChain.js';
import {FragmentCoacher} from './coachers/fragmentCoacher.js'
import {GrandStaff} from './classes/grandStaff.js';
import {LearnCoacher} from './coachers/learnCoacher.js';
import {Mover} from './classes/mover.js';
import {MusicFiles} from '../../conf/settings.js'
import {Piano} from './classes/piano.js';
import {Sheet} from './classes/sheet.js';
import {Stats} from './classes/stats.js';
import {TempoCoacher} from './coachers/tempoCoacher.js';
import {UI} from './classes/ui.js'
import {Settings} from '../../conf/localSettings.js'
import {TempoMaster} from './classes/tempoMaster.js'

class App {
  constructor() {
    this.stats = Stats;
    return this.stats.init()
      .then(() => {
        this.stats.loadState();
        this.grandStaff = new GrandStaff(this);
        this.sheet = new Sheet(this);
        this.mover = new Mover(this);
        this.piano = new Piano(this);
        this.piano.init(this.mover);
        this.tempoMaster = new TempoMaster(this);
        this.ui = new UI(this);
        this.sensei = new FragmentCoacher(this);
        // this.sensei = new TempoCoacher(this);
        // this.sensei = new LearnCoacher(this);
        return this
      })
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

window.addEventListener('load', event => {
  (new App())
    .then(app => {
      globalThis.app = app
      Settings.loadDefault()
    })
})
