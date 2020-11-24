class PrintMachine {
  constructor(sheet) {
    this.sheet = sheet;
    this.tm = this.sheet.timeMachine;
    this.at = this.tm.arrowOfTime;
    this.ticks = Object.keys(this.tm.arrowOfTime).map(e => parseInt(e));
    this.printClasses = {
      'measure' : 0,
      'clef': 0,
      'note': 0
    }
    this.drawClef = {};
    this.noteIndex = 0;
    this.measureIndex = 0;
    this.cursor = 0;
    this.assignToNextTick = [];
    this.sb = new StemBuilder(this);
    this.tb = new TieBuilder(this);
    this.articulation = new ArticulationBuilder(this);
    this.restYOffset = {
      1: 112,
      2: 270
    }
  }

  measure(xml) {
    let e = SVGBuilder.line({x1: this.cursor, y1: 84, x2: this.cursor, y2: 302, 'stroke-width': 2, stroke: 'black'})
    let t = SVGBuilder.text({x: this.cursor - 5, y: 71, text: xml.getAttribute('number')});
    this.sheet.g.append(t);
    this.sheet.g.append(e);
    this.cursor += 10;
  }

  clef(xml) {
    let c = new Clef(xml);
    this.assignToNextTick.push(c);
  }

  note(xml) {
    let note = this.tm.notes[this.noteIndex];
    let tick = this.at[note.tick];
    if (0 < this.assignToNextTick.length) {
      if (undefined == tick.clef) {
        tick.clef = this.assignToNextTick.slice();
      } else {
        tick.clef.push(...this.assignToNextTick.slice());
      }
      this.assignToNextTick = [];
    }
    this.noteIndex += 1;
  }

  startPrint(xml) {
    if (xml.tagName in this.printClasses) {
      this[xml.tagName](xml);
    }
  }

  drawAdditionalLineNote(tick, note) {
    let l = note.drawLine(this.drawClef);
    let c = Math.floor(Math.abs(l > 0 ? l - 9 : l - 1) / 2);

    let border = {
      1: {
        1: 84,
        '-1': 144
      },
      2: {
        1: 242,
        '-1': 302
      }
    }
    let dx = Math.sign(l);
    let x1 = this.cursor - 7;
    let x2 = this.cursor + 25;

    for (let i = 1; i <= c; i++) {
      let y = border[note.staff][dx] - dx * 15 * i;
      let e = SVGBuilder.line({x1: x1, y1: y, x2: x2, y2: y, 'stroke-width': 2, stroke: 'black'});
      this.sheet.g.append(e);
    }
  }

  drawAdditionalLineTick(tick) {
    [1, 2].forEach(staff => {
      let edge = tick.chord
        .filter(n => (undefined == n.rest) && (staff == n.staff) && (n.drawLine(this.drawClef) < 0 || n.drawLine(this.drawClef) > 10))
        .sort((a, b) => a.drawLine(this.drawClef) - b.drawLine(this.drawClef));
      if (0 == edge.length) return;
      if (edge.length > 1) {
        edge = [edge[0], edge[edge.length - 1]];
      }
      edge.forEach(n => {
        this.drawAdditionalLineNote(tick, n);
      });
    });
  }

  drawNote(tick, n, i) {
    let nhead = emm.Notehead['s2'];
    if ('whole' == n.type) {
      nhead = emm.Notehead['s0'];
    } else if ('half' == n.type) {
      nhead = emm.Notehead['s1'];
    }
    n.x = this.cursor;
    if (i > 0) {
      if (1 == (n.stepLine - tick.chord[i-1].stepLine) && (n.staff == tick.chord[i-1].staff)) {
        let dx = 16;
        n.x += ((this.cursor == tick.chord[i-1].x) ? 16 : 0);
      }
    }

    n.y = n.drawY(this.drawClef);
    let t = SVGBuilder.emmentaler({x: n.x, y: n.y, text: nhead});

    if (n.grace) {
      t.style.fontSize = '45px';
    }
    tick.g.append(t);

    if (n.dot) {
      let s = emm.Dot.dot;
      if (1 == Math.abs(n.drawLine(this.drawClef)) % 2)
        s = emm.Dot.upper;
      let d = SVGBuilder.emmentaler({x: n.x + 22, y: n.y, text: s});
      tick.g.append(d);
    }
  }

  drawAccidental(tick) {
    let acc = tick.chord.filter(n => undefined != n.accidental);
    if (0 == acc.length) return;
    let dx = 0;
    let x = this.cursor;
    acc.forEach((n, i) => {
      n.y = n.drawY(this.drawClef);
      if (i > 0) {
        if (3 > (n.stepLine - acc[i-1].stepLine) && n.staff == acc[i-1].staff) {
          x += 16;
          dx = Math.max(dx, x - this.cursor);
        } else {
          x = this.cursor;
        }
      }
      let t = SVGBuilder.emmentaler({x: x, y: n.y, text: emm.Accidental[n.accidental]});
      tick.g.append(t);
    });
    this.cursor += (dx + 16);
  }

  drawTick(tick) {
    if (tick.clef instanceof Array) {
      tick.clef.forEach(c => {
        this.drawClef[c.number] = c;
        let o = Ut.clefOffset(c);
        o.x = this.cursor;
        let t = SVGBuilder.emmentaler({x: o['x'], y: o['y'], text: emm.Clef[c.toS()]});
        this.sheet.g.append(t);
      });
      this.cursor += 50;
    }

    this.drawAccidental(tick);

    this.drawAdditionalLineTick(tick);

    tick.chord.forEach( (n, i) => {
      if (n.rest) {
        let ntype = n.type;
        if (null == ntype) ntype = 'whole';
        let t = SVGBuilder.emmentaler({x: this.cursor, y: this.restYOffset[n.staff], text: emm.Rest[ntype]});
        tick.g.append(t);
        return;
      }
      this.drawNote(tick, n, i);
      this.sb.push(n);
      this.tb.push(n);
      this.articulation.push(n);
    });

    this.sb.draw();
    this.articulation.draw();

    tick.x = this.cursor;
    if (tick.chord[0].grace) {
      this.cursor += 25;
    } else {
      this.cursor += 50;
    }
  }

  drawTicksInMeasure() {
    let m = this.sheet.bars[this.measureIndex];

    if (null != m.fifths) {
      let clef1;
      let clef2;
      if (0 == this.measureIndex) {
        clef1 = this.sheet.grandStaff.header.clef[1];
        clef2 = this.sheet.grandStaff.header.clef[2];
      } else {
        clef1 = this.drawClef[1].toS();
        clef2 = this.drawClef[2].toS();
      }
      let g = SVGBuilder.keySignature(clef1, clef2, m.fifths, this.cursor);
      this.sheet.g.append(g);
      this.cursor += 100;
    }

    let from = m.from;
    if (from == 0) from = -10;
    let ticks = this.ticks.filter(e => from <= e && e < m.to).sort((a,b) => a - b);

    ticks.forEach(t => this.drawTick(this.at[t]));
    // this.drawTick(this.at[ticks[0]]);
  }

  finishPrint(xml) {
    if ('measure' == xml.tagName) {
      this.drawTicksInMeasure();
      this.measureIndex += 1;
    }
  }
}
