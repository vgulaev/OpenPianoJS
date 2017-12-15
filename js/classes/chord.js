class Chord {
  constructor(measure = 0) {
    this.notes = new Array();
    this.g = null;
    this.sign = "";
    this.measure = measure;
  }

  update() {
    this.sign = this.notes.
      map(n => n.midiByte).
      filter(x => x > 0).
      sort().join(",");
  }
}
