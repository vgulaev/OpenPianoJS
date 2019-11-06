function startWaveTableNow(pitch) {
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, audioContext.currentTime + 0, pitch, 0.4);
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, audioContext.currentTime + 0.4, pitch + 1, 0.2);
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, audioContext.currentTime + 0.6, pitch + 2, 0.2);
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, audioContext.currentTime + 0.8, pitch + 3, 4);
}

function playPitch(pitch) {
  var audioBufferSourceNode = player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, audioContext.currentTime, pitch, 0.4);
}

function initMusic() {
  // selectedPreset = _tone_0000_Aspirin_sf2_file;
  selectedPreset = _tone_0000_Chaos_sf2_file;
  AudioContextFunc = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextFunc();
  player = new WebAudioFontPlayer();
  player.adjustPreset(audioContext, selectedPreset);
}

function addRandomInterval() {
  // let min = Ut.max([keyRange[0], pianoInterval[0] - dx]);
  // let max = Ut.min([keyRange[1], pianoInterval[0] + dx + 1]);
  // pianoInterval.push(Ut.getRandomInt(min, max));
  let n = pianoInterval[0] + (Ut.rnd(2) * 2 - 1) * noteD;
  if (n < 30) n = pianoInterval[0] + noteD;
  if (n > 110) n = pianoInterval[0] - noteD;
  pianoInterval.push(n);
}

function checkRound(dn) {
      let c = pianoInterval[0] + dn;
      // playPitch(c);
      if (c == pianoInterval[1]) {
        stat['r'] += 1;
        statusTag.innerHTML = 'Right' + JSON.stringify(stat);
        stepInRow += 1;
        if (10 == stepInRow) {
          if (noteD > 1) noteD -= 1;
          stepInRow = 0;
        }
        nextRound();
      } else {
        stat['e'] += 1;
        statusTag.innerHTML = 'Error' + JSON.stringify(stat);
        stepInRow = 0;
        noteD += 1;
        nextRound();
      }
      statusTag.innerHTML += ' n: ' + pianoInterval[0] + ' noteD: ' + noteD + ' row: ' + stepInRow;
}

function initPianoKey() {
  pianoKeyTag = document.getElementById('pianoKey');
  statusTag = document.getElementById('status');
  stat = {'e': 0, 'r':0};
  stepInRow = 0;
  keyRange = [28, 116];
  // pianoInterval = [Ut.getRandomInt(keyRange[0], keyRange[1])];
  pianoInterval = [72];
  noteD = 1;
  addRandomInterval();
  for (let i = 0; i < 25; i++) {
    let dn = i - 12;
    let e = document.createElement('button');
    e.innerHTML = dn;
    pianoKeyTag.append(e);
    e.addEventListener('click', () => {
      checkRound(dn);
    });
  }
}

function nextRound() {
  do {
    pianoInterval.shift();
    addRandomInterval();
  } while (pianoInterval[0] == pianoInterval[1]);

  playCurrentInterval();
}

function playCurrentInterval() {
  console.log(pianoInterval);
  playPitch(pianoInterval[0]);
  setTimeout(() => playPitch(pianoInterval[1]), 500);
}

function sayHello() {
  // startWaveTableNow(4+12*6+0);
  test();
}

function test() {
  let s = 28;
  for (let i = 0; i < 88; i++) {
    setTimeout(() => playPitch(s + i), i * 200);
  }
}

window.addEventListener('keyup', (e) => {
  let s = parseInt(e.key);
  if ('Space' == e.code || 'r' == e.key) {
    playCurrentInterval();
  } else if ('ArrowUp' == e.code) {
    playCurrentInterval();
  } else if ('ArrowLeft' == e.code) {
    checkRound(-noteD);
  } else if ('ArrowRight' == e.code) {
    checkRound(noteD);
  }
});

window.addEventListener("load", async function( event ) {
  initMusic();
  initPianoKey();
});
