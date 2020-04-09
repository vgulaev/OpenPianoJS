class Chord {
  constructor(measure = 0, clef, fifths) {
    this.notes = new Array();
    this.g = null;
    this.sign = "";
    this.measure = measure;
    this.clef = clef;
    this.fifths = fifths;
  }

  copy(options) {
    var res = new Chord();
    res.notes = this.notes.map((x) => (x.copy(options)));
    res.clef = this.clef;
    return res;
  }

  update(staff) {
    var a = this.notes;
    if ((1 == staff) || (2 == staff)) a = this.notes.filter( (x) => { return x.staff == staff } );
    this.sign = a.reduce( function (p, c) {
        p.push(c);
        return p;
      }, new KBSign());
  }

  renderV20(options = {}) {
    var g = SVGBuilder.createSVG ("g");
    g.setAttributeNS (null, "stroke", "black");
    this.g = g;
  }

  render(options = {}) {
    // return this.renderV20(options = {});
    var g = SVGBuilder.createSVG ("g");
    g.setAttributeNS (null, "stroke", "black");

    if (Math.abs(this.fifths) != Object.keys(App.keyFifths).length) {
      App.keyFifths = {};
      let gf = SVGBuilder.createSVG("g");
      gf.setAttributeNS (null, "class", "fifths");
      Fifths.drawAccidental(this.fifths, gf, -80);
      g.append(gf);
      Fifths.circle(this.fifths).forEach((e) => App.keyFifths[e] = true);
    }

    var dx = 0;
    if (options["drawBarLine"]) {
      dx = 30;
      var line = SVGBuilder.drawLine(0, 84, 0, 302);
      g.append(line);
      var text = SVGBuilder.createSVG("text");
      text.setAttributeNS(null, "y", "60");
      text.innerHTML = this.measure;
      g.append(text);
    }

    var gg = SVGBuilder.createSVG ("g");
    gg.setAttributeNS (null, "class", "N");
    gg.setAttributeNS (null, "stroke", "black");
    gg.setAttributeNS (null, "fill", "black");
    var a = SVGBuilder.createSVG ("animate");
    a.setAttributeNS(null, "attributeName", "fill");
    a.setAttributeNS(null, "values", "green;black");
    a.setAttributeNS(null, "dur", "5s");
    a.setAttributeNS(null, "begin", "indefinite");
    gg.append(a);
    var a = SVGBuilder.createSVG ("animate");
    a.setAttributeNS(null, "attributeName", "stroke");
    a.setAttributeNS(null, "values", "green;black");
    a.setAttributeNS(null, "dur", "5s");
    a.setAttributeNS(null, "begin", "indefinite");
    gg.append(a);
    var shift = 0;
    var skipStem = false;
    for (var i = 0; i < this.notes.length; i++) {
      var n = this.notes[i];
      if (true == n.grace) {
        gg.setAttributeNS (null, "fill", "grey");
        gg.setAttributeNS (null, "stroke", "grey");
      }
      if ("up" == n.stem) {
        if ((i > 0) && (n.staff == this.notes[i-1].staff) && (1 == n.stepLine - this.notes[i-1].stepLine) ) {
          shift = 19;
          skipStem = true;
        } else {
          shift = 0;
          skipStem = false;
        }
      } else {
        if ((i < this.notes.length - 1) && (n.staff == this.notes[i+1].staff) && (1 == this.notes[i+1].stepLine - n.stepLine) ) {
          shift = -19;
          skipStem = true;
        } else {
          shift = 0;
          skipStem = false;
        }
      }
      skipStem = skipStem && (undefined == this.notes[i].beam);
      var note = SVGBuilder.drawNote(gg, this.notes[i], dx + shift, skipStem);
    }
    g.append(gg);

    if (App.currentClef != this.clef && undefined != App.currentClef) {
      let d;
      if (App.currentClef[1] != this.clef[1]) {
        let clef = SVGBuilder.createSVG("path");
        clef.setAttributeNS (null, 'stroke-width', 1);
        if ('G2' == this.clef[1]) d = SVGTmp.clefG2(dx - 65, 114);
        if ('G2$1' == this.clef[1]) d = SVGTmp.clefG2(dx - 65, 114);
        if ('F4' == this.clef[1]) d = SVGTmp.clefF4(dx - 20, 85);
        clef.setAttributeNS (null, 'd', d);
        g.append(clef);
      } else if (App.currentClef[2] != this.clef[2]) {
        let clef = SVGBuilder.createSVG("path");
        clef.setAttributeNS (null, 'stroke-width', 1);
        if ('G2' == this.clef[2]) d = SVGTmp.clefG2(dx - 65, 272);
        if ('F4' == this.clef[2]) d = SVGTmp.clefF4(dx - 20, 252);
        clef.setAttributeNS (null, 'd', d);
        g.append(clef);
      }
    }

    this.g = g;
    this.xborder = 10 + dx;
    this.weight = 70 + dx;
  }

  makeGreen() {
    var c = this.g.getElementsByTagName("animate");
    for (var e of c) {
      e.beginElement();
    }
  }
}
