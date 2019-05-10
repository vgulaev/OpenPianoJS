class PlayFromSlownest {
  constructor(piano, md, range) {
    this.aim = md;
    this.piano = piano;
    this.status = 'play'; //play or practice

    this.piano.practice(this.aim);
    this.level = 0;
    this.from = range[0];
    this.to = Math.min(range[1], this.piano.musicDoc.chordArray.length - 1);

    var obj = this;
    this.piano.beforePracticeStep = function () {
      obj.beforePracticeStep();
    }

    this.piano.onTrackOver = function () {
      obj.onTrackOver();
    }

    this.piano.afterPracticeStep = function () {
      if (obj.piano.curentChordIndex >= obj.to) obj.onTrackOver();
    };

    this.piano.restart(this.from);

    this.originalRange = range.slice();
    this.originalTempo = this.piano.perMinute;
  }

  timeSign() {
    var c = this.piano.currentChord();
    c.userTime = performance.now();
  }

  beforePracticeStep() {
    this.timeSign();
  }

  analyzeResult() {
    let chordArray = this.piano.musicDoc.chordArray;
    // this.measureTiming = {
    //   '-1': {
    //     timeStart: 0
    //   }
    // };
    this.measureTiming = {};
    let minIndex = -1;
    if (this.from > 0) {
      minIndex = chordArray[this.from - 1].chord.measure;
    }
    this.measureTiming[minIndex] = { timeStart: 0,  length: 0};
    let m;
    for (let i = this.from; i <= this.to; i++) {
      m = chordArray[i].chord.measure;
      if (!(m in this.measureTiming)) {
        this.measureTiming[m - 1].length = chordArray[i].userTime - this.measureTiming[m - 1].timeStart;
        this.measureTiming[m] = {
          timeStart: chordArray[i].userTime,
          chordIndex: i
        };
      }
    }
    delete this.measureTiming[minIndex];
    this.longestIndex = minIndex + 1;
    for (let e of Object.entries(this.measureTiming)) {
      if (e[1].length > this.measureTiming[this.longestIndex].length) this.longestIndex = e[0];
    }
    // this.measureTiming[m - 1].length =
    let nextIndex = parseInt(this.longestIndex) + 1;
    this.from = this.measureTiming[this.longestIndex].chordIndex;
    this.to = this.measureTiming[nextIndex].chordIndex;
    App.updateFromTo();
  }

  changeTempo() {
    var c0 = this.piano.musicDoc.chordArray[this.from];
    var l = Math.min(this.piano.musicDoc.chordArray.length, this.to) - 1;
    var c1 = this.piano.musicDoc.chordArray[l];

    var t0 = c0.userTime;
    var t1 = c1.userTime;
    var dTick = c1.tick - c0.tick;
    var curTemp = Math.ceil(60000 / (t1 - t0) * dTick / this.piano.musicDoc.divisions);
    this.piano.perMinute = curTemp;
  }

  onTrackOver() {
    if ('play' == this.status) {
      this.status = 'practice';
      this.analyzeResult();
      this.piano.pullUp = false;
      this.piano.practice(this.aim);
      this.piano.restart(this.from);
    } else {
      this.changeTempo();
      if (10 == App.nn && 'practice' == this.status) {
        if (0 == this.level) {
          this.from = this.measureTiming[this.longestIndex - 1].chordIndex;
          this.level = 1;
        } else {
          this.status = 'play';
          this.from = this.originalRange[0];
          this.to = this.originalRange[1];
          this.level = 0;
          this.piano.perMinute = this.originalTempo;
        }
        App.nn = 0;
        App.updateFromTo();
      };
      // this.piano.practice(this.aim);
      this.piano.restart(this.from);
    }
  }

  // start() {
  //   this.status = 'play';
  //   this.piano.practice(this.aim);
  //   this.originalTempo = this.piano.perMinute;
  // }
}
