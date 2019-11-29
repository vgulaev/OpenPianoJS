class App {
  static async initSVG() {
    var element = document.getElementById("GrandStaffHead");
    await Ut.get("svg/GrandStaffHead.svg", function() {
      element.innerHTML = this.responseText;
    });
    var head = element.children[0];
    var tenLines = SVGBuilder.createSVG ("svg");
    var width = window.innerWidth - head.width.baseVal.value - 20;
    tenLines.setAttributeNS (null, "width", width);
    tenLines.setAttributeNS (null, "height", head.height.baseVal.value + 20);
    for (var j = 84; j <= 262; j += 158) {
      for (var i = 0; i < 5; i++) {
        var line = SVGBuilder.createSVG ("line");
        line.setAttributeNS (null, "x1", 0);
        line.setAttributeNS (null, "y1", j + 15 * i);
        line.setAttributeNS (null, "x2", width);
        line.setAttributeNS (null, "y2", j + 15 * i);
        line.setAttributeNS (null, "stroke-width", 2);
        line.style.stroke = "black";
        tenLines.append(line);
      }
    }

    var rubicon = SVGBuilder.createSVG("polygon");
    rubicon.setAttributeNS(null, "points", "380,54 400,54 400,332 380,332")
    rubicon.setAttributeNS(null, "stroke", "blue");
    rubicon.setAttributeNS(null, "fill", "blue");
    rubicon.setAttributeNS(null, "opacity", "0.5");
    tenLines.append(rubicon);

    var metronome = SVGBuilder.createSVG("circle");
    metronome.setAttributeNS(null, "cx", "390");
    metronome.setAttributeNS(null, "cy", "63");
    metronome.setAttributeNS(null, "r", "9");
    metronome.setAttributeNS(null, "stroke", "red");
    metronome.setAttributeNS(null, "fill", "red");
    // metronome.setAttributeNS(null, "opacity", "0.5");
    tenLines.append(metronome);
    Metronome.ball = metronome;

    var element = document.getElementById("TenLines");
    element.append(tenLines);

    App.tenLines = tenLines;
  }

  static onMIDISuccess( midiAccess ) {
    function listInputsAndOutputs( midiAccess ) {
      for (var entry of midiAccess.inputs) {
        var input = entry[1];
        console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
          "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
          "' version:'" + input.version + "'" );

        var e = document.getElementById("midiMSG");
        e.style.display = "none";
      }
      for (var entry of midiAccess.outputs) {
        var output = entry[1];
        console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
          "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
          "' version:'" + output.version + "'" );
      }
    }

    console.log( "MIDI ready!" );
    //midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
    listInputsAndOutputs(midiAccess);
    App.piano.setMIDI(midiAccess);
  }

  static onMIDIFailure( msg ) {
    console.log( "Failed to get MIDI access - " + msg );
  }

  static initMIDI() {
    navigator.requestMIDIAccess().then( this.onMIDISuccess, this.onMIDIFailure );
  }

  static async init() {
    App.tenLines = ""; // SVG element to GrandStaff
    await App.initSVG();
    App.piano = new Piano(App.tenLines);
    App.piano.header = document.querySelector("#GrandStaffHead > svg");
    (new OwnDB()).then((db) => {
      App.db = db;
    });
    App.initMIDI();
  }

  static log(text) {
    var el = document.getElementById("console");
    el.innerHTML = "";
  }

  static updateFromTo() {
    var el = document.getElementById("posFrom");
    el.value = App.coach.from;
    var el = document.getElementById("posTo");
    el.value = App.coach.to;
  }

}

window.addEventListener("load", async function( event ) {
  showMidiDiv();
  await App.init();

  App.setting = new SettingsCore();
  var p = pieceList();
  playSong(p[App.setting.fileName].fileName);

  App.piano.onError = onHappy;
  App.piano.onCorrect = onHappy;
  App.piano.onSetTemp = onSetTemp;
  App.nn = 0;
  App.piano.onStart = function () {
    var element = document.getElementById("Repeats");
    element.innerHTML = App.nn;
    App.nn += 1;
    onHappy();
  }
  //App.piano.practice(new PlayFive()); */
  var e = document.getElementById("Temp");
  e.addEventListener("keyup", tempKeyUp, false);
  e.value = App.piano.perMinute;

  e = document.getElementById("musicXML");
  e.addEventListener("change", readMusicXML, false);

  e = document.getElementById("posFrom");
  e.value = Settings.range[0];
  e.addEventListener("change", function() {
    Settings.range[0] = parseInt(e.value);
  }, false)

  e = document.getElementById("posTo");
  e.value = Settings.range[1];
  e.addEventListener("change", function() {
    Settings.range[1] = parseInt(e.value);
  }, false);


  let items = pieceList();
  e = document.getElementById("songName");

  function selectNewSong(key, value) {
    e.value = value;
    App.setting.fileName = key;
    playSong(items[key].fileName);
  }

  e.addEventListener("keyup", (eventData) => {
    if ("Enter" == eventData.key) {
      let firstElement = App.menu.element.querySelector('div');
      selectNewSong(firstElement.id, firstElement.innerHTML);
      App.menu.element.remove();
    } else {
      if ((undefined != App.menu)&&(undefined != App.menu.element)) {
        App.menu.element.remove();
      }
      App.menu = new Menu(e, items.map( (x, i) => [i, x.name] ), 10);
      App.menu.select((key, value) => selectNewSong(key, value));
    }
  });
});

