class StemBuilder {
  constructor(printMachine) {
    this.pm = printMachine;
    this.g = this.pm.sheet.g;
    this.voices = {};
    this.bvoises = {};
  }

  push(note) {
    if ('whole' == note.type) return;
    if ('none' == note.stem) return;
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
    if (-1 != ['whole', 'half', 'quarter'].indexOf(xy.beam.type))
      return;
    let flag = emm.Flag[xy.beam.type][xy.beam.stem];
    let f = SVGBuilder.emmentaler({x: xy.x1, y: xy.y2, text: flag});
    this.g.append(f);
  }

  drawBeam(b, coords, index) {
    let dy = 10;
    if ('down' == b[0][0].stem) dy = -10;

    let s = coords[0];
    let e = coords[coords.length - 1];
    let k = (e.y2 - s.y2) / (e.x2 - s.x2 + 2);
    let l = SVGBuilder.line({x1: s.x2 - 1, y1: s.y2 + index * dy, x2: e.x2 + 1, y2: e.y2 + index * dy, 'stroke-width': 5, stroke: 'black'})
    this.g.append(l);

    coords.forEach((xy, i) => {
      if (i != 0) {
        xy.y2 = s.y2 + (xy.x2 - s.x2) * k;
      }
    })
  }

  drawBeamSteams(b, coords) {
    let dy = 10;
    if ('down' == b[0][0].stem) dy = -10;

    coords.forEach((xy, i) => {
      let index = 0;
      if (b[0][0].stem != b[i][0].stem) {
        index = Math.max(...Object.entries(this.getBeamNotHook(b[i], 1).beam)
        .filter(([k, v]) => -1 == v.indexOf('hook'))
        .map(([k, v]) => k)) - 1;
        console.log('Hello!');
      }

      let l = SVGBuilder.line({x1: xy.x1, y1: xy.y1, x2: xy.x2, y2: xy.y2 + index * dy, 'stroke-width': 2, stroke: 'black'})
      this.g.append(l);
    });
  }

  beamMax(key) {
    let b = this.bvoises[key]
      .flat()
      .map(n => n.beam)
      .filter(e => undefined != e)
      .map(e => Object.keys(e))
      .flat();
    return Math.max(...b);
  }

  getBeamNotHook(v, index) {
    return v.filter(n => undefined != n.beam && undefined != n.beam[index] && -1 == n.beam[index].indexOf('hook'))[0];
  }

  getCoords(bv) {
    let coords = bv.map(v => this.xyStem(v));
    if (2 == (new Set(bv.flat().map( n => n.stem))).size)
      return coords;
    let ys = coords.map(xy => xy.y2);
    if ('down' == bv[0][0].stem) {
      let m = Math.max(...ys);
      if  (ys[0] < m && ys[ys.length - 1] < m)
        coords.forEach(xy => xy.y2 = m);
    } else {
      let m = Math.min(...ys);
      if  (ys[0] > m && ys[ys.length - 1] > m)
        coords.forEach(xy => xy.y2 = m);
    }
    return coords;
  }

  pushBeam(v) {
    let b = this.getBeamNotHook(v, 1);
    let key = b.beamKey();

    if (b.beamKey() in this.bvoises) {
      this.bvoises[key].push(v);
    } else {
      this.bvoises[key] = [v];
    }
    if ('end' == b.beam[1]) {
      let bmax = this.beamMax(b.beamKey());
      let bv = this.bvoises[key];
      let coords = this.getCoords(bv);
      for (let i = 1; i <= bmax; i++) {
        let tempBVoice = [];
        let tempCoord = [];
        bv.forEach((c, index) => {
          let bb = this.getBeamNotHook(c, i);
          if (undefined == bb) return;
          tempBVoice.push(c);
          tempCoord.push(coords[index]);
          if ('end' == bb.beam[i]) {
            this.drawBeam(tempBVoice, tempCoord, i - 1);
            tempBVoice = [];
            tempCoord = [];
          }
        });
      }
      this.drawBeamSteams(bv, coords);
      this.bvoises[key] = [];
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
