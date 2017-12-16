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

  static pathForNote(x, y, n, skipStem) {
    var res = "";
    if (true == n.rest){
      if ("quarter" == n.type) {
        res = `m ${x - 18},${y-18} c 0,-0.702 0.3906,-1.485 1.1718,-2.343 0.5862,-0.627 1.4454,-1.368 2.5782,-2.226 0.8595,-0.588 1.6992,-1.467 2.5197,-2.637 0.7812,-1.134 1.1718,-2.364 1.1718,-3.693 0,-1.563 -0.5079,-2.949 -1.5234,-4.161 l -2.1093,-2.517 c -0.1563,-0.156 -0.2346,-0.354 -0.2346,-0.588 0,-0.234 0.1173,-0.447 0.3516,-0.645 0.2736,-0.195 0.5079,-0.291 0.7032,-0.291 0.2733,0 0.4884,0.117 0.6444,0.351 l 9.0822,10.782 c 0.3906,0.507 0.5859,1.014 0.5859,1.524 0,0.702 -0.3906,1.482 -1.1718,2.343 -0.5079,0.546 -1.3479,1.29 -2.5197,2.226 -0.8985,0.546 -1.7577,1.425 -2.5782,2.637 -0.7812,1.134 -1.1718,2.364 -1.1718,3.69 0,1.641 0.4689,3.03 1.4064,4.161 l 5.0391,5.919 c 0.117,0.117 0.2148,0.312 0.2928,0.585 0,0.273 -0.0975,0.507 -0.2928,0.702 -0.2736,0.198 -0.5079,0.294 -0.7032,0.294 -0.0783,0 -0.3906,-0.213 -0.9375,-0.645 -0.5859,-0.468 -1.3671,-0.918 -2.3439,-1.347 -1.0935,-0.429 -2.1678,-0.645 -3.2226,-0.645 -0.9765,0 -1.7772,0.273 -2.4024,0.822 -0.5469,0.546 -0.8202,1.602 -0.8202,3.162 0,2.385 0.5664,4.26 1.6992,5.625 0.1173,0.156 0.1368,0.354 0.0585,0.588 -0.078,0.156 -0.2148,0.234 -0.4101,0.234 -0.2733,0 -0.879,-0.705 -1.8165,-2.109 -0.9765,-1.485 -1.8945,-3.186 -2.7537,-5.1 -0.8985,-2.031 -1.3476,-3.711 -1.3476,-5.037 0,-1.68 0.8007,-2.52 2.4021,-2.52 1.836,0 4.2189,0.624 7.1487,1.875 l -7.9104,-9.492 c -0.3906,-0.507 -0.5859,-1.017 -0.5859,-1.524`;
      } else if ("half" == n.type){
        res = `m 10,${y - 16} h 21 v -8 h -21 v 8`;
      }
    } else {
      if ("quarter" == n.type) {
        var stem = ("down" == n.stem) ? `M ${x - 13},${y + 55} v -45` : `M ${x + 7},${y - 39} v 45`;
        if (skipStem) stem = "";
        res = `m ${x},${y} c 1.875,0 3.4572,0.486 4.746,1.463999 1.2111,1.053 1.8165,2.382 1.8165,3.984 0,2.694 -1.3866,5.214 -4.1601,7.56 -2.8125,2.343 -5.8203,3.513 -9.0234,3.513 -1.875,0 -3.4572,-0.486 -4.7463,-1.464 -1.2108,-1.053 -1.8162,-2.382 -1.8162,-3.984 0,-2.694 1.4061,-5.214 4.2186,-7.56 2.7345,-2.342999 5.7228,-3.512999 8.9649,-3.512999 ${stem}`;
      } else if ("half" == n.type) {
          var stem = ("down" == n.stem) ? `M ${x - 13},${y + 49} v -45` : `M ${x + 7},${y - 43} v 45`;
          if (skipStem) stem = "";
          res = `m ${x+6},${y-4} c 0,-0.663 -0.255,-1.23 -0.762,-1.698 -0.507,-0.51 -1.092,-0.762 -1.758,-0.762 -1.17,0 -3.534,1.17 -7.089,3.513 -3.672,2.385 -5.919,4.083 -6.738,5.1 -0.429,0.546 -0.645,1.113 -0.645,1.698 0,0.663 0.255,1.23 0.762,1.701 0.468,0.507 1.053,0.759 1.758,0.759 1.131,0 3.516,-1.17 7.149,-3.513 3.594,-2.346 5.82,-4.044 6.678,-5.1 0.429,-0.507 0.645,-1.074 0.645,-1.698 m -3.105,-4.335 c 3.36,0 5.04,1.443 5.04,4.335 0,1.407 -0.411,3.048 -1.233,4.923 -0.819,1.836 -1.914,3.24 -3.279,4.218 -3.009,2.031 -6.777,3.045 -11.31,3.045 -3.36,0 -5.04,-1.443 -5.04,-4.335 0,-1.29 0.411,-2.91 1.233,-4.863 0.78,-1.875 1.875,-3.3 3.279,-4.278 3.009,-2.031 6.78,-3.045 11.31,-3.045 ${stem}`
      }
    }
    return res;
  }

  static additionalLine(g, x, fromy, fromn, ton) {
      var direction = (fromn < ton) ? 1 : -1;
      var curn = fromn;
      while ( curn * direction <= ton * direction ) {
          var y = fromy - (curn - fromn) * 7.5;
          var line = this.drawLine(x - 25, y, x + 20, y);
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
            this.additionalLine(x, 18, 40, n.stepLine);
        } else if (n.stepLine < 29) {
            this.additionalLine(g, x, 159, 28, n.stepLine);
        }
      } else {
        var y = 287 + (19 - n.stepLine) * 7.5;    
      }
    }
    var staffDirection = 0;
    var path = SVGBuilder.createSVG("path");
    path.setAttributeNS (null, 'stroke', "#000000");
    path.setAttributeNS (null, 'stroke-width', 3);
    path.setAttributeNS (null, 'd', this.pathForNote(x, y, n, skipStem));

    // if (1 == n.staff) {
    // } else {
    //     y = 175 - (absn - 17) * 6;
    //     if (absn < 17) {
    //         AdditionalLine(x, 187, 16, absn);
    //     } else if (absn > 27) {
    //         AdditionalLine(x, 115, 28, absn);
    //     }
    // }
    g.append(path);
    return path;
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