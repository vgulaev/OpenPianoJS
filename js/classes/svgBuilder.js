class SVGBuilder {
  static get xmlns() {
    return "http://www.w3.org/2000/svg";
  }

  static createSVG(tag) {
    return document.createElementNS(SVGBuilder.xmlns, tag);
  }

  static drawLine(x1, y1, x2, y2) {
    var line = SVGBuilder.createSVG("line");
    line.setAttributeNS (null, 'x1', x1);
    line.setAttributeNS (null, 'y1', y1);
    line.setAttributeNS (null, 'x2', x2);
    line.setAttributeNS (null, 'y2', y2);
    //line.setAttributeNS (null, 'stroke', "black");
    line.setAttributeNS (null, 'stroke-width', 3);
    return line;
  }

  static drawStem(coord, tails) {
    var g = SVGBuilder.createSVG("g");
    var line = this.drawLine.apply(this, coord);
    g.append(line);
    return g;
  }

  static drawDot(x, y, n, g) {
    var dy = (0 == n.stepLine % 2) ? 7.5 : 0;
    var dot = SVGBuilder.createSVG("circle");
    dot.setAttributeNS(null, "cx", x + 15);
    dot.setAttributeNS(null, "cy", y + 7 - dy);
    dot.setAttributeNS(null, "r", 3);
    g.append(dot);
  }

  static drawAccidental(x, y, n, g) {
    if (true == App.keyFifths[n.step + n.alter]) return;
    var accidental = SVGBuilder.createSVG("path");
    accidental.setAttributeNS (null, 'stroke-width', 1);
    accidental.setAttributeNS (null, 'd', ( -1 == n.alter ? SVGTmp.flat(x, y) : SVGTmp.sharp(x, y) ) );
    g.append(accidental);
  }

  static tiePath(x, y, l, n) {
    var path = SVGBuilder.createSVG("path");
    var k = "down" == n.stem ? 1: -1;
    var dy = 20;
    if ("down" == n.stem) {
      dy = -4;
    }

    var ll = -(l + x);
    var x1 = ll * 0.10;
    var x2 = ll * 0.90;
    var y1 = ll * 0.15 * k;
    var y2 = y1 + 2.5 * k;

    var res = `m ${x},${y + dy} c ${x1},${y1} ${x2},${y1} ${ll},0 ${-x1},${y2} ${-x2},${y2} ${-ll},0`;

    path.setAttributeNS(null, 'd', res);
    path.setAttributeNS(null, 'stroke-width', 1);
    return path;
  }

  static drawTie(x, y, n, g) {
    if ("start" == n.tie) {
      App.tieBuilder[n.staff][n.stepLine] = {x: x, y: y, n: n, g: g, absolutX: App.tieBuilder.x};
      return;
    }
    var s = App.tieBuilder[n.staff][n.stepLine];
    var w = s.n.chord.weight;
    var dx = App.tieBuilder.x - s.absolutX;
    var coord = [x, y + 10, 0 - (dx - s.x), y + 10];
    var path = this.tiePath(x, y, dx - s.x, n);
    g.append(path);
    var obj = App.tieBuilder[n.staff];
    delete obj[n.stepLine];
  }

  static svgElementsForNote(g, x, y, n, skipStem) {
    var path = SVGBuilder.createSVG("path");
    path.setAttributeNS (null, 'stroke-width', 1);

    var res = "";
    if (true == n.rest){
      if ("quarter" == n.type) {
        res = SVGTmp.quarterRest(x, y);
      } else if ("half" == n.type){
        res = `m 10,${y - 16} h 21 v -8 h -21 v 8`;
      } else {
        res = `m 10,${y - 21} h 21 v -8 h -21 v 8`;
      }
    } else {
      if (("quarter" == n.type)||("16th" == n.type)||("eighth" == n.type)) {
        if ((true != skipStem) && (undefined == n.beam)) {
          var coord = ("down" == n.stem) ? [x - 13, y + 55, x - 13, y + 10] : [x + 7, y - 39, x + 7, y + 6];
          var stem = this.drawStem(coord, n.type);
          g.append(stem);
        }
        res = SVGTmp.quarterNote(x, y);
      } else if ("half" == n.type) {
        if (true != skipStem) {
          var coord = ("down" == n.stem) ? [x - 13, y + 55, x - 13, y + 10] : [x + 7, y - 43, x + 7, y + 3];
          var stem = this.drawLine.apply(this, coord)
          g.append(stem);
        }
        res = SVGTmp.halfNote(x, y + 7);
      } else if ("whole" ==  n.type) {
        res = SVGTmp.wholeNote(x, y + 7);
      }
      if ((n.alter == -1)||(n.alter == 1)) this.drawAccidental(x, y, n, g);
      if (true == n.dot) this.drawDot(x, y, n, g);
      if (undefined !== n.tie) this.drawTie(x, y, n, g);
    }

    //path.setAttributeNS (null, 'opacity', 0.5);
    path.setAttributeNS (null, 'd', res);
    g.append(path);
  }

  static additionalLine(g, x, fromy, fromn, ton) {
      var direction = (fromn < ton) ? 1 : -1;
      var curn = fromn;
      while ( curn * direction <= ton * direction ) {
          var y = fromy - (curn - fromn) * 7.5;
          var line = this.drawLine(x - 22, y, x + 22, y);
          g.append(line);
          curn += direction * 2;
      }
  }

  static drawNote( g, n, dx, skipStem ) {
    var x = 25 + dx;
    if (true === n.rest) {
      y = (1 == n.staff) ? 129 : 287;
    } else {
      if (1 == n.staff) {
        var y = 129 + (31 - n.stepLine) * 7.5;
        if (n.stepLine > 39) {
            this.additionalLine(g, x, 69, 40, n.stepLine);
        } else if (n.stepLine < 29) {
            this.additionalLine(g, x, 159, 28, n.stepLine);
        }
      } else {
        var y = 287 + (19 - n.stepLine) * 7.5;
        if (n.stepLine > 27) {
            this.additionalLine(g, x, 227, 28, n.stepLine);
        } else if (n.stepLine < 29) {
            //this.additionalLine(g, x, 159, 28, n.stepLine);
        }
      }
    }

    this.svgElementsForNote(g, x, y, n, skipStem);
  }
}
SVGBuilder.measurePadding = 25;