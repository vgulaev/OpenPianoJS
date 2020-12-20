class GrandStaffHeader {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.width = 210;
    this.height = 450;
    this.clef = {};
    this.root = SVGBuilder.createSVG('svg');
    this.root.setAttributeNS(null, 'height', this.height);
    this.root.setAttributeNS(null, 'width', this.width);

    this.root.append(SVGBuilder.line({x1: 25, y1: 84, x2: 25, y2: 302, 'stroke-width': 2, stroke: 'black'}));
    this.root.append(SVGTmp.grandBracket());

    this.drawStaffLine();
    this.grandStaff.root.append(this.root);
  }

  drawStaffLine() {
    [84, 242].forEach( lvl => {
      for (let y = lvl; y <= lvl + 15 * 4; y += 15) {
        this.root.append(SVGBuilder.line({x1: 25, y1: y, x2: this.width, y2: y, 'stroke-width': 2, stroke: 'black'}));
      }
    });
  }

  findOrCreate(name, tag) {
    let e = this.root.getElementById(name);
    if (null == e) {
      e = SVGBuilder.createSVG(tag);
      e.setAttributeNS(null, 'id', name);
    }
    return e;
  }

  setKeySignature(fifths) {
    let g = this.findOrCreate(`KeySignature`, 'g');
    g.innerHTML = SVGBuilder.keySignature(this.clef[1], this.clef[2], fifths, 73).innerHTML;
    this.root.append(g);
  }

  setClef(clef) {
    this.clef[clef.number] = clef.toS();
    let id = `Clef${clef.number}`;
    let o = Ut.clefOffset(clef);
    let t = document.getElementById(id);
    if (t != null)
      t.remove();
    t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[clef.toS()]});
    t.setAttributeNS(null, 'id', `Clef${clef.number}`);

    this.root.append(t);
  }
}
