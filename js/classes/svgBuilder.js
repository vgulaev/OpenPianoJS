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

  static drawPath(d, g) {
    var path = SVGBuilder.createSVG("path");
    path.setAttributeNS (null, 'stroke-width', 1);
    path.setAttributeNS (null, 'd', d );
    g.append(path);
  }

  static drawBeam(b, n, g) {
    var a = App.beamBuilder[n.v2.beamIndex][1];
    var ax = [], ay = [];
    a.forEach((x) => {
      ax.push(x[1] - App.tieBuilder.x + x[0][0]);
      ay.push( ("down" == x[2].stem) ? Math.max(x[0][1], x[0][3]) : Math.min(x[0][1], x[0][3]));
    });
    var y1 = 0, y2 = 0, x1 = 0, x2 = 0;
    x1 = Ut.min(ax);
    x2 = Ut.max(ax);

    var maxy = Ut.max(ay);
    var miny = Ut.min(ay);

    var li = ay.length - 1;
    if ((maxy == ay[0])&&(miny == ay[li])) {
      y1 = maxy; y2 = miny;
    } else if ((maxy == ay[li])&&(miny == ay[0])) {
      y2 = maxy; y1 = miny;
    } else {
      ("down" == n.stem) ? y1 = y2 = maxy : y1 = y2 = miny;
    }

    var dy = (b - 1) * 5;
    var l = this.drawLine(x1, y1 + dy, x2, y2 + dy);
    l.setAttributeNS(null, "stroke-width", 6);
    g.append(l);

    var k = (x2 - x1) / (y2 - y1);
    for (var i = 0; i < a.length; i++) {
      var ey = y1 + (ax[i] - x1) / k;
      if ("down" == a[i][2].stem) {
        var cy = Math.min(a[i][0][1], a[i][0][3]);
      } else {
        cy = Math.max(a[i][0][1], a[i][0][3]);
      }
      var l = this.drawLine(ax[i], ey, ax[i], cy);
      g.append(l);
    }

    a.length = 0;

    for (var i = 2; i < 5; i++) {
      a = App.beamBuilder[n.v2.beamIndex][i];
      if (0 == a.length) break;
      ax.length = 0;
      a.forEach((x) => {
        ax.push(x[1] - App.tieBuilder.x + x[0][0]);
      });
      var xx1 = Ut.min(ax);
      var xx2 = Ut.max(ax);
      if (1 == a.length) xx2 += -20;
      var yy1 = y1 + (xx1 - x1) / k + n.k * (i - 1) * 12;
      var yy2 = y1 + (xx2 - x1) / k + n.k * (i - 1) * 12;

      var l = this.drawLine(xx1, yy1, xx2, yy2);
      l.setAttributeNS(null, "stroke-width", 6);
      g.append(l);
      a.length = 0;
    }
  }

  static drawStem(coord, n, g) {
    //return;
    if (undefined !== n.beam) {
      for (var b of n.beam) {
        if (undefined == App.beamBuilder[n.v2.beamIndex]) {
          App.beamBuilder[n.v2.beamIndex] = {"1": [], "2": [], "3": [], "4": [], "5": []};
        }
        var beamPull = App.beamBuilder[n.v2.beamIndex][b[0]];
        beamPull.push([coord, App.tieBuilder.x, n]);
        if (("end" == b[1])&&("1" == b[0])) this.drawBeam(b[0], n, g);
      }
      return;
    }
    if ((true == n.chord) && undefined != App.beamBuilder[n.v2.beamIndex] && (App.beamBuilder[n.v2.beamIndex][1].length > 0)) return;
    //var g = SVGBuilder.createSVG("g");
    var line = this.drawLine.apply(this, coord);
    if ("eighth" == n.type) {
      var d = ("down" == n.stem) ? SVGTmp.tail8Down(coord[2] + 13, coord[3] + 10) : SVGTmp.tail8Up(coord[2] + 13, coord[3] - 10);
      this.drawPath(d, g);
    } else if ("16th" == n.type) {
      var d = ("down" == n.stem) ? SVGTmp.tail16Down(coord[2], coord[3]) : SVGTmp.tail16Up(coord[2], coord[3]);
      this.drawPath(d, g);
    }
    g.append(line);
    //return g;
  }

  static drawCircle(g, x, y, r) {
    var dot = SVGBuilder.createSVG("circle");
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", r);
    g.append(dot);
  }

  static drawDot(x, y, n, g) {
    var dy = (0 == n.stepLine % 2) ? 7.5 : 0;
    this.drawCircle(g, x + 15, y + 7 - dy, 3)
  }

  static drawStaccato(x, y, n, g) {
    this.drawCircle(g, x, y - 10, 3);
  }

  static drawAccidental(x, y, n, g) {
    if (undefined == n.alter) {
      if ((undefined == App.keyFifths[n.step + "1"])&&(undefined == App.keyFifths[n.step + "-1"])) return;
    } else {
      if (true == App.keyFifths[n.step + n.alter]) return;
    }
    var accidental = SVGBuilder.createSVG("path");
    accidental.setAttributeNS (null, 'stroke-width', 1);
    var d = "";
    if (undefined == n.alter) d = SVGTmp.natural(x, y);
    if (n.alter < 0) d = SVGTmp.flat(x, y);
    if (1 == n.alter) d = SVGTmp.sharp(x, y);
    if (2 == n.alter) d = SVGTmp.doubleSharp(x, y);
    accidental.setAttributeNS (null, 'd', d);
    g.append(accidental);
    if (-2 == n.alter) {
      accidental = SVGBuilder.createSVG("path");
      d = SVGTmp.flat(x - 10, y);
      accidental.setAttributeNS (null, 'd', d);
      g.append(accidental);
    }
  }

  static tieSlur(n) {
    // let l = App.slur["stop"].x - App.slur["start"].x - 25;
    // let x = App.slur["start"].x;
    // let y = App.slur["start"].y;

    // var path = SVGBuilder.createSVG("path");

    // var k = "above" == App.slur.placement ? -1: 1;

    // var dy = 20;
    // if ("down" == n.stem) {
    //   dy = -4;
    // }

    // var ll = -(l + x);
    // var x1 = ll * 0.10;
    // var x2 = ll * 0.90;
    // var y1 = ll * 0.15 * k;
    // var y2 = y1 + 2.5 * k;
    // var dy = App.slur["start"].y - App.slur["stop"].y

    // // var res = `m ${x},${y + dy} c ${x1},${y1} ${x2},${y1} ${ll},0 ${-x1},${y2} ${-x2},${y2} ${-ll},0`;
    // var res = `m ${x} ${y + 20 * k} c 0 0, ${ll / 2 * k} ${dy / 2 * k}, ${ll} ${dy + 20 * k}`;

    // path.setAttributeNS(null, 'd', res);
    // path.setAttributeNS(null, 'stroke-width', 2);
    // path.setAttributeNS(null, 'fill', "transparent");
    // return path;
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
    if (true == n.v2.tie.stop) {
      var s = App.tieBuilder[n.staff][n.stepLine];
      var w = s.n.parentChord.weight;
      var dx = App.tieBuilder.x - s.absolutX;
      var coord = [x, y + 10, 0 - (dx - s.x), y + 10];
      var path = this.tiePath(x, y, dx - s.x, n);
      g.append(path);
      var obj = App.tieBuilder[n.staff];
      delete obj[n.stepLine];
    }
    if (true == n.v2.tie.start) {
      App.tieBuilder[n.staff][n.stepLine] = {x: x, y: y, n: n, g: g, absolutX: App.tieBuilder.x};
      return;
    }
  }

  static drawFingering(x, y, n, g) {
    var text = SVGBuilder.createSVG("text");
    text.setAttributeNS(null, "font-size", "20");
    //var dy = (1 == n.staff) ? 10 : -50
    var dy = ("down" == n.stem) ? 10 : -50
    text.setAttributeNS(null, "y", y - dy);
    text.setAttributeNS(null, "x", x);
    text.innerHTML = n.fingering;
    g.append(text);
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
      } else if ("16th" == n.type){
        res = SVGTmp._16thRest(x, y);
      } else {
        res = `m 10,${y - 21} h 21 v -8 h -21 v 8`;
      }
    } else {
      if (("16th" == n.type)||("32nd" == n.type)||("64th" == n.type)||("eighth" == n.type)||("quarter" == n.type)) {
        if (true != skipStem) { // && (undefined == n.beam)) {
          var coord = ("down" == n.stem) ? [x - 13, y + 55, x - 13, y + 10] : [x + 7, y - 39, x + 7, y + 6];
          this.drawStem(coord, n, g);
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
      // if ((n.alter == -1)||(n.alter == 1)||(n.alter == 2))
      this.drawAccidental(x, y, n, g);
      // console.log(n.notations);
      if (true == n.staccato) this.drawStaccato(x, y, n, g);
      if (true == n.dot) this.drawDot(x, y, n, g);
      if (undefined !== n.tie) this.drawTie(x, y, n, g);
      if (undefined !== n.fingering) this.drawFingering(x, y, n, g);
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
    let x = 25 + dx;
    let y = 0;
    if (true === n.rest) {
      y = (1 == n.staff) ? 129 : 287;
    } else {
      if (1 == n.staff) {
        let dn = 31;
        if ('G2' == n.parentChord.clef[1]) {
          dn = 31;
        } else if ('G2$1' == n.parentChord.clef[1]) {
          dn = 38;
        } else if ('F4' == n.parentChord.clef[1]) {
          dn = 19;
        };
        y = 129 + (dn - n.stepLine) * 7.5;
        if (n.stepLine > dn + 8) {
            this.additionalLine(g, x, 69, dn + 9, n.stepLine);
        } else if (n.stepLine < dn - 2) {
            this.additionalLine(g, x, 159, dn - 3, n.stepLine);
        }
      } else {
        let dn = 19;
        if ('G2' == n.parentChord.clef[2]) {
          dn = 31;
        } else if ('F4' == n.parentChord.clef[2]) {
          dn = 19;
        };
        y = 287 + (dn - n.stepLine) * 7.5;
        if (n.stepLine > dn + 8) {
            this.additionalLine(g, x, 227, dn + 9, n.stepLine);
        } else if (n.stepLine < dn - 2) {
            this.additionalLine(g, x, 317, dn - 3, n.stepLine);
        }
      }
    }

    if (undefined != n.slur) {
      App.slur[n.slur.type] = {
        x: App.absolutX, y: y
      };
      if ("start" == n.slur.type) {
        App.slur.placement = n.slur.placement;
      }
      if ("stop" == n.slur.type) {
        let s = this.drawLine(App.slur["start"].x - App.slur["stop"].x + 25, y + 50, x, y + 50);
        // let l = App.slur["start"].x - App.slur["stop"].x + 25 + x;
        // let s = this.tieSlur(n);
        g.append(s);
        // console.log(App.slur);
      }
    }

    this.svgElementsForNote(g, x, y, n, skipStem);
  }
}
SVGBuilder.measurePadding = 25;
