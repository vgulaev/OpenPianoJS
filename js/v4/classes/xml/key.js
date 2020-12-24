// import {SVGBuilder} from '../svgBuilder.js';
import {Ut} from '../ut.js';
// import {emm} from '../../../common/glyphName.js'

export class Key {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }

  // draw(pm) {
  //   let o = Ut.clefOffset(this);
  //   o.x = pm.cursor;
  //   let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[this.toS()]});
  //   pm.g.append(t);
  // }

  // toS() {
  //   return this.sign + this.change;
  // }
}
