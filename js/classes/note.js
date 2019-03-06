class Note {
  static intStepTo(step) {
    return Note.stepToS[step];
  }

  _propFromXML(properties, options) {
    for (var p of properties) {
      for (var name of p[1]) {
        //var curNode = options.querySelector(name);
        var nodes = options.getElementsByTagName(name);
        for (var curNode of nodes) {
          this[name] = p[0].call(this, curNode);
        }
      }
    }
  }

  loadFromXML(options) {
    this.v2 = {
      tie: {}
    };
    this.raw = options;
    if (null != options.querySelector("tie[type='start']")) {
      this.v2.tie.start = true;
    }
    if (null != options.querySelector("tie[type='stop']")) {
      this.v2.tie.stop = true;
    }

    var properties = [
      [() => true, ["rest", "chord", "dot", "staccato"] ],
      [x => parseInt(x.innerHTML), ["duration", "octave", "voice", "staff", "alter", "fingering"]],
      [x => x.innerHTML, ["step", "type", "stem"]],
      [x => x.getAttribute("type"), ["tie"]],
      [x => {
        var el = [x.getAttribute("number"), x.innerHTML];
        (undefined == this.beam) ? this.beam = [el] : this.beam.push(el);
        return this.beam;
      }, ["beam"] ]
    ];
    this._propFromXML(properties, options);
    if (undefined != this.beam) this.beam.reverse();
  }

  constructor(options = {}) {
    if ( "Element" == options.constructor.name ) {
      this.loadFromXML(options);
      return;
    }
    var obj = this;
    /* if (undefined === _options) {
      _options = {};
    } */
    function initProperty(name, options, defaults) {
      if (options[name] === undefined) {
        if (undefined != defaults) obj[name] = defaults;
      } else {
        obj[name] = options[name];
      }
    }
    initProperty("step", options, "");
    initProperty("alter", options, 0);
    initProperty("octave", options, 0);
    initProperty("duration", options, 0);
    initProperty("type", options, "");
    initProperty("staff", options, 0);
    initProperty("fingering", options, undefined);
  }

  copy(options) {
    var n = new Note();
    Object.keys(this).forEach( (x) => {
      if (true == options["clearBeam"] && "beam" == x) return;
      if (true == options["clearBeam"] && "tie" == x) return;
      n[x] = this[x];
    });
    return n;
  }

  get stepLine() {
    if (this.rest) return 0;
    return this.octave * 7 + Note.sToStep[this.step];
  }

  get midiByte() {
    if ((this.rest == true)||(true == this.v2.tie.stop)) return -1;
    return 12 + this.octave * 12 + Note.tones[this.step] + ( this.alter ? this.alter : 0 );
  }

  get y() {
    if (1 == this.staff) {
      return 129 + (31 - this.stepLine) * 7.5;
    } else {
      return 287 + (19 - this.stepLine) * 7.5;
    }
  }

  get k() {
    return ("down" == this.stem) ? -1 : 1;
  }

  alterSign() {
    switch (this.alter) {
      case -1:
        return "b";
      case 1:
        return "#";
      case 2:
        return "##";
    }
    return "";
  }

  toS() {
    if (true == this.rest) return "";
    return this.step + this.alterSign() + this.octave;
  }
}

Note.byteToS = function (byte) {
  let tones = { 0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B' };
  let octave = Math.floor((byte - 12) / 12);
  return tones[(byte - 12) % 12] + octave;
}

Note.tonesToS = {
  0: 'C',
  2: 'D',
  4: 'E',
  5: 'F',
  7: 'G',
  9: 'A',
  11: 'B' }

Note.tones = { 'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11 }

Note.stepToS = { 0: 'C',
  1: 'D',
  2: 'E',
  3: 'F',
  4: 'G',
  5: 'A',
  6: 'B' }

Note.sToStep = { 'C': 0,
  'D': 1,
  'E': 2,
  'F': 3,
  'G': 4,
  'A': 5,
  'B': 6 }
