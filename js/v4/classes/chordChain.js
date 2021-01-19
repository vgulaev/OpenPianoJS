import {Chord} from './Chord.js';

export class ChordChain {
  constructor(sheet) {
    this.items = [];
    for (let m of sheet.measures) {
      for (let [key, tp] of Object.entries(m.timePoint)) {
        if (tp.graces) this.parseGraces(tp.graces);
        let notes = tp.notes.filter(n => {
          if (n.rest) return false;
          if (n.tie) return ('start' == n.tieStatus());
          return true;
        });
        if (0 == notes.length) continue;
        this.items.push(new Chord(notes));
      }
    }
  }

  parseGraces(graces) {
    let l = Math.max(...[1, 2].map(s => (undefined == graces[s] ? 0 : graces[s].length)));
    for (let i = 0; i < l; i++) {
      let notes = [];
      [1, 2].forEach(s => {
        if (!graces[s]) return;
        let n = graces[s][i];
        if (n) notes.push(n);
      });
      if (0 == notes.length) continue;
      this.items.push(new Chord(notes));
    }
  }
}
