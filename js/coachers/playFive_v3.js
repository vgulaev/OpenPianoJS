class PlayFive {
  static createChords(amount) {
    let two = [];
    let notes = "CDEFG".split('');
    for (let i of notes) {
      for (let j of notes) {
        if (i == j) continue;
        two.push(i + j);
      }
    }

    let intervals = {};

    for (let i of two) {
      intervals[i] = []
      for (let j of two) {
        if (i == j) continue;
        if (i[0] == j[0]) continue;
        if (i[1] == j[1]) continue;
        intervals[i].push(j);
      }
    }

    let res = []

    res.push(two[Ut.rnd(two.length)]);
    for (let i = 0; i < amount; i++) {
      let c = res[res.length - 1];
      let o = intervals[c];
      let j = Ut.rnd(o.length);
      res.push(intervals[c].splice(j, 1)[0]);
      if (0 == intervals[c].length) delete intervals[c];
    }

    return res;
  }

  createNoteExercise() {
    let md = new MusicDoc();

    md.divisions = 1;
    md.beats = 4;
    md.beatType = 4;

    let clef = Clef.get('G2:F4');
    let curChordTick = 0;
    let c = PlayFive.createChords(this.to);
    let m = Math.floor(this.to / 4);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < 4; j++) {
        let curChord = new Chord(i, clef);
        let note1 = new Note({step: c[i*4 + j][0], octave: 5, staff: 1, duration: 1, type: "quarter",
          fingering: this.steps.right[c[i*4 + j][0]]
        });
        // let note2 = new Note({step: c[i*4 + j][0], octave: 3, staff: 2, duration: 1, type: "quarter"});
        let note2;
        if ('same note' == this.mode) {
          note2 = new Note({step: c[i*4 + j][0], octave: 3, staff: 2, duration: 1, type: "quarter",
            fingering: this.steps.right[c[i*4 + j][0]]
          });
        } else {
          note2 = new Note({step: c[i*4 + j][1], octave: 3, staff: 2, duration: 1, type: "quarter",
            fingering: this.steps.right[c[i*4 + j][1]]
          });
        }
        md.chordOnTick[curChordTick] = curChord;
        note1.parentChord = curChord;
        note2.parentChord = curChord;
        curChord.notes.push(note1);
        curChord.notes.push(note2);
        curChordTick++;
      }
    }
    md.postProccess();

    return md;
  }

  constructor(piano, md, mode) {
    this.from = 0;
    this.to = 20 * 4;
    this.correctInRow = 0;
    this.mode = mode;

    this.steps = {
      left: {'C': 5, 'D': 4, 'E': 3, 'F': 2, 'G': 1},
      right: {'C': 1, 'D': 2, 'E': 3, 'F': 4, 'G': 5}
    }

    this.aim = this.createNoteExercise();
    this.piano = piano;
    this.piano.pullUp = true;
    this.piano.perMinute = 40;

    var obj = this;
    this.piano.beforePracticeStep = function () {
      obj.beforePracticeStep();
    }
    this.piano.onTrackOver = function () {
      obj.onTrackOver();
    }

    this.piano.afterPracticeStep = function () {
      if (obj.correctInRow > 6) {
        obj.piano.perMinute += 1;
        obj.correctInRow = 0;
      }
      obj.correctInRow += 1;
      // console.log('::', this.steps.length);
      if (obj.piano.curentChordIndex >= obj.to) obj.onTrackOver();
    };

    this.piano.onErrorCoach = () => {
      if (this.piano.perMinute > 10) {
        this.piano.perMinute = this.piano.perMinute - 5;
      }
      this.correctInRow = 0;
    }

    this.piano.practice(this.aim);
    this.piano.restart(this.from);
  }

  timeSign() {
    var c = this.piano.currentChord();
    c.userTime = performance.now();
  }

  beforePracticeStep() {
    this.timeSign();
  }

  changeTempo() {
    var c0 = this.piano.musicDoc.chordArray[this.from];
    var l = Math.min(this.piano.musicDoc.chordArray.length - 1, this.to);
    var c1 = this.piano.musicDoc.chordArray[l];

    var t0 = c0.userTime;
    var t1 = c1.userTime;
    var dTick = c1.tick - c0.tick;
    var curTemp = Math.ceil(60000 / (t1 - t0) * dTick / this.piano.musicDoc.divisions);
    this.piano.perMinute = curTemp;
  }

  onTrackOver() {
    this.changeTempo();
    this.aim = this.createNoteExercise();
    this.correctInRow = 0;
    this.piano.practice(this.aim);
    this.piano.restart(this.from);
  }
}
