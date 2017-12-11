class Chord {
  constructor() {
    this.notes = new Array();
    this.g = null;
    this.sign = "";
  }

  update() {
    this.sign = this.notes.map( function(n) { return n.midiByte } ).sort().join(",");
  }
}
