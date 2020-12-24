import {emm} from '../../common/glyphName.js'

export class SVGBuilder {
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
    Object.keys(o).forEach( p => {
      if ('string' != typeof o[p] && isNaN(o[p])) dfgdgfdggd;
      e.setAttributeNS(null, p, o[p])
    });
    return e;
  }

  static emmentaler(o) {
    let e = SVGBuilder.createSVG('text');
    e.setAttributeNS(null, 'x', o.x);
    if (isNaN(o.y)) fsdgdsgsdg;
    e.setAttributeNS(null, 'y', o.y);
    e.innerHTML = o.text;
    e.style.fontFamily = 'Emmentaler';
    e.style.fontSize = SVGBuilder.fontSize;
    return e;
  }

  static text(o) {
    let e = SVGBuilder.createSVG('text');
    e.setAttributeNS(null, 'x', o.x);
    e.setAttributeNS(null, 'y', o.y);
    e.innerHTML = o.text;
    return e;
  }

  static toEmm(text) {
    return text.toString().split('').map(e => emm.Number[e]).join('');
  }

  static keySignatureOffset(clef, staff) {
    let y;
    if (1 == staff) {
      if (-1 != clef.indexOf('G'))
        y = 114;
      if (-1 != clef.indexOf('F'))
        y = 129;
    } else {
      if (-1 != clef.indexOf('G'))
        y = 272;
      if (-1 != clef.indexOf('F'))
        y = 287;
    }
    return y;
  }

  static keySignature(clef1, clef2, fifths, dx) {
    let g = SVGBuilder.createSVG('g');
    let clef = {
      1: clef1,
      2: clef2
    }
    let yy;
    let acc;
    let ys;
    if (fifths < 0) {
      yy = [0, -22.5];
      ys = (new Array(7)).fill(1).map( (e, i) => [{x: dx + 14 * i, y: yy[i % 2] + Math.floor(i / 2) * 7.5}][0]).slice(0, Math.abs(fifths));
      acc = emm.Accidental.flat;
    } else {
      yy = [-32, -9.5, -39.5, -17, 5.5, -24.5, -2];
      ys = (new Array(7)).fill(1).map( (e, i) => [{x: dx + 14 * i, y: yy[i]}][0]).slice(0, Math.abs(fifths));
      acc = emm.Accidental.sharp;
    }

    [1, 2].forEach( staff => {
      let dy = SVGBuilder.keySignatureOffset(clef[staff], staff);
      ys.forEach( (xy, i) => {
        let t = SVGBuilder.emmentaler({x: xy.x, y: dy + xy.y, text: acc});
        g.append(t);
      });
    });

    return g;
  }

  static setTimeSignature(beats, type, x) {
    let g = SVGBuilder.createSVG('g');
    [14, 172].forEach(dy => {
      [
        {x: x, y: 99 + dy, text: SVGBuilder.toEmm(beats)},
        {x: x, y: 129 + dy, text: SVGBuilder.toEmm(type)},
      ].forEach( e => g.append(SVGBuilder.emmentaler({x: e.x, y: e.y, text: e.text})));
    })
    return g;
  }

  static setAttr(obj, attr) {
    Object.keys(attr).forEach( p => {
      obj.setAttributeNS(null, p, attr[p])
    });
  }
}

