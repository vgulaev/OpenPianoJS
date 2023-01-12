import {SVGBuilder} from './svgBuilder.js';

export class GrandStaffBody {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.root = SVGBuilder.createSVG('svg');
    this.height = this.grandStaff.header.height;
    this.width = window.innerWidth - this.grandStaff.header.root.width.baseVal.value - 50;
    this.root.setAttributeNS(null, 'height', this.height);
    this.root.setAttributeNS(null, 'width', this.width);

    this.drawStaffLine(this.root, this.width);
    this.drawRubicon();

    this.grandStaff.root.append(this.root);
  }

  drawRubicon() {
    var rubicon = SVGBuilder.createSVG("polygon");
    rubicon.setAttributeNS(null, "points", "380,54 400,54 400,332 380,332")
    rubicon.setAttributeNS(null, "stroke", "blue");
    rubicon.setAttributeNS(null, "fill", "blue");
    rubicon.setAttributeNS(null, "opacity", "0.5");
    this.rubicon = rubicon;
    this.root.append(rubicon);
  }

  drawStaffLine(g, width) {
    [84, 242].forEach( lvl => {
      for (let y = lvl; y <= lvl + 15 * 4; y += 15) {
        g.append(SVGBuilder.line({x1: 0, y1: y, x2: width, y2: y, 'stroke-width': 2, stroke: 'black'}));
      }
    });
  }
}
