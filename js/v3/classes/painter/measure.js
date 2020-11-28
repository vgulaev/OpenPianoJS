class Measure {
  constructor(xml) {
    this.xml = xml;
    this.number = xml.getAttribute('number');
  }

  draw(pm) {
    let e = SVGBuilder.line({x1: pm.cursor, y1: 84, x2: pm.cursor, y2: 302, 'stroke-width': 2, stroke: 'black'})
    let t = SVGBuilder.text({x: pm.cursor - 5, y: 71, text: this.xml.getAttribute('number')});
    pm.g.append(t);
    pm.g.append(e);
    pm.cursor += 10;
    // console.log('draw measure');
  }
}
