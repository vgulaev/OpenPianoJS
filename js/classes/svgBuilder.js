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
    line.setAttributeNS (null, 'stroke', "black");
    line.setAttributeNS (null, 'stroke-width', 3);
    return line;
  }

  static drawFingering(x, y, n, g) {
    var text = SVGBuilder.createSVG("text");
    text.setAttributeNS(null, "font-size", "20");
    var dy = (1 == n.staff) ? -50 : 10;
    //var dy = 10;
    text.setAttributeNS(null, "y", y - dy);
    text.setAttributeNS(null, "x", x);
    text.innerHTML = n.fingering;
    g.append(text);
  }

  static createNote( x, n, g ) {
    if (1 == n.staff) {
    var y = 129 + (31 - n.stepLine) * 7.5;
  } else {
    var y = 287 + (19 - n.stepLine) * 7.5;    
  }
    var path = SVGBuilder.createSVG("path");
    path.setAttributeNS (null, 'stroke', "#000000");
    path.setAttributeNS (null, 'stroke-width', 3);
    path.setAttributeNS (null, 'd', `m ${x},${y} c 1.875,0 3.4572,0.486 4.746,1.463999 1.2111,1.053 1.8165,2.382 1.8165,3.984 0,2.694 -1.3866,5.214 -4.1601,7.56 -2.8125,2.343 -5.8203,3.513 -9.0234,3.513 -1.875,0 -3.4572,-0.486 -4.7463,-1.464 -1.2108,-1.053 -1.8162,-2.382 -1.8162,-3.984 0,-2.694 1.4061,-5.214 4.2186,-7.56 2.7345,-2.342999 5.7228,-3.512999 8.9649,-3.512999 M ${x - 13},${y + 55} v -45`);
    g.appendChild(path);
    if (undefined != n.fingering) this.drawFingering(x, y, n, g)
  }

  static render(tenLines, measure, id, xShift) {
    var gForMove = SVGBuilder.createSVG("g");
    gForMove.setAttributeNS(null, "id", "piece" + id);

    var x = 0;
    for (var m of measure) {
      x += SVGBuilder.measurePadding;
      for (var c of m) {
        var g = SVGBuilder.createSVG("g");
        g.setAttributeNS(null, "opacity", 1);
        for (var n of c.notes) {
          SVGBuilder.createNote(x, n, g);
        }
        c.g = g;
        x += 50;
        gForMove.appendChild(g);
      }
      x -= SVGBuilder.measurePadding;

      var barLine = SVGBuilder.drawLine(x, 84, x, 302);
      gForMove.appendChild(barLine);
      gForMove.appendChild(g);
    }

    var defs = SVGBuilder.createSVG("defs")
    defs.appendChild(gForMove);

    var u = SVGBuilder.createSVG("use");
    //u.setAttributeNS(null, "id", "piece1");
    u.setAttributeNS(null, "href", "#piece" + id);
    u.setAttributeNS(null, "x", xShift);
    u.setAttributeNS(null, "y", 0);

    tenLines.appendChild(defs);
    tenLines.appendChild(u);
    return [defs, u];
  }
}
SVGBuilder.measurePadding = 25;