class PlayRepeat {
  constructor(piano, md) {
    this.aim = md;
    this.piano = piano;
    var obj = this;
    this.piano.onTrackOver = function () {
      obj.piano.practice(obj.aim);
    }
    this.piano.practice(this.aim);
  }
}