class Chord {
  constructor(measure = 0) {
    this.notes = new Array();
    this.g = null;
    this.sign = "";
    this.measure = measure;
  }

  update() {
    this.sign = this.notes.
      reduce(function (p, c) {
        p.push(c);
        return p;
      }, new KBSign());
//       map(n => n.midiByte).
//       filter(x => x > 0).
//       sort().join(",");
  }

  render(options = {}) {
    var g = SVGBuilder.createSVG ("g");

    var dx = 0;
    if (options["drawBarLine"]) {
      dx = 30;
      var line = SVGBuilder.drawLine(0, 84, 0, 302);
      g.append(line);
    }

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
      var note = SVGBuilder.drawNote(g, this.notes[i], dx + shift, skipStem);
    }
    this.g = g;
    this.xborder = 10 + dx;
    this.weight = 70 + dx;
  }
}
