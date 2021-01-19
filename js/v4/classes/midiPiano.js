export class MIDIPiano {
  onMIDIFailure( msg ) {
    console.log( "Failed to get MIDI access - " + msg );
  }

  initMIDI(piano) {
    return new Promise((resolve, reject) => {
      navigator.requestMIDIAccess().then((midiAccess) => {
        for (let entry of midiAccess.inputs) {
          this.input = entry[1];
          console.log( "Input port [type:'" + this.input.type + "'] id:'" + this.input.id +
            "' manufacturer:'" + this.input.manufacturer + "' name:'" + this.input.name +
            "' version:'" + this.input.version + "'" );
          this.input.onmidimessage = (event) => { piano.onMIDIMessage(event); };
          break;
        }
        resolve();
      }, this.onMIDIFailure);
    });
  }
}
