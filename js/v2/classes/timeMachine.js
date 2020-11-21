class TimeMachine {
  constructor(divisions) {
    this.divisions = divisions;
    this.arrowOfTime = {};
    this.tickOffset = 0;
    this.graces = [];
    this.notes = [];
  }

  pushOrCreate(key, note, dk = 0) {
    let fkey = key * 10 - dk;
    if (!(fkey in this.arrowOfTime)) {
      this.arrowOfTime[fkey] = {
        chord: [note.toString()],
        g: SVGBuilder.createSVG('g')
      };
    } else {
      this.arrowOfTime[fkey].chord.push(note.toString());
    }
    note.tick = fkey;
  }

  push(node, bar) {
    if ('backup' == node.tagName) {
      this.tick -= parseInt(node.querySelector('duration').innerHTML);
      return;
    }

    if ('forward' == node.tagName) {
      this.tick += parseInt(node.querySelector('duration').innerHTML);
      return;
    }

    let note = new Note(node, bar);
    this.notes.push(note);

    if (note.grace) {
      this.graces.push(note);
      return;
    }

    let key = this.tick + this.tickOffset;

    if (this.graces.length > 0) {
      this.graces.reverse().forEach( (n, i) => {
        this.pushOrCreate(key, n, i+1);
      });
      this.graces = [];
    }

    if (undefined == note.chord) {
      this.pushOrCreate(key, note);
      this.tick += note.duration;
    } else {
      this.pushOrCreate(key - note.duration, note);
    }
  }
}
