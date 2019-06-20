class Metronome {

}

Metronome.d = 323 - 63;

Metronome.disable = function() {
  Metronome.ball.setAttributeNS(null, "style", "display: none");
}

Metronome.reset = function(dur) {
  Metronome.start = performance.now();
  Metronome.dur = dur;
  // Metronome.ball.setAttributeNS(null, "cy", 63);
  Metronome.ball.setAttributeNS(null, "cy", 323);
}

Metronome.tick = function(s) {
  var p = (performance.now() - Metronome.start) / Metronome.dur;
  if (p > 1) p = 1;
  Metronome.ball.setAttributeNS(null, "cy", Math.ceil(323 - Metronome.d * p));
}