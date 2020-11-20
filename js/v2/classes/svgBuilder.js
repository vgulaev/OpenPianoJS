class SVGBuilder {
  static get xmlns() {
    return 'http://www.w3.org/2000/svg';
  }

  static get fontSize() {
    return '55px';
  }

  static createSVG(tag) {
    return document.createElementNS(SVGBuilder.xmlns, tag);
  }

  static line(o) {
    let e = SVGBuilder.createSVG ('line');
    Object.keys(o).forEach( p => e.setAttributeNS (null, p, o[p]));
    return e;
  }

  static emmentaler(o) {
    let e = SVGBuilder.createSVG('text');
    e.setAttributeNS(null, 'x', o.x);
    e.setAttributeNS(null, 'y', o.y);
    e.innerHTML = o.text;
    e.style.fontFamily = 'Emmentaler';
    e.style.fontSize = SVGBuilder.fontSize;
    return e;
  }

  static toEmm(text) {
    return text.toString().split('').map(e => emm.Number[e]).join('');
  }
}

