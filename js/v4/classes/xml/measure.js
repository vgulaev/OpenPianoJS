import {Clef} from './clef.js';
import {Key} from './key.js';
import {Note} from './note.js';
import {SVGBuilder} from '../svgBuilder.js';
import {Time} from './time.js';
import {TimePoint} from './timePoint.js';
import {Ut} from '../ut.js';

export class Measure {
  constructor(xml) {
    this.xml = xml;
    this.timePoint = {};
    this.curTick = 0;
    this.number = xml.getAttribute('number');

    Ut.iterateChildren(xml, node => {
      if ('function' == typeof this[node.tagName]) {
        if (-1 != ['note', 'time', 'clef', 'key'].indexOf(node.tagName)) {
          this.checkTick();
        }
        this[node.tagName](node);
      }
    });
  }

  backup(xml) {
    let n = new Key(xml);
    this.curTick -= n.duration;
  }

  forward(xml) {
    let n = new Key(xml);
    this.curTick += n.duration;
  }

  note(xml) {
    let n = new Note(xml);
    if (n.chord) {
      this.timePoint[this.curTick - n.duration].push(n);
    } else {
      this.timePoint[this.curTick].push(n);
      if (n.duration) {
        this.curTick += n.duration;
      }
    }
  }

  time(xml) {
    let t = new Time(xml);
    this.timePoint[this.curTick].push(t);
  }

  clef(xml) {
    let c = new Clef(xml);
    this.timePoint[this.curTick].push(c);
  }

  key(xml) {
    let k = new Key(xml);
    this.timePoint[this.curTick].push(k);
  }

  checkTick() {
    if (!(this.curTick in this.timePoint)) {
      this.timePoint[this.curTick] = new TimePoint();
    }
  }

  draw(pm) {
    let e = SVGBuilder.line({x1: pm.cursor, y1: 84, x2: pm.cursor, y2: 302, 'stroke-width': 2, stroke: 'black'})
    let t = SVGBuilder.text({x: pm.cursor - 5, y: 71, text: this.xml.getAttribute('number')});
    pm.g.append(t);
    pm.g.append(e);
    pm.cursor += 10;
    Object.keys(this.timePoint)
      .map(e => parseInt(e))
      .sort((a, b) => a-b)
      .forEach(t => this.timePoint[t].draw(pm));
  }
}