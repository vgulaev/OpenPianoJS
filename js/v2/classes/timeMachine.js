class TimeMachine {
  constructor(divisions) {
    this.divisions = divisions;
    this.arrowOfTime = {};
    this.notes = [];
    this.tickOffset = 0;
  }

  push(node) {
    if ('backup' == node.tagName) {
      this.tick -= parseInt(node.querySelector('duration').innerHTML);
      return;
    }

    if ('forward' == node.tagName) {
      this.tick += parseInt(node.querySelector('duration').innerHTML);
      return;
    }

    let note = new Note(node);
    this.notes.push(note);

    if (note.grace) return;

    let key = this.tick + this.tickOffset;
    if (undefined == note.chord) {
      if (!(key in this.arrowOfTime)) {
        this.arrowOfTime[key] = [note.toString()];
      } else {
        this.arrowOfTime[key].push(note.toString());
      }
      this.tick += note.duration;
    } else {
      this.arrowOfTime[key - note.duration].push(note.toString());
    }
  }
}
