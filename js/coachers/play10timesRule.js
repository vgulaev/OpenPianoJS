class Play10timesRule {
  constructor(piano, md) {
    this.aim = md;
    this.piano = piano;
    this.status = "aim"; //aim or practice

    //var a = [161, 225];
    //var a = [225, 1000];
    //var a = [177, 193];
    var a = [0, 1000];
    this.from = a[0];
    this.to = a[1];

    var obj = this;
    this.piano.beforePracticeStep = function () {
      obj.beforePracticeStep();
    }
    this.piano.onTrackOver = function () {
      obj.onTrackOver();
    }

    this.piano.afterPracticeStep = function () {
      if ((obj.piano.curentChordIndex >= obj.to)&&("aim" == obj.status)) obj.onTrackOver();
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

  createPracticeTrack() {
    var m = this. piano.musicDoc;
    var stats = [];
    var ms = 60000 / this.piano.perMinute / m.divisions;
    var el = {};
    el.right = m.chordArray[this.from];
    for (var i = this.from + 1; i < m.chordArray.length; i++) {
      if (undefined == m.chordArray[i].userTime) break;
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
    md.keyFifths = m.keyFifths;
    md.beatType = m.beatType;
    md.beats = m.beats;

    function copyChord(md, curTick, from, length, count) {
      var measure = 0;
      for (var j = 0; j < count; j++) {
        md.chordOnTick[curTick] = m.chordArray[from].chord.copy({clearBeam: true});
        md.chordOnTick[curTick].measure = measure;
        for (var i = 1; i < length; i++) {
          curTick = curTick + m.chordArray[from + i].tick - m.chordArray[from + i - 1].tick;
          md.chordOnTick[curTick] = m.chordArray[from + i].chord.copy({clearBeam: true});
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
      this.piano.pullUp = true;
      this.piano.practice(practiceTrack);
      this.piano.restart(0);
    } else {
      this.status = "aim";
      this.piano.pullUp = false;
      this.piano.practice(this.aim);
      this.piano.restart(this.from);
    }
  }

  start() {
    this.status = "aim";
    this.piano.practice(this.aim);
  }
}
