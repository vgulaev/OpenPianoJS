class Piano {
  constructor(tenLines) {
    this._perMinute = 60;
    this.musicDoc = new MusicDoc();
    this.tenLines = tenLines;
    this.midi = null;
    this.kb = new KBSign();

    this.steps = new Array();
    this.observerStatus = "work";
    this.curentX = 0;

    this.mover = null;
    this.Errors = 0;
    this.Rights = 0;
    this.onError = null;
    this.onCorrect = null;
    this.onSetTemp = null;
  }

  set perMinute( value ) {
    this._perMinute = value;
    this.invokeEvent("onSetTemp");
  }

  get perMinute() {
    return this._perMinute;
  }

  createHeader() {
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
      var y = 129 + (31 - n.stepLine) * 7.5;
      SVGBuilder.drawAccidental(115, y, n, g);
      n = new Note({step: "B", alter: -1, octave: 2});
      y = 287 + (19 - n.stepLine) * 7.5;
      SVGBuilder.drawAccidental(115, y, n, g);
      App.keyFifths["B-1"] = true;
    } else if (2 == this.musicDoc.keyFifths) {
      var n = new Note({step: "C", alter: 1, octave: 5});
      var y = 129 + (31 - n.stepLine) * 7.5;
      SVGBuilder.drawAccidental(115, y, n, g);
      n = new Note({step: "F", alter: 1, octave: 5});
      y = 129 + (31 - n.stepLine) * 7.5;
      SVGBuilder.drawAccidental(105, y, n, g);
      App.keyFifths["C1"] = true;
      App.keyFifths["F1"] = true;
    }

    this.header.append(g);
  }

  updateFrames() {
    this.createHeader();
    var g = SVGBuilder.createSVG("g");
    g.setAttributeNS (null, "id", "SheetMusic");

    var x = 0;
    var a = this.musicDoc.chordArray;
    var options = {};
    App.tieBuilder = {"1": {}, "2": {}, x: x};
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
      this.practiceStep();
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
    var c = this.currentChord().chord;
    var length = c.weight - c.xborder;
    this.curentChordIndex += 1;
    //if (this.curentChordIndex == this.musicDoc.chordArray.length) {
    if (this.curentChordIndex == 12) {
      this.use.setAttributeNS(null, "x", 450);
      this.start();
      return;
    }
    c = this.musicDoc.chordArray[this.curentChordIndex].chord;
    length += c.xborder;
    var ms = 60000 / this._perMinute;
    this.steps.push({length: -length, dur: ms});
    if ("" == c.sign.sign) this.practiceStep();
  }

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

  async moveObserver() {
    while ("work" == this.observerStatus) {
      await Ut.sleep(1);
      if (0 == this.steps.length) continue;
      this.animationStep();
      this.observerStatus = "stop";
    }
  }

  start() {
    this.steps = [{length: -60, dur: 2000}];
    this.observerStatus = "work";
    this.curentChordIndex = 0;
    this.Errors = 0;
    this.curentX = 450;
    this.moveObserver();
  }

  practice(md) {
    this.musicDoc = md;
    this.updateFrames();
    this.perMinute = 60;
    this.start();
  }
}
