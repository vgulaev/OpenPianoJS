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
    if (0 == a.length) return;
    let n = a[0];

    console.log('drawVoice');
  }

  draw() {
    Object.entries(this.att).forEach(([k, v]) => this.drawVoice(v));
  }
}
