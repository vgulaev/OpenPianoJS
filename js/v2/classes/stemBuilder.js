class StemBuilder {
  constructor(printMachine) {
    this.pm = printMachine;
    this.g = this.pm.sheet.g;
    this.voices = {};
    this.bvoises = {};
  }

  push(note) {
    if ('whole' == note.type) return;
    let v = note.voice;
    if (v in this.voices) {
      this.voices[v].push(note);
    } else {
      this.voices[v] = [note];
    }
  }

  xyStem(voice) {
    let edge;
    let x;
    let k;
    let dy = StemBuilder.stemHeight[voice[0].type];
    if (voice[0].stem == 'up') {
      edge = [voice[0], voice[voice.length - 1]];
      x = edge[0].x + 18;
      k = 1;
    } else {
      edge = [voice[voice.length - 1], voice[0]];
      x = edge[0].x + 1;
      k = -1;
    }
    let xs = new Set(voice.map(n => n.x));
    if (2 == xs.size) {
      x = Math.max(...(Array.from(xs))) + 1;
    }

    return {
      x1: x,
      y1: edge[0].y - k * 2,
      x2: x,
      y2: edge[1].y - k * dy,
      beam: edge[0]
    }
  }

  drawSingleStem(voice) {
    let xy = this.xyStem(voice);

    let l = SVGBuilder.line({x1: xy.x1, y1: xy.y1, x2: xy.x2, y2: xy.y2, 'stroke-width': 2, stroke: 'black'})
    this.g.append(l);
    if (-1 == ['whole', 'half', 'quarter'].indexOf(xy.beam.type)) {
      let flag = emm.Flag[xy.beam.type][xy.beam.stem];
      let f = SVGBuilder.emmentaler({x: xy.x1, y: xy.y2, text: flag});
      this.g.append(f);
    }
  }

  drawBeam(key) {
    let b = this.bvoises[key];

    console.log('drawBeam');
  }

  pushBeam(v) {
    let b = v.filter(n => undefined != n.beam)[0];

    if (b.beamKey() in this.bvoises) {
      this.bvoises[b.beamKey()].push(v);
    } else {
      this.bvoises[b.beamKey()] = [v];
    }
    if ('end' == b.beam[1]) {
      this.drawBeam(b.beamKey());
    }
  }

  draw() {
    Object.entries(this.voices).forEach( ([k, v]) => {
      if (1 == Math.max(...(v.map(n => (undefined == n.chord && undefined == n.beam) ? 1 : 0))))
        this.drawSingleStem(v);
      if (1 == Math.max(...(v.map(n => (undefined == n.chord && undefined != n.beam) ? 1 : 0))))
        this.pushBeam(v);
    });
    this.voices = {};
  }
}

StemBuilder.stemHeight = {
  128: 92,
  64: 78,
  32: 64,
  16: 53,
  eighth: 50,
  quarter: 50,
  half: 50,
}
