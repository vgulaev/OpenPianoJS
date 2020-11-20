class GrandStaffHeader {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.root = SVGBuilder.createSVG('svg');
    this.root.setAttributeNS(null, 'height', 450);
    this.root.setAttributeNS(null, 'width', 148);

    this.root.append(SVGBuilder.line({x1: 25, y1: 84, x2: 25, y2: 302, 'stroke-width': 2, stroke: 'black'}));
    this.root.append(SVGTmp.grandBracket());

    this.drawStaffLine();
    this.setClef('g8', 1);
    this.setClef('f', 2);
    this.setClef('g', 2);
    this.setClef('f', 1);

    this.grandStaff.root.append(this.root);
  }

  drawStaffLine() {
    [84, 242].forEach( lvl => {
      for (let y = lvl; y <= lvl + 15 * 4; y += 15) {
        this.root.append(SVGBuilder.line({x1: 25, y1: y, x2: 148, y2: y, 'stroke-width': 2, stroke: 'black'}));
      }
    });
  }

  clefOffset(type, staff) {
    let res = {x: 32}
    if (1 == staff) {
      if (-1 != ['g', '8g', 'g8'].indexOf(type))
        res.y = 128;
      if (-1 != ['f', '8f', 'f8'].indexOf(type))
        res.y = 101;
    } else {
      if (-1 != ['f', '8f', 'f8'].indexOf(type))
        res.y = 259;
      if (-1 != ['g', '8g', 'g8'].indexOf(type))
        res.y = 286;
    }
    return res;
  }

  findOrCreateClef(staff) {
    let e = this.root.getElementById(`Clef${staff}`);
    if (null == e)
      return SVGBuilder.createSVG('text');
    return e;
  }

  setClef(type, staff) {
    let o = this.clefOffset(type, staff);
    let t = this.findOrCreateClef(staff); // SVGBuilder.createSVG('text');
    t.setAttributeNS(null, 'id', `Clef${staff}`);
    t.setAttributeNS(null, 'x', o['x']);
    t.setAttributeNS(null, 'y', o['y']);
    t.innerHTML = emm.Clef[type];
    t.style.fontFamily = 'Emmentaler';
    t.style.fontSize = '55px';

    this.root.append(t);
  }
}
