class PlayFive {
  constructor() {
    this.piano = null;
    this.event = new Array();
    this.step = 0;
    this.haveError = false;
    this.statistic = {};
  }

  createChords() {
   var chords = this.piano.musicDoc.chords;
    for (var i = 0; i < 1000; i++) {
      var chord = new Chord();
      var step = Note.stepToS[Ut.getRandomInt( 0, 5 )]; 
      for (var j = 0; j < 2; j++) {
        var note = new Note( {type: 'quarter',
          staff: j + 1,
          octave: -j * 2 + 5,
          duration: 1,
          step: step
        } );
        chord.notes.push(note);
        //break;
      }
      chord.update();
      chords.push(chord);
    }
  }

  checkTemp() {
    this.step += 1;
    if (this.step > 4) {
      var s = 600 * 1000 / (this.event[9][0].timeStamp - this.event[0][0].timeStamp);
      if (s > this.piano.perMinute) {
        this.piano.perMinute = s.toFixed(0); 
      } else {
        this.piano.perMinute -= 5;
      }
      this.step = 0; 
    }
  }

  analyseStream() {
    if (!this.haveError) return;
    var key = Note.tonesToS[this.event[8][1]] + "-" + Note.tonesToS[this.event[9][1]];
    if (undefined === this.statistic[key]) {
      this.statistic[key] = 1;
    } else {
      this.statistic[key] += 1;      
    }
    this.haveError = false;
  }

  statFormat() {
    //this.statistic = {"C-E": 1, "E-F": 3, "F-G": 5};
    var obj = this;
    function cmp(a, b) {
      if (a[0] > b[0]) {
        return -1;
      } else if (a[0] < b[0]) {
        return 1;
      }
      return 0;
    }
    var a = Object.keys(this.statistic).map( function(key) {
      return [ obj.statistic[key], key ];
    } ).sort(cmp).map( function(el) {
      return el[1] + " == " + el[0];
    }).join("<br>");
    //this.statistic
    return a;
  }

  push(event, kb) {
    this.event.push([event, kb - 72]);
    if (10 == this.event.length) {
      this.analyseStream();
      this.checkTemp();
      this.event.shift();
    }
  }

  init() {
    this.piano.perMinute = 60;
    this.createChords();
  }
}
