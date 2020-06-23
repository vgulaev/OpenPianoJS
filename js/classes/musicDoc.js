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

  loadFromStr(content) {
    var p = new DOMParser();
    var xml = p.parseFromString(content, "text/xml");
    this.loadFromXML(xml);
  }

  async loadFromURL(url) {
    var xml;
    await Ut.get20(url, true)
      .then((data) => {
        this.loadFromStr(data);
      });
  }

  loadFromXML(xml) {
    let attr = xml.getElementsByTagName("attributes")[0];
    this.keyFifths = parseInt(attr.getElementsByTagName("fifths")[0].innerHTML);
    this.divisions = parseInt(attr.getElementsByTagName("divisions")[0].innerHTML);
    this.beats = parseInt(attr.getElementsByTagName("beats")[0].innerHTML);
    this.beatType = parseInt(attr.getElementsByTagName("beat-type")[0].innerHTML);

    let voiceTicker = new VoiceTicker(xml);
    let measureXML = xml.getElementsByTagName("measure");
    let curChordTick = 0;
    let graceIndex = 0;
    let curChord = null;
    let clef = Clef.get('G2:F4');
    let fifths = this.keyFifths;

    for (var i = 0; i < measureXML.length; i++) {
      if (i != 0) voiceTicker.calibrate();
      let beamIndex = 0;
      for (var childNode of measureXML[i].children) {
        let k = ['note', 'attributes'].indexOf(childNode.tagName);
        if (1 == k) {
          clef = Clef.checkClef(childNode, clef);
          for (let attNode of childNode.children) {
            if ('key' == attNode.tagName) {
              let nodes = attNode.getElementsByTagName('fifths');
              if (nodes.length > 0) {
                fifths = parseInt(nodes[0].innerHTML);
              }
            }
          }
        }
        if (-1 == k || 1 == k) continue;
        var note = new Note(childNode);
        if (note.chord != true) {
          if (true == note.grace) {
            curChordTick = voiceTicker.featureTick(note.voice) - 0.5 + 0.1 * graceIndex;
            graceIndex += 1;
          } else {
            graceIndex = 0;
            curChordTick = voiceTicker.nextTick(note.voice, note.duration);
          }
          if (undefined === this.chordOnTick[curChordTick]) {
            this.chordOnTick[curChordTick] = new Chord(i, clef, fifths);
          }
          curChord = this.chordOnTick[curChordTick];
          if (curChord.clef[2] != clef[2]) {
            let tmpClef = Clef.get([curChord.clef[1], clef[2]].join(':'));
            Object.keys(this.chordOnTick)
            .filter((e) => e >= curChordTick)
            .forEach((e) => this.chordOnTick[e].clef = tmpClef);
          }
        }
        note.parentChord = curChord;
        if (undefined != note.beam) {
          note.v2.beamIndex = beamIndex;
          let beam1 = note.raw.querySelector('beam[number="1"]');
          if (beam1 != null && 'end' == beam1.innerHTML) beamIndex += 1;
        }
        curChord.notes.push(note);
      }
    }
    this.postProccess();
  }
}
