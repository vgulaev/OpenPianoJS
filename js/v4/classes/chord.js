export class Chord {
  constructor(notes, tp) {
    this.x = Math.min(...notes.map(n => n.x));
    this.notes = notes;
    this.errors = 0;
    this.keys = new Set(this.notes.map(n => n.midiByte));
    this.tp = tp;
  }
}
