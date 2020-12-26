import {emm} from '../../../common/glyphName.js'
import {SVGBuilder} from '../svgBuilder.js';

export class TimePoint {
  constructor() {
    this.notes = [];
    this.voices = {};
    this.staff = {'1': [], '2': []};
    this.beforeNotesElements = {'1': [], '2': []};
  }

  push(el) {
    let className = el.constructor.name.toLowerCase();
    if ('function' == typeof this[className]) {
      this[className](el);
    }
  }

  note(el) {
    if (el.grace) {
      if (!this.graces) this.graces = {};
      if (this.graces[el.staff]) {
        this.graces[el.staff].push(el);
      } else {
        this.graces[el.staff] = [el];
      }
      return;
    }
    this.notes.push(el);
    this.staff[el.staff].push(el);
    if (this.voices[el.voice]) {
      this.voices[el.voice].push(el);
    } else {
      this.voices[el.voice] = [el];
    }
  }

  clef(el) {
    if (!this.clefs) {
      this.clefs = {};
    }
    this.clefs[el.number] = el;
  }

  key(el) {
    if (!this.fifths) {
      this.fifths = el;
    }
  }

  time(el) {
    if (!this.timeSignature) {
      this.timeSignature = el;
    }
  }

  drawSignature(pm) {
    if (this.clefs) {
      Object.keys(this.clefs).forEach(c => this.clefs[c].draw(pm));
      pm.cursor += 50;
    }
    if (this.fifths) {
      let g = SVGBuilder.keySignature(pm.drawClefs[1].toS(), pm.drawClefs[2].toS(), this.fifths.fifths, pm.cursor);
      pm.g.append(g);
      pm.cursor += Math.abs(this.fifths.fifths) * 14 + 10;
    }
    if (this.timeSignature) {
      let g = SVGBuilder.setTimeSignature(this.timeSignature['beats'], this.timeSignature['beat-type'], pm.cursor);
      pm.g.append(g);
      pm.cursor += 40;
    }
  }

  pushArpeggiate(pm, x, voice) {
    let edge = voice.sort((a, b) => a.stepLine - b.stepLine);
    let staff = edge[0].staff;
    edge = [edge[0], edge[edge.length - 1]].map(e => e.drawY(pm.drawClefs[e.staff]));

    let g = SVGBuilder.createSVG('g');
    for (let y = edge[0]; y > edge[1]; y -= 15) {
      let a = SVGBuilder.emmentaler({x: x, y: y, text: emm.Script.arpeggio});
      g.append(a);
    }
    pm.g.append(g);
  }

  checkArpeggiate(pm) {
    Object
      .keys(this.voices)
      .filter(e => this.voices[e][0].notations && this.voices[e][0].notations.arpeggiate)
      .forEach(e => {
        this.beforeNotesElements[this.voices[e][0].staff].push({
          callBack: this.pushArpeggiate,
          width: 15
        });
      });
  }

  drawBeforeNotesElements(pm) {
    let maxes = [1, 2].map(e => this.beforeNotesElements[e].map(x => x.width).reduce((acc, cur) => acc += cur, 0));
    let maxWidth = Math.max(...maxes);
    let minWidth = Math.min(...maxes);

    console.log('drawBeforeNotesElements');
  }

  proccessBeforeNotesElements(pm) {
    this.checkArpeggiate(pm);
    this.drawBeforeNotesElements(pm);
  }

  draw(pm) {
    this.drawSignature(pm);
    this.proccessBeforeNotesElements(pm);
    let t = SVGBuilder.text({x: pm.cursor, y: 71, text: 'TP'});
    pm.g.append(t);
    pm.cursor += 30;
  }
}
