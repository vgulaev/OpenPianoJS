class App {
  static async initSVG() {
    var element = document.getElementById("GrandStaffHead");
    await Ut.get("svg/GrandStaffHead.svg", function() {
      element.innerHTML = this.responseText;
    });
    var head = element.children[0];
    var tenLines = SVGBuilder.createSVG ("svg");
    var width = window.innerWidth - head.width.baseVal.value - 20
    tenLines.setAttributeNS (null, "width", width);
    tenLines.setAttributeNS (null, "height", head.height.baseVal.value);
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
    //tenLines.append(rubicon);

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
    App.initMIDI();
  }
}

window.addEventListener("load", async function( event ) {
  await App.init();
  var md = new MusicDoc();
  //await md.loadFromURL("data/xml/No woman no cry.xml");
  await md.loadFromURL("data/xml/test.xml");
  var x = 0;
  for (var i = 0; i < md.chordArray.length; i++) {
    var c = md.chordArray[i].chord;
    c.g.setAttributeNS(null, "transform", `translate(${x})`);
    App.tenLines.append(md.chordArray[i].chord.g);
    x += c.weight;
  }
  /* App.piano.onError = onHappy;
  App.piano.onCorrect = onHappy;
  App.piano.onSetTemp = onHappy;  
  App.piano.practice(new PlayFive()); */
});

function onHappy(obj) {
  var element = document.getElementById("Correct");
  element.innerHTML = App.piano.Rights;
  var element = document.getElementById("Error");
  element.innerHTML = App.piano.Errors;
  var element = document.getElementById("Temp");
  element.innerHTML = App.piano.perMinute;
  var element = document.getElementById("Percent");
  element.innerHTML = (App.piano.Rights / (App.piano.Rights + App.piano.Errors) * 100).toFixed(1);
  var element = document.getElementById("Stat");
  element.innerHTML = App.piano.coacher.statFormat(); 
  var element = document.getElementById("InLine");
  element.innerHTML = App.piano.coacher.event.length; 
}

function doStep() {
  async function stepByStep() {
    App.piano.practiceStep();
    await Ut.sleep(240);
    stepByStep();
  }
  startWatch();
  stepByStep();
  //console.log(App.piano.actualX);
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

/*
function sendMiddleC( midiAccess, portID ) {
  var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  var output = midiAccess.outputs.get(portID);
  output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  
                                                                      // release velocity = 64, timestamp = now + 1000ms.
}
*/
