class PlayErrorCleaner {
  getDeltas() {
    return [[0, 1], [0, 1], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [0, 1]];
  }

  setPracticeRange() {
    let d = this.deltas.pop();
    this.range[0] += d[0];
    this.range[1] += d[1];

  }

  constructor(piano, md, range) {
    this.aim = md;
    this.piano = piano;
    this.status = "play"; // play or practice
    this.deltas = this.getDeltas();

    this.from = range[0];
    this.to = range[1];

    var obj = this;
    this.piano.onTrackOver = function () {
      obj.piano.practice(obj.aim);
      obj.piano.restart(obj.from);
    };

    this.piano.afterPracticeStep = function () {
      if (obj.piano.curentChordIndex >= obj.to) obj.piano.restart(obj.from);
      if ("practice" == obj.status) {
        if (0 == obj.deltas.length && 35 == App.nn) {
          obj.status = "play";
          App.nn = 1;
          return;
        }
        if (obj.piano.curentChordIndex == obj.range[1]) {
          for (let i = obj.range[0]; i < obj.range[1]; i++ ) {
            obj.piano.practiceStep({'direction': -1});
          }
          var element = document.getElementById("Repeats");
          element.innerHTML = App.nn;
          App.nn += 1;
          if (0 == (App.nn - 1) % 5) {
            obj.setPracticeRange();
          }
        }
      }
    };

    this.piano.onErrorCoach = () => {
      if ("play" == this.status) {
        this.status = "practice";
        this.errorChordIndex = obj.piano.curentChordIndex;
        this.range = [this.errorChordIndex, this.errorChordIndex];
        this.deltas = obj.getDeltas();
        this.setPracticeRange();
      }
      // this.piano.practiceStep({'direction': -1});

    // App.nn = 0;
    // App.piano.onStart = function () {
    //   var element = document.getElementById("Repeats");
    //   element.innerHTML = App.nn;
    //   App.nn += 1;

    }


    this.piano.practice(this.aim);
    this.piano.restart(this.from);
  }
}
