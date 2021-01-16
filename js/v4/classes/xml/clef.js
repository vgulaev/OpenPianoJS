import {SVGBuilder} from '../svgBuilder.js';
import {Ut} from '../ut.js';
import {emm} from '../../../common/glyphName.js'

export class Clef {
  constructor(xml) {
    this.xml = xml;
    this['clef-octave-change'] = 0;
    this.number = xml.getAttribute('number');
    Ut.parseChildren(this, xml);
  }

  draw(pm) {
    let o = Ut.clefOffset(this);
    o.x = pm.cursor;
    let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[this.sign]});
    pm.g.append(t);
    if (1 == this['clef-octave-change'] && 'G' == this.sign) {
      let t = SVGBuilder.emmentaler({x: o['x'] + 13, y: o['y'] - 69, text: emm.Number[8]});
      t.style.fontSize = '25px';
      pm.g.append(t);
    }
    pm.drawClefs[this.number] = this;
  }

  toS() {
    return this.sign + this['clef-octave-change'];
  }
}
