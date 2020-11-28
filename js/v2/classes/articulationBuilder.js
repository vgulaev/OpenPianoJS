class ArticulationBuilder {
  constructor(printMachine) {
    this.pm = printMachine;
    this.g = this.pm.sheet.g;
    this.att = {};
  }

  push(n) {
    if (n.voice in this.att) {
      this.att[n.voice].push(n);
    } else {
      this.att[n.voice] = [n];
    }
  }

  drawVoice(v) {
    let a = v.filter(n => n.notations).filter(n => n.notations.articulations);
    let ys = v.map(n => n.y).sort((a, b) => a - b);
    if (0 == a.length) return;
    let n = a[0];

    let baseY = ys[0];
    // let k =
    // if (n.stem == 'up') {

    // }
    // let t = SVGBuilder.emmentaler({x: n.x + 7, y: n.y + 11, text: emm.Articulation['staccatissimo']['up']});
    let t = SVGBuilder.emmentaler({x: n.x + 7, y: n.y + 11, text: emm.Articulation['staccato']});
    this.g.append(t);
  }

  draw() {
    Object.entries(this.att).forEach(([k, v]) => this.drawVoice(v));
  }
}
