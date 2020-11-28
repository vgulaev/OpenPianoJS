class PrintMachine {
  constructor(g, timeMachine) {
    this.g = g;
    this.tm = timeMachine;
    this.cursor = 0;
  }

  draw(el) {
    el.draw(this);
  }

  drawTimePoints() {
    let keys = this.tm.keysForDraw.sort((a, b) => a - b);
    let at = this.tm.arrowOfTime;
    keys.forEach(k => {
      at[k].notes.forEach(n => {
        n.draw(this);
      });
      this.cursor += 40;
    });
    this.tm.keysForDraw = [];
  }
}
