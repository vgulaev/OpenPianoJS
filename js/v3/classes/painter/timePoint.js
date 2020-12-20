class TimePoint {
  constructor(timeMachine) {
    this.notes = [];
    this.voices = {};
    this.clefs = [];
    this.g = SVGBuilder.createSVG('g');
    this.tm = timeMachine;
    timeMachine.sheet.g.append(this.g);
  }

  push(element) {
    if ('note' == element.xml.tagName) {
      this.notes.push(element);
      if (!(element.voice in this.voices)) {
        this.voices[element.voice] = new Voice();
      }
      this.voices[element.voice].push(element);
    } else if ('clef' == element.xml.tagName) {
      this.clefs.push(element);
    } else if ('key' == element.xml.tagName) {
      this.fifths = element;
    } else if ('time' == element.xml.tagName) {
      this.beats = element;
    }
  }

  drawClef(pm) {
    if (0 == this.clefs.length) return;
    this.clefs.forEach(c => {
      c.draw(pm);
      pm.drawClef[c.number] = c;
    });
    pm.cursor += 50;
  }

  drawFifths(pm) {
    if (!this.fifths) return;
    let e = SVGBuilder.keySignature(pm.drawClef[1].toS(), pm.drawClef[2].toS(), this.fifths.fifths, pm.cursor);
    pm.g.append(e);
    pm.cursor += (Math.abs(this.fifths.fifths) + 1) * 12;
  }

  drawTime(pm) {
    if (!this.beats) return;
    let e = SVGBuilder.setTimeSignature(this.beats.beats, this.beats['beat-type'], pm.cursor);
    pm.g.append(e);
    pm.cursor += 40;
  }

  draw(pm) {
    this.drawClef(pm);
    this.drawFifths(pm);
    this.drawTime(pm);
    this.notes.forEach(n => {
      n.draw(pm);
    });
    pm.cursor += 40;
  }
}
