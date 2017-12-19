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

  static svgElementsForNote(g, x, y, n, skipStem) {
    var path = SVGBuilder.createSVG("path");
    path.setAttributeNS (null, 'stroke-width', 1);

    var res = "";
    if (true == n.rest){
      if ("quarter" == n.type) {
        res = SVGTmp.quarterRest(x, y);
      } else if ("half" == n.type){
        res = `m 10,${y - 16} h 21 v -8 h -21 v 8`;
      }
    } else {
      if (("quarter" == n.type)||("16th" == n.type)||("eighth" == n.type)) {
        if ((true != skipStem) && (undefined == n.beam)) {
          var coord = ("down" == n.stem) ? [x - 13, y + 55, x - 13, y + 10] : [x + 7, y - 39, x + 7, y + 6];
          var stem = this.drawLine.apply(this, coord)
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
      if ((n.alter == -1)||(n.alter == 1)) {
        var accidental = SVGBuilder.createSVG("path");
        accidental.setAttributeNS (null, 'stroke-width', 1);
        accidental.setAttributeNS (null, 'd', ( -1 == n.alter ? SVGTmp.flat(x, y) : SVGTmp.sharp(x, y) ) );
        g.append(accidental);
        console.log("write bemmol");
      }
    }

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
      }
    }

    this.svgElementsForNote(g, x, y, n, skipStem);
  }
}
SVGBuilder.measurePadding = 25;