import {SVGBuilder} from '../svgBuilder.js';

export class TimePoint {
  constructor() {
    this.notes = [];
  }

  push(el) {
    let className = el.constructor.name.toLowerCase();
    if ('function' == typeof this[className]) {
      this[className](el);
    }
  }

  note(el) {
    this.notes.push(el);
  }

  clef(el) {
    if (!this.clefs) {
      this.clefs = {};
    }
    this.clefs[el.number] = el;
  }

  draw(pm) {
    if (this.clefs) {
      Object.keys(this.clefs).forEach(c => this.clefs[c].draw(pm));
      pm.cursor += 50;
    }
    let t = SVGBuilder.text({x: pm.cursor, y: 71, text: 'TP'});
    pm.g.append(t);
    pm.cursor += 30;
  }
}
