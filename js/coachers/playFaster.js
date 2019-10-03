class PlayFaster {
  constructor(piano, md, range) {
    this.aim = md;
    this.piano = piano;
    this.piano.pullUp = true;

    this.from = range[0];
    this.to = range[1];

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
    var l = Math.min(this.piano.musicDoc.chordArray.length, this.to) - 1;
    var c1 = this.piano.musicDoc.chordArray[l];

    var t0 = c0.userTime;
    var t1 = c1.userTime;
    var dTick = c1.tick - c0.tick;
    var curTemp = Math.ceil(60000 / (t1 - t0) * dTick / this.piano.musicDoc.divisions);
    this.piano.perMinute = curTemp;
  }

  onTrackOver() {
      this.changeTempo();
      this.piano.restart(this.from);
  }
}
