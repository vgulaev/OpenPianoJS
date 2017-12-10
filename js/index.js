class App {
  static async get(url, callback) {
    await new Promise( resolve => {
      var myRequest = new XMLHttpRequest();
      myRequest.open("get", url);
      myRequest.onload = function () {
        callback.call(this);
        resolve("Ok");
      };
      myRequest.send();      
    });
    console.log('hello');
  }

  static async initSVG() {
    var element = document.getElementById("GrandStaffHead");
    await App.get("svg/GrandStaffHead.svg", function() {
      element.innerHTML = this.responseText;
    });
    var head = element.children[0];
    var xmlns = "http://www.w3.org/2000/svg";
    var tenLines = document.createElementNS (xmlns, "svg");
    var width = window.innerWidth - head.width.baseVal.value - 20
    tenLines.setAttributeNS (null, "width", width);
    tenLines.setAttributeNS (null, "height", head.height.baseVal.value);    
    for (var j = 24; j <= 182; j += 158) {
      for (var i = 0; i < 5; i++) {
        var line = document.createElementNS (xmlns, "line");
        line.setAttributeNS (null, "x1", 0);    
        line.setAttributeNS (null, "y1", j + 15 * i);    
        line.setAttributeNS (null, "x2", width);    
        line.setAttributeNS (null, "y2", j + 15 * i);
        line.setAttributeNS (null, "stroke-width", 2);
        line.style.stroke = "black";
        tenLines.append(line);
      }
    }

    var element = document.getElementById("TenLines");
    element.append(tenLines);
    //element.append();
  }
}

window.addEventListener("load", function(event) {
  App.initSVG();
  //startMoving();
  //startWatch();
  //console.log("All resources finished loading!");
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startWatch() {
  var startms = Date.now();
  async function worker() {
    var p = 0;
    var c = 0;
    while (true) {
      await sleep(100);
      //await new Promise(resolve => { resolve("Hello") });
      c = Date.now() / 1000;
      if (p == c) {
        continue;
      }
      var element = document.getElementById("Time");
      element.innerHTML = ( c - startms / 1000 ).toFixed(2);
      p = c;
    }  
  }
  worker();
}

function startMoving() {
  var dx = 4;
  async function step(){
    var element = document.getElementById("GrandStaff");
    //console.log(element.style.left);
    var curx = parseInt(element.style.left);
    if ( curx > 300 ) {
      dx = Math.abs(dx) * -1;
    } else if ( curx < 10 ){
      dx = Math.abs(dx);
    }
    element.style.left = curx + dx + "px";
    await sleep(1);
    step();
  }
  step();
}

//alert('Hello');
var midi = null;  // global MIDIAccess object

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
  sendMiddleC( midi, 'output-1' );
  startLoggingMIDIInput( midiAccess );  
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );

function sendMiddleC( midiAccess, portID ) {
  var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  var output = midiAccess.outputs.get(portID);
  output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  
                                                                      // release velocity = 64, timestamp = now + 1000ms.
}

function onMIDIMessage( event ) {
  var str = "MIDI message received at timestamp " + event.timeStamp + "[" + event.data.length + " bytes]: ";
  for (var i=0; i<event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }
  console.log( str );
}

function startLoggingMIDIInput( midiAccess ) {
  midiAccess.inputs.forEach( function(entry) {entry.onmidimessage = onMIDIMessage;});
}

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

