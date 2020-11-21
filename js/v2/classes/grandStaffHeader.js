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
    // this.setClef('g8', 1);
    // this.setClef('f', 2);
    this.setClef('g', 2);
    this.setClef('f', 1);

    this.setKeySignature(7);
    this.setTimeSignature(12, 8);

    this.grandStaff.root.append(this.root);
  }

  drawStaffLine() {
    [84, 242].forEach( lvl => {
      for (let y = lvl; y <= lvl + 15 * 4; y += 15) {
        this.root.append(SVGBuilder.line({x1: 25, y1: y, x2: this.width, y2: y, 'stroke-width': 2, stroke: 'black'}));
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

  keySignatureOffset(staff) {
    let y;
    if (1 == staff) {
      if (-1 != ['g', '8g', 'g8'].indexOf(this.clef[staff]))
        y = 114;
      if (-1 != ['f', '8f', 'f8'].indexOf(this.clef[staff]))
        y = 129;
    } else {
      if (-1 != ['g', '8g', 'g8'].indexOf(this.clef[staff]))
        y = 272;
      if (-1 != ['f', '8f', 'f8'].indexOf(this.clef[staff]))
        y = 287;
    }
    return y;
  }

  findOrCreate(name, tag) {
    let e = this.root.getElementById(name);
    if (null == e) {
      e = SVGBuilder.createSVG(tag);
      e.setAttributeNS(null, 'id', name);
    }
    return e;
  }

  setTimeSignature(beats, type) {
    let g = this.findOrCreate(`TimeSignature`, 'g');
    g.innerHTML = '';
    [0, 158].forEach(dy => {
      [
        {x: 165, y: 99 + dy, text: SVGBuilder.toEmm(beats)},
        {x: 165, y: 129 + dy, text: SVGBuilder.toEmm(type)},
      ].forEach( e => g.append(SVGBuilder.emmentaler({x: e.x, y: e.y, text: e.text})));
    })
    this.root.append(g);
  }

  setKeySignature(count) {
    let g = this.findOrCreate(`KeySignature`, 'g');
    g.innerHTML = '';
    let yy;
    let acc;
    let ys;
    if (count < 0) {
      yy = [0, -22.5];
      ys = (new Array(7)).fill(1).map( (e, i) => [{x: 73 + 12 * i, y: yy[i % 2] + Math.floor(i / 2) * 7.5}][0]).slice(0, Math.abs(count));
      acc = emm.Accidental.flat;
    } else {
      yy = [-32, -9.5, -39.5, -17, 5.5, -24.5, -2];
      ys = (new Array(7)).fill(1).map( (e, i) => [{x: 73 + 12 * i, y: yy[i]}][0]).slice(0, Math.abs(count));
      acc = emm.Accidental.sharp;
    }

    [1, 2].forEach( staff => {
      let dy = this.keySignatureOffset(staff);
      ys.forEach( (xy, i) => {
        let t = SVGBuilder.emmentaler({x: xy.x, y: dy + xy.y, text: acc});
        g.append(t);
      });
    });

    this.root.append(g);
  }

  setClef(type, staff) {
    this.clef[staff] = type;
    let id = `Clef${staff}`;
    let o = this.clefOffset(type, staff);
    let t = document.getElementById(id);
    if (t != null)
      t.remove();
    t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[type]});
    t.setAttributeNS(null, 'id', `Clef${staff}`);

    this.root.append(t);
  }
}
