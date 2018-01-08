class MusicDoc {
  constructor() {
    this.chordOnTick = {};
    this.chordArray = new Array;
  }

  postProccess() {
    this.chordArray = Object.keys(this.chordOnTick).
      map(x => ( { "tick": parseInt(x), "chord": this.chordOnTick[x] } ) ).
      sort((a, b) => a.tick < b.tick ? -1 : ( a.tick > b.tick ? 1 : 0) );
    var options = {};
    this.chordArray.forEach((x, i, a) => {
      x.chord.update(App.setting.staff);
    });
  }

  async loadFromURL(url) {
    var xml;
    await Ut.get(url, function () {
      xml = this.responseXML;
    });
    var attr = xml.getElementsByTagName("attributes")[0];
    this.keyFifths = parseInt(attr.getElementsByTagName("fifths")[0].innerHTML);
    this.divisions = parseInt(attr.getElementsByTagName("divisions")[0].innerHTML);
    this.beats = parseInt(attr.getElementsByTagName("beats")[0].innerHTML);
    this.beatType = parseInt(attr.getElementsByTagName("beat-type")[0].innerHTML);

    var voiceTicker = new VoiceTicker();
    var measureXML = xml.getElementsByTagName("measure");
    var curChordTick = 0;
    var curChord = null;
    for (var i = 0; i < measureXML.length; i++) {
      for (var noteXML of measureXML[i].getElementsByTagName("note")) {
        var note = new Note(noteXML);
        if (note.chord != true) {
          curChordTick = voiceTicker.nextTick(note.voice, note.duration);
          if (undefined === this.chordOnTick[curChordTick]) this.chordOnTick[curChordTick] = new Chord(i);
          curChord = this.chordOnTick[curChordTick];
        }
        note.parentChord = curChord;
        curChord.notes.push(note);
      }
    }
    this.postProccess();
  }
}
