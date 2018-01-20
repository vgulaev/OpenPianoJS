class PlayRepeat {
  constructor(piano, md) {
    this.aim = md;
    this.piano = piano;
    this.from = 145;
    this.to = 180;
    var obj = this;
    this.piano.onTrackOver = function () {
      obj.piano.practice(obj.aim);
    };

    this.piano.afterPracticeStep = function () {
      if (obj.piano.curentChordIndex >= obj.to) obj.piano.restart(obj.from);
    };

    this.piano.practice(this.aim);
    this.piano.restart(this.from);
  }
}