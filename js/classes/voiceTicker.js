class VoiceTicker {
  constructor() {
    this.indexes = {};
  }

  nextTick(voice, duration) {
    if ( undefined === this.indexes[voice] ) {
      this.indexes[voice] = {index: 0, duration: duration};
      return 0;
    } else {
      this.indexes[voice]["index"] += this.indexes[voice]["duration"];
      this.indexes[voice]["duration"] = duration;
      return this.indexes[voice]["index"];
    }
  }
}
