import {SVGBuilder} from '../classes/svgBuilder.js';

export function Coacher() {
  this.createLineAt = (index, pos) => {
    let dx = ('to' == pos ? 25 : -7);
    let x = this.getX(index) + dx;
    let l = SVGBuilder.line({x1: x, y1: 84, x2: x, y2: 302, 'stroke-width': 4, stroke: 'green'});
    this.app.sheet.g.append(l);
    return l;
  }
}
