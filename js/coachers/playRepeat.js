class PlayRepeat {
  constructor(piano, md, range) {
    this.aim = md;
    this.piano = piano;

    this.from = range[0];
    this.to = range[1];

    var obj = this;
    this.piano.onTrackOver = function () {
      console.log("onTrackOver");
      obj.piano.practice(obj.aim);
      obj.piano.restart(obj.from);
    };

    this.piano.afterPracticeStep = function () {
      console.log("afterPracticeStep");
      if (obj.piano.curentChordIndex >= obj.to) obj.piano.restart(obj.from);
    };

    this.piano.practice(this.aim);
    this.piano.restart(this.from);
  }
}