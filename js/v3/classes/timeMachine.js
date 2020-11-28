class TimeMachine {
  constructor(sheet) {
    this.sheet = sheet;
    this.arrowOfTime = {};
    this.keysForDraw = [];
    this.curTick = 0;
    this.graces = [];
    this.notes = [];
    this.fab = {
      'note': Note
    }
  }

  tick(duration) {
    if (duration == undefined) callError();
    this.curTick += duration * 10;
  }

  proccessGraces() {
    if (0 == this.graces.length) return;
    this.graces.reverse().forEach((g, i) => {
      let key = this.curTick - i - 1;
      this.checkKey(key);
      g.tick = key;
      this.arrowOfTime[key].push(g);
    });
    this.graces = [];
  }

  proccessEl(node) {
    let el = new this.fab[node.tagName](node);
    if ('note' == node.tagName) {
      if (el.grace) {
        this.graces.push(el);
        return;
      } else {
        this.proccessGraces();
      }
      let key = this.curTick - (el.chord ? el.duration * 10 : 0);
      el.tick = key;
      this.arrowOfTime[key].push(el);

      if (!el.chord) {
        this.tick(el.duration);
      }

      this.notes.push(el);
    } else {
      this.arrowOfTime[this.curTick].push(el);
    }
  }

  checkKey(key) {
    if (!(key in this.arrowOfTime)) {
      this.keysForDraw.push(key);
      this.arrowOfTime[key] = new TimePoint(this);
    }
  }

  push(node) {
    if (-1 != ['backup', 'forward'].indexOf(node.tagName)) {
      let k = ('backup' == node.tagName ? -1 : 1);
      let dur = (new Note(node)).duration;
      this.tick(k * dur);
      return;
    }

    this.checkKey(this.curTick);

    if (node.tagName in this.fab) {
      this.proccessEl(node);
    }
  }
}
