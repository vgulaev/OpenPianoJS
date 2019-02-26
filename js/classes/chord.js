class Chord {
  constructor(measure = 0, clef) {
    this.notes = new Array();
    this.g = null;
    this.sign = "";
    this.measure = measure;
    this.clef = clef;
  }

  copy(options) {
    var res = new Chord();
    res.notes = this.notes.map((x) => (x.copy(options)));
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

  render(options = {}) {
    var g = SVGBuilder.createSVG ("g");
    g.setAttributeNS (null, "stroke", "black");

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
      var note = SVGBuilder.drawNote(gg, this.notes[i], dx + shift, skipStem);
    }
    g.append(gg);
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
