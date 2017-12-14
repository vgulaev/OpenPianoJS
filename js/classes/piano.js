class Piano {
  constructor(tenLines) {
    this._perMinute = 60;

    this.musicDoc = new MusicDoc();
    this.tenLines = tenLines;
    this.frames = new Array();
    this.movingStep = new Array();
    this.lastRenderedIndex = 0;
    this.globalX = 0;
    this.actualX = 0;
    this.midi = null;
    this.moveLength = 0;
    this.kb = new KBSign();
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

  updateFrames() {
    var c = this.musicDoc.chords;
    var frameSize = 2;
    var measure = new Array();
    if (3 == this.frames.length) {
      var element = this.frames.shift();
      element[0].remove();
      element[1].remove();
      this.actualX += 1 * this.musicDoc.beats * 50 * frameSize
    }     
    while(this.frames.length < 3) {
      for (var i = 0; i < frameSize; i++) {
        measure.push(c.slice(this.lastRenderedIndex, this.lastRenderedIndex + 4));
        this.lastRenderedIndex += 4;
      }
      var svgFrame = SVGBuilder.render(this.tenLines, measure, this.lastRenderedIndex, this.actualX + this.frames.length * this.musicDoc.beats * 50 * frameSize);
      this.frames.push(svgFrame);
      measure = new Array();
    }
  }

  practiceStep() {
    var ms = Math.floor(60000/this._perMinute);
    this.movingStep.push({s: 50, t: ms})
    this.curentChordIndex += 1;
  }

  chordOpacity() {
    for (var i = this.curentChordIndex - 1; i >= 0 && i > this.curentChordIndex - 7; i--) {
      var g = this.musicDoc.chords[i].g;
      g.setAttributeNS(null, "opacity", g.getAttributeNS(null,"opacity") - 0.003);
    }
  }

  invokeEvent(name) {
    if (this[name] !== null) {
      this[name](this);
    }
  }

  onMIDIMessage( event ) {
    this.kb.push(event);
    //console.log(event.timeStamp);
    //if (128 == event.data[0]) return;
    //console.log(this.kb.sign);
    if (2 == this.kb.count) {
      if (this.kb.sign == this.musicDoc.chords[this.curentChordIndex].sign) {  
        this.practiceStep();
        this.Rights += 1;
        this.invokeEvent("onCorrect");
        this.coacher.push(event, this.kb.kb[this.kb.kb.length - 1]);
      } else {
        this.coacher.haveError = true;
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

  moveDX(dx) {
      this.actualX += dx;
      for (var f of this.frames) {
        f[1].x.baseVal.value = f[1].x.baseVal.value + dx;
      }
  }

  startMoving() {
    var dx = -1;
    var obj = this;
    var startTime = window.performance.now();
    var nowTime = window.performance.now();
    var moveLength = 0;
    var moveTime = 0;
    var mStep;
    var news;
    var curX;
    async function step() {
      await Ut.sleep(1);
      nowTime = window.performance.now();
      if ((obj.movingStep.length > 0)||(0 < moveLength)) {
        if (moveLength == 0) {
          //console.log(obj.movingStep.length);
          mStep = obj.movingStep.shift();
          moveLength = mStep.s;
          moveTime = mStep.t;
          curX = obj.actualX;
          startTime = window.performance.now();
        }
        news = Math.ceil((mStep.s / mStep.t) * (nowTime - startTime));

        if ( (curX - news) < obj.actualX ) {
          dx = curX - news - obj.actualX
          obj.moveDX(dx);
          obj.chordOpacity();
          moveLength += dx;
        }
        if (moveLength <= 0) { 
          moveLength = 0;
          console.log(obj.actualX);
          if (obj.actualX < -300) obj.updateFrames();
        }
      }
      step();
    }
    step();
  }

  start() {
    this.startMoving();
  }

  practice(coacher) {
    this.coacher = coacher;
    this.coacher.piano = this;
    this.curentChordIndex = 0;
    this.lastRenderedIndex = 0;
    this.actualX = 418;
//    this.moveLength = 28;
    var ms = Math.floor(60000/this._perMinute);
    this.movingStep.push({s: 28, t: ms})
    this.coacher.init();
    this.updateFrames();
    this.start();
  }
}
