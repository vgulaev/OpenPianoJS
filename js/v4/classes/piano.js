import {MIDIPiano} from './midiPiano.js';
import {Ut} from './ut.js';

export class Piano {
  constructor(app) {
    this.app = app;
    Ut.addEvents(this, ['onMIDIKeyPressed']);
  }

  init(mover) {
    this.midi = new MIDIPiano();
    this.midi.initMIDI(this);
    this.keys = new Set();
    this.mover = mover;
  }

  onMIDIMessage(event) {
    this.app.stats.pressKey();
    this.dispatchEvent('onMIDIKeyPressed');
    if (144 == event.data[0]) {
      this.keys.add(event.data[1]);
      this.mover.step(this.keys);
    } else {
      this.keys.delete(event.data[1]);
    }
  }
}
