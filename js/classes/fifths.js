class Fifths {
  static circle(index) {
    var uno = "1";
    let notes = "FCGDAEB".split("");
    let res = notes;
    if (index < 0) {
      uno = "-1";
      res = notes.reverse();
    }

    return res.splice(0, Math.abs(index)).map((x) => x + uno);
  }

  static drawAccidental(fifths, g, dx = 0) {
    var n;
    if (-6 == fifths) {
      n = new Note({step: "A", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "G", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
      n = new Note({step: "C", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);

      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "A", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "G", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
      n = new Note({step: "C", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
    } else if (-5 == fifths) {
      n = new Note({step: "A", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "G", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "A", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "G", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
    } else if (-4 == fifths) {
      n = new Note({step: "A", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "A", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "D", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
    } else if (-3 == fifths) {
      n = new Note({step: "A", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 110, n.y, n, g);
      n = new Note({step: "A", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 124, n.y, n, g);
    } else if (-2 == fifths) {
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
    } else if (-1 == fifths) {
      n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
    } else if (1 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "F", alter: 1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
    } else if (2 == fifths) {
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "F", alter: 1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
    } else if (3 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "G", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
    } else if (4 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "G", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "D", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
    } else if (5 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "G", alter: 1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "D", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
      n = new Note({step: "A", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
    } else if (6 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 95, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "G", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "D", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "A", alter: 1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "E", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
    } else if (7 == fifths) {
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 95, n.y, n, g);
      n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 105, n.y, n, g);
      n = new Note({step: "G", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 115, n.y, n, g);
      n = new Note({step: "D", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "A", alter: 1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 125, n.y, n, g);
      n = new Note({step: "B", alter: 1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(dx + 95, n.y, n, g);
      n = new Note({step: "E", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(dx + 135, n.y, n, g);
    }
  }
}
