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
    // this.state = {
    //   clef: {}
    // };
    this.drawClef = {};
    this.noteIndex = 0;
    this.measureIndex = 0;
    this.cursor = 0;
    this.assignToNextTick = [];
    this.restYOffset = {
      1: 112,
      2: 270
    }
  }

  // copyState() {
  //   return {
  //     clef: {
  //       1: this.state.clef[1],
  //       2: this.state.clef[2]
  //     }
  //   }
  // }

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

  note_y(note) {

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

  drawStem(n) {
    console.log('drawStem');
  }

  drawAdditionalLines(n) {
    // let l = n.drawLine();

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
      if (1 == (n.stepLine - tick.chord[i-1].stepLine)) {
        let dx = 16;
        n.x += ((this.cursor == tick.chord[i-1].x) ? 16 : 0);
      }
    }

    if (0 > n.drawLine(this.drawClef) || n.drawLine(this.drawClef) > 10) {
      this.drawAdditionalLines(n);
    }

    n.y = n.drawY(this.drawClef);
    let t = SVGBuilder.emmentaler({x: n.x, y: n.y, text: nhead});
    tick.g.append(t);
  }

  drawAccidental(tick) {
    let acc = tick.chord.filter(n => undefined != n.accidental);
    if (0 == acc.length) return;
    let dx = 0;
    let x = this.cursor;
    acc.forEach((n, i) => {
      n.y = n.drawY(this.drawClef);
      if (i > 0) {
        if (2 > (n.stepLine - acc[i-1].stepLine)) {
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

  drawStem(tick) {

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

    tick.chord.forEach( (n, i) => {
      if (n.rest) {
        let ntype = n.type;
        if (null == ntype) ntype = 'whole';
        let t = SVGBuilder.emmentaler({x: this.cursor, y: this.restYOffset[n.staff], text: emm.Rest[ntype]});
        tick.g.append(t);
        return;
      }
      this.drawNote(tick, n, i);
    });

    this.drawStem(tick);

    tick.x = this.cursor;
    this.cursor += 40;
  }

  drawTicksInMeasure() {
    let m = this.sheet.bars[this.measureIndex];

    if (null != m.fifths) {
      let clef1;
      let clef2;
      if (0 == this.measureIndex) {
        clef1 = this.sheet.grandStaff.header.clef[1];
        clef2 = this.sheet.grandStaff.header.clef[2];
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
