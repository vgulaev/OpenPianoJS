import {MIDIPiano} from './midiPiano.js';

export class Piano {
  init(mover) {
    this.midi = new MIDIPiano();
    this.midi.initMIDI(this);
    this.keys = new Set();
    this.mover = mover;
  }

  onMIDIMessage(event) {
    if (144 == event.data[0]) {
      this.keys.add(event.data[1]);
      this.mover.step(this.keys);
    } else {
      this.keys.delete(event.data[1]);
    }
  }
}
