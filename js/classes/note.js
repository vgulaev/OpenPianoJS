class Note {
  constructor(options = {}) {
    var obj = this;
    /* if (undefined === _options) {
      _options = {};
    } */
    function initProperty(name, options, defaults) {
      if (options[name] === undefined) {
        obj[name] = defaults;
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
  }

  static intStepTo(step) {
    return Note.stepToS[step];
  }

  get stepLine() {
    return this.octave * 7 + Note.sToStep[this.step];
  }

  get midiByte() {
    return 12 + this.octave * 12 + Note.tones[this.step] + this.alter;
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
