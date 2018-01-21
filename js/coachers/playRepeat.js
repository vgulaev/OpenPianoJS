class PlayRepeat {
  constructor(piano, md) {
    this.aim = md;
    this.piano = piano;
    var a = [125, 141];
    var a = [161, 225];
    this.from = a[0];
    this.to = a[1];
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