window.addEventListener("keydown", function (event) {
  if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key) && ('root' == event.srcElement.id)) {
    if ('ArrowRight' == event.key) {
      // Settings.range[0] += 1;
      App.piano.practiceStep();
    } else {
      // Settings.range[0] = App.piano.curentChordIndex - 1;
      playSong(App.songName);
    }
    e = document.getElementById("posFrom");
    e.value = Settings.range[0];
    }
});

function resetNN() {
  App.nn = 0;
  App.piano.onStart();
}

function readMusicXML(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }

  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    playSong(contents);
  };
  reader.readAsText(file);
}

function showMidiDiv() {
  var e = document.getElementById("midiMSG");
  e.style.left = (screen.availWidth - e.clientWidth) / 2 +  "px";
  e.style.top = "100px";
}

async function playSong(name) {
  App.songName = name;
  var md = new MusicDoc();
  if (100 < name.length) {
    md.loadFromStr(name);
  } else {
    await md.loadFromURL(name);
  }
  App.nn = 0;
  App.coach = Settings.coach(App.piano, md, Settings.range);
  onHappy();
}

function onSetTemp() {
  App.setting.temp = App.piano.perMinute;
  var element = document.getElementById("Temp");
  element.value = App.piano.perMinute;
}

function onHappy(obj) {
  var element = document.getElementById("Correct");
  element.innerHTML = App.piano.musicDoc.chordArray.length;
  // element.innerHTML = App.piano.Rights;
  var element = document.getElementById("Error");
  element.innerHTML = App.piano.Errors;
  var element = document.getElementById("Percent");
  element.innerHTML = (App.piano.Rights / (App.piano.Rights + App.piano.Errors) * 100).toFixed(1);
  var element = document.getElementById("Stat");
  var c = App.piano.currentChord();
  if (undefined != c) {
    // element.innerHTML = [c.chord.notes.filter((n) => true != n.rest).
    //                                   sort((a, b) => a.stepLine - b.stepLine).
    //                                   map(x => x.toS()).
    //                                   filter((value, index, self) => self.indexOf(value) === index).
    //                                   join(","),
    //                                   App.piano.curentChordIndex,
    //                                   Stats.info(),
    //                                   App.piano.kb.kb.map(e => Note.byteToS(e))].join('<br>');
    element.innerHTML = Stats.info();
  }
  var element = document.getElementById("InLine");
  element.innerHTML = App.piano.curentChordIndex;
}

function doStep() {
  App.piano.practiceStep();
  async function stepByStep() {
    App.piano.practiceStep();
    await Ut.sleep(240);
    stepByStep();
  }
}

function startWatch() {
  var startms = Date.now();
  var element = document.getElementById("Time");
  async function worker() {
    var p = 0;
    var c = 0;
    while (true) {
      await Ut.sleep(100);
      c = Date.now() / 1000;
      if (p == c) {
        continue;
      }
      element.innerHTML = ( c - startms / 1000 ).toFixed(2);
      p = c;
    }
  }
  worker();
}

function pieceList() {
  return MusicFiles;
}

function changeHands(button) {
  var m = new Menu(button, [[0, "Both"], [1, "Left"], [2, "Rights"]]);
  m.select(function(key, value) {
    if ("Both" == value) {
      App.setting.staff = 0;
      button.innerHTML = value + " hands";
    } else {
      if ("Left" == value){
        App.setting.staff = 2;
      } else {
        App.setting.staff = 1;
      }
      button.innerHTML = value + " hand";
    }
    App.piano.restart();
  });
}

function openMusicXML(button) {
  var m = new Menu(button, [[0, "Open file"], [1, "What is Music XML"], [2, "Download Musescore"]]);
  m.select(function(key, value) {
    if ("What is Music XML" == value) {
      window.open("https://en.wikipedia.org/wiki/MusicXML");
    } else if ("Download Musescore" == value) {
      window.open("https://musescore.org");
    } else if ("Open file" == value) {
      var e = document.getElementById("musicXML");
      e.click();
    }
  });
}

function chooseCoach(button) {
  var m = new Menu(button, [[1, "PlayFaster"], [2, "Five same"], [3, "Five diff"], [4, "PlayTriplets"]]);
  m.select(function(key, value) {
    App.setting.coach = key;
    location.reload();
  });
}

function tempKeyUp() {
  var v = parseInt(this.value);
  if (true == isNaN(v)) {
    if (0 < this.value.length) {
      this.value = App.piano.perMinute;
    } else {
      var obj = this;
      setTimeout(function () {
        if (0 == obj.value.length) obj.value = App.piano.perMinute;
      }, 4000);
    }
  } else {
    App.piano.perMinute = v;
  }
}
