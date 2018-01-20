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
    var properties = [
      [() => true, ["rest", "chord", "dot"] ],
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
      n[x] = this[x];
    });
    return n;
  }

  get stepLine() {
    return this.octave * 7 + Note.sToStep[this.step];
  }

  get midiByte() {
    if ((this.rest == true)||("stop" == this.tie)) return -1;
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

  toS() {
    if (true == this.rest) return "";
    return this.step + (-1 == this.alter ? "b":"") + (1 == this.alter ? "#":"") + this.octave;
  }
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
