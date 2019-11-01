class PlayTriplets {
  static noteGenerator() {
    let n = "CDEFGAB".split('');
    let nn = [];
    for (let i of n) {
      for (let j of n) {
        if (i == j) continue;
        nn.push([i, j]);
      }
    }
    return [
      (p) => {
        let f = n.filter((e) => !p.includes(e));
        p.length = 0;
        return f[Ut.rnd(f.length)];
      },
      (p) => {
        let f = nn.filter((e) => !e.includes(p[0]));
        p.length = 0;
        return f[Ut.rnd(f.length)];
      }
    ];
  }

  createNoteExercise() {
    let md = new MusicDoc();

    md.divisions = 1;
    md.beats = 4;
    md.beatType = 4;

    let clef = Clef.get('G2:F4');
    let curChordTick = 0;
    let ng = PlayTriplets.noteGenerator();
    let m = Math.floor(this.to / 4);
    let p = [[], []]
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < 4; j++) {
        let curChord = new Chord(i, clef);

        for (let n of ng[0].call(null, p[0])) {
          p[0].push(n);
          let note1 = new Note({step: n, octave: 5, staff: 1, duration: 1, type: "quarter"});
          note1.parentChord = curChord;
          curChord.notes.push(note1);
        }
        for (let n of ng[1].call(null, p[1])) {
          p[1].push(n);
          let note1 = new Note({step: n, octave: 3, staff: 2, duration: 1, type: "quarter"});
          note1.parentChord = curChord;
          curChord.notes.push(note1);
        }
        ng.reverse();

        md.chordOnTick[curChordTick] = curChord;

        curChordTick++;
      }
    }
    md.postProccess();

    return md;
  }

  constructor(piano, md) {
    this.from = 0;
    this.to = 20 * 4;
    this.correctInRow = 0;

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
