class VoiceTicker {
  constructor(xml) {
    this.indexes = {};
    let voices = xml.querySelectorAll('voice');
    voices.forEach((v) => {
      this.indexes[parseInt(v.innerHTML)] = {index: 0};
    });
  }

  featureTick(voice) {
    return this.indexes[voice]["index"] + this.indexes[voice]["duration"];
  }

  nextTick(voice, duration) {
    if ( undefined === this.indexes[voice].duration ) {
      this.indexes[voice].duration = duration;
      return 0;
    } else {
      this.indexes[voice]["index"] += this.indexes[voice]["duration"];
      this.indexes[voice]["duration"] = duration;
      return this.indexes[voice]["index"];
    }
  }

  calibrate() {
    let max = 0;
    let obj = {};
    for (let e in this.indexes) {
      let c = this.indexes[e].index + this.indexes[e].duration;
      if (c > max) {
        max = c;
        obj = this.indexes[e];
      }
    }

    for (let e in this.indexes) {
      let c = this.indexes[e].index + this.indexes[e].duration;
      if (c != max) {
        this.indexes[e] = Object.assign({}, obj);
      }
    }
  }
}
