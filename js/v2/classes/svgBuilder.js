class SVGBuilder {
  static get xmlns() {
    return 'http://www.w3.org/2000/svg';
  }

  static createSVG(tag) {
    return document.createElementNS(SVGBuilder.xmlns, tag);
  }

  static line(o) {
    let e = SVGBuilder.createSVG ('line');
    Object.keys(o).forEach( p => e.setAttributeNS (null, p, o[p]));
    return e;
  }

}

