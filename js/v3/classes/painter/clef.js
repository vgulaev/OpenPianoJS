class Clef {
  constructor(xml) {
    this.xml = xml;
    this.change = 0;
    this.number = xml.getAttribute('number');
    Ut.parseChildren(this, xml);
  }

  draw(pm) {
    let o = Ut.clefOffset(this);
    o.x = pm.cursor;
    let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[this.toS()]});
    pm.g.append(t);
  }

  toS() {
    return this.sign + this.change;
  }
}
