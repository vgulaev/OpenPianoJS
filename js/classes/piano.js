class Piano {
  constructor(tenLines) {
    this._perMinute = 0;
    this.musicDoc = new MusicDoc();
    this.tenLines = tenLines;
    this.midi = null;
    this.kb = new KBSign();

    this.steps = new Array();
    this.observerStatus = "stop";
    this.pullUp = false;

    this.mover = null;
    this.Errors = 0;
    this.Rights = 0;
    this.onError = null;
    this.onCorrect = null;
    this.onSetTemp = null;
    this.onSelfRepeat = null;

    this.beforePracticeStep = null;
    this.afterPracticeStep = null;
    this.onTrackOver = null;
  }

  set perMinute( value ) {
    this._perMinute = value;
    this.invokeEvent("onSetTemp");
  }

  get perMinute() {
    return this._perMinute;
  }

  createHeader() {
    if (undefined != this._heder_clean) this._heder_clean.remove();
    App.keyFifths = {};
    var g = SVGBuilder.createSVG("g");
    function _text(x, y, t) {
      var text = SVGBuilder.createSVG("text");
      text.setAttributeNS(null, "font-family", "Emmentaler");
      text.setAttributeNS(null, "font-size", "64");
      text.setAttributeNS(null, "font-weight", "normal");
      text.setAttributeNS(null, "text-anchor", "middle");
      text.setAttributeNS(null, "y", y);
      text.setAttributeNS(null, "x", x);
      text.innerHTML = t;
      return text;
    }
    g.append(_text(120, 115, this.musicDoc.beats));
    g.append(_text(120, 146, this.musicDoc.beatType));
    g.append(_text(120, 273, this.musicDoc.beats));
    g.append(_text(120, 304, this.musicDoc.beatType));

    if (-1 == this.musicDoc.keyFifths) {
      var n = new Note({step: "B", alter: -1, octave: 4});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      App.keyFifths["B-1"] = true;
    } else if (2 == this.musicDoc.keyFifths) {
      var n = new Note({step: "C", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      n = new Note({step: "F", alter: 1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(105, n.y, n, g);
      var n = new Note({step: "C", alter: 1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      n = new Note({step: "F", alter: 1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(105, n.y, n, g);
      App.keyFifths["C1"] = true;
      App.keyFifths["F1"] = true;
    } else if (-2 == this.musicDoc.keyFifths) {
      var n = new Note({step: "B", alter: -1, octave: 4, staff: 1});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 5, staff: 1});
      SVGBuilder.drawAccidental(105, n.y, n, g);
      var n = new Note({step: "B", alter: -1, octave: 2, staff: 2});
      SVGBuilder.drawAccidental(115, n.y, n, g);
      n = new Note({step: "E", alter: -1, octave: 3, staff: 2});
      SVGBuilder.drawAccidental(105, n.y, n, g);
      App.keyFifths["B-1"] = true;
      App.keyFifths["E-1"] = true;
    }

    this._heder_clean = g;
    this.header.append(g);
  }

  updateFrames() {
    //this.tenLines.innerHTML = "";
    if (undefined != this.def) this.def.remove();
    if (undefined != this.use) this.use.remove();

    this.createHeader();
    var g = SVGBuilder.createSVG("g");
    g.setAttributeNS (null, "id", "SheetMusic");

    var x = 0;
    var a = this.musicDoc.chordArray;
    var options = {};
    App.tieBuilder = {"1": {}, "2": {}, x: x};
    App.beamBuilder = {"1": {"1": [], "2": [], "3": [], "4": [], "5": []},
      "2": {"1": [], "2": [], "3": [], "4": [], "5": []}};
    for (var i = 0; i < a.length; i++) {
      var c = a[i].chord;

      if ((i > 0) && (a[i-1].chord.measure != a[i].chord.measure)) {
        options["drawBarLine"] = true;
      } else {
        options["drawBarLine"] = false;
      }
      App.tieBuilder.x = x;
      c.render(options);

      c.g.setAttributeNS(null, "transform", `translate(${x})`);
      g.append(c.g);

      x += c.weight;
    }

    var def = SVGBuilder.createSVG("def");
    def.append(g)
    this.tenLines.append(def);
    this.def = def;

    this.use = SVGBuilder.createSVG("use");
    this.use.setAttributeNS(null, "x", 450);
    this.use.setAttributeNS(null, "href", "#SheetMusic");

    this.mover = SVGBuilder.createSVG("animate");
    this.mover.setAttributeNS(null, "attributeType", "XML");
    this.mover.setAttributeNS(null, "attributeName", "x");
    this.mover.setAttributeNS(null, "from", "0");
    this.mover.setAttributeNS(null, "to", "500");
    this.mover.setAttributeNS(null, "dur", "2000ms");
    this.mover.setAttributeNS(null, "begin", "indefinite");
    this.mover.setAttributeNS(null, "fill", "freeze");
    var obj = this;
    this.mover.onend = function () { obj.moverEnd() };
    this.use.append(this.mover);
    this.tenLines.append(this.use);
    console.log("Play");
  }

  chordOpacity() {
    for (var i = this.curentChordIndex - 1; i >= 0 && i > this.curentChordIndex - 7; i--) {
      var g = this.musicDoc.chords[i].g;
      if (g == null) continue;
      g.setAttributeNS(null, "opacity", g.getAttributeNS(null,"opacity") - 0.003);
    }
  }

  invokeEvent(name) {
    if (this[name] !== null) {
      this[name](this);
    }
  }

  onMIDIMessage( event ) {
    //128 - up 144 - press key
    this.kb.push(event);
    if (128 == event.data[0]) return;
    var c = this.musicDoc.chordArray[this.curentChordIndex].chord;
    //if (this.kb.include(c.sign)) {
    if (this.kb.last(c.sign.count) == c.sign.sign) {
      c.makeGreen();
      this.kb.pop(c.sign.count);
      this.practiceStep();
      this.invokeEvent("onCorrect");
      //console.log("ok == " + event.data[0]);
    } else {
      if ((144 == event.data[0])&&(this.kb.kb.length == c.sign.kb.length)) {
        this.Errors += 1;
        this.invokeEvent("onError");
      }
    }
  }

  setMIDI(midiAccess) {
    this.midi = midiAccess;
    this.inPort = midiAccess;
    var obj = this;
    midiAccess.inputs.forEach( function(entry) {
      entry.onmidimessage = function (event) {
        obj.onMIDIMessage(event);
      };
    });
  }

  currentChord() {
    return this.musicDoc.chordArray[this.curentChordIndex];
  }

  practiceStep() {
    this.invokeEvent("beforePracticeStep");
    var c = this.currentChord().chord;
    var length = c.weight - c.xborder;
    this.curentChordIndex += 1;
    if (this.curentChordIndex == this.musicDoc.chordArray.length) {
      if (null == this.onTrackOver) {
        if ("work" == this.observerStatus) {
          this.onSelfRepeat = function () {
            this.start();
          }
          this.steps = [];
        } else {
          this.start();
        }
      } else {
        this.invokeEvent("onTrackOver");
      }
      return;
    }
    c = this.musicDoc.chordArray[this.curentChordIndex];
    length += c.chord.xborder;
    var ticks = c.tick - this.musicDoc.chordArray[this.curentChordIndex - 1].tick;
    var ms = 60000 / this._perMinute / this.musicDoc.divisions * ticks;
    this.steps.push({length: -length, dur: ms});
    if ("" == c.chord.sign.sign) this.practiceStep();
    if ("stop" == this.observerStatus) {
      this.observerStatus = "work";
      this.moveObserver();
    }
    this.invokeEvent("afterPracticeStep");
  }

  /*
  moverEnd() {
    if (this.steps.length > 0) {
      this.animationStep();
    } else {
      this.observerStatus = "work";
      this.moveObserver();
    }
  }

  animationStep() {
    var curMove = this.steps.shift();
    this.mover.setAttributeNS(null, "from", this.curentX);
    this.mover.setAttributeNS(null, "to", this.curentX + curMove.length);
    this.mover.setAttributeNS(null, "dur", curMove.dur + "ms");
    this.mover.beginElement();
    this.curentX += curMove.length;
  }
  */

  async moveObserver() {
    var last_x = 0, new_x = 0, new_x_k = 0;
    var start = window.performance.now();
    var ss = window.performance.now();
    var use = this.use;
    var obj = this;
    var k = parseInt(use.getAttributeNS(null, "x"));

    function step() {
      if (0 == obj.steps.length) {
        obj.observerStatus = "stop";
        if (null != obj.onSelfRepeat) {
          obj.invokeEvent("onSelfRepeat");
          obj.onSelfRepeat = null;
        }
        return;
      } else if (2 < obj.steps.length) {
        for (var i = 1; i < obj.steps.length - 1; i++) {
          if (false == obj.pullUp) break;
          obj.steps[i].dur = Math.ceil(obj.steps[i].dur * 0.99);
        }
      }
      var v = obj.steps[0].length / obj.steps[0].dur;
      new_x = Math.ceil((window.performance.now() - start) * v);
      new_x_k = new_x + k;
      if (new_x < obj.steps[0].length) {
        k += obj.steps[0].length;
        start += obj.steps[0].dur;
        new_x_k = k;
        obj.steps.shift();
      }
      if (new_x_k != last_x) {
        use.setAttributeNS(null, "x", new_x_k);
        last_x = new_x_k;
        //console.log(Math.ceil((window.performance.now() - ss)/1000) );
      }
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  xForChord(index) {
    var x = 450;
    if (index > 0) {
      x -= 50;
      for (var i = 0; i < index; i ++) {
        x -= this.musicDoc.chordArray[i].chord.weight;
      }
      x -= this.musicDoc.chordArray[index].chord.xborder;
    }
    return x;
  }

  start(index) {
    if ((undefined == index)||(0 == index)) {
      this.curentChordIndex = 0;
      this.steps = [{length: -60, dur: 2000}];
    } else {
      this.curentChordIndex = index;
      this.steps = [];
    }
    this.use.setAttributeNS(null, "x", this.xForChord(index));
    /*
    for (var i = 0; i < 5; i++) {
      var c = this.musicDoc.chordArray[i];
      //var r = Math.ceil(2000 / Math.ceil(Math.random() * 4));
      var r = Math.ceil(60000 / this.perMinute);
      console.log(c.chord.weight);
      var d = {length: -c.chord.weight, dur: r};
      this.steps.push(d)
    }
    */
    //this.steps = [{length: -60, dur: 500}];
    this.observerStatus = "work";
    this.Errors = 0;
    this.moveObserver();
  }

  restart(index) {
    if ("work" == this.observerStatus) {
      this.onSelfRepeat = function () {
        this.start(index);
      }
      this.steps = [];
    } else {
      this.start(index);
    }
  }

  practice(md) {
    this.musicDoc = md;
    this.updateFrames();
    if (0 == this.perMinute) {
      this.perMinute = App.setting.temp;
    }
  }
}
