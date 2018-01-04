class Play10timesRule {
  constructor(piano, md) {
    this.aim = md;
    this.piano = piano;
    this.status = ""; //aim or practice
    var obj = this;
    this.piano.beforePracticeStep = function () {
      obj.beforePracticeStep();
    }
    this.piano.onTrackOver = function () {
      obj.onTrackOver();
    }
    this.start();
  }

  timeSign() {
    var c = this.piano.currentChord();
    c.userTime = performance.now();
  }

  beforePracticeStep() {
    this.timeSign();
  }

  createPracticeTrack() {
    var m = this. piano.musicDoc;
    var stats = [];
    var ms = 60000 / this.piano.perMinute / m.divisions;
    var el = {};
    el.right = m.chordArray[0];
    for (var i = 1; i < m.chordArray.length; i++) {
      var el = { left: el.right };
      el.right = m.chordArray[i];
      el.dTick = el.right.tick - el.left.tick;
      el.idealTime = el.dTick * ms;
      el.realTime = el.right.userTime - el.left.userTime;
      if (el.idealTime != 0) {
        el.orderValue = el.realTime / el.idealTime;
      } else {
        el.orderValue = 0;
      }
      el.index = i - 1;
      stats.push(el);
    }
    stats.sort((a, b) => { return b.orderValue - a.orderValue } )

    var md = new MusicDoc();

    md.divisions = m.divisions;
    md.beats = m.beats;
    md.beatType = m.beatType;

    function copyChord(md, curTick, from, length, count) {
      var measure = 0;
      for (var j = 0; j < count; j++) {
        md.chordOnTick[curTick] = m.chordArray[from].chord.copy();
        md.chordOnTick[curTick].measure = measure;
        for (var i = 1; i < length; i++) {
          curTick = curTick + m.chordArray[from + i].tick - m.chordArray[from + i - 1].tick;
          md.chordOnTick[curTick] = m.chordArray[from + i].chord.copy();
          md.chordOnTick[curTick].measure = measure;
          //md.chordOnTick[curTick].measure = Math.floor(curTick / md.beats / md.divisions);
        }
        measure += 1;
        curTick += 1 * md.divisions;
      }

      return curTick;
      console.log("yes");
    }

    var curTick = 0;
    var k = 0;
    stats.forEach(function(el) {
      if (el.orderValue < 1) return;
      if (k > 0) return;
      curTick = copyChord(md, curTick, el.index, 2, 15);
      if ((el.index > 0) && (el.index + 1 < m.chordArray.length)) {
        curTick = copyChord(md, curTick, el.index - 1, 3, 10);
      }
      if ((el.index > 1) && (el.index + 2 < m.chordArray.length)) {
        curTick = copyChord(md, curTick, el.index - 2, 4, 5);
      }
      if ((el.index > 1) && (el.index + 3 < m.chordArray.length)) {
        curTick = copyChord(md, curTick, el.index - 2, 5, 5);
      }
      k += 1;
      //curChordTick = curChordTick + el.dTick + 1;
    });
    md.postProccess();
    return md;
  }

  onTrackOver() {
    if ("aim" == this.status) {
      this.status = "practice";
      var practiceTrack = this.createPracticeTrack();
      this.piano.practice(practiceTrack);
    } else {
      this.status = "aim";
      this.piano.practice(this.aim);
    }
  }

  start() {
    this.status = "aim";
    this.piano.practice(this.aim);
  }
}
