(function () {
  let rnd = Math.random();

  let libs = [
    'lib/webaudiofontdata/WebAudioFontPlayer.js?v=' + rnd,
    'lib/webaudiofontdata/0000_Aspirin_sf2_file.js?v=' + rnd
  ];
  if ('vgulaev.github.io' == location.host) {

  }

  libs.concat(
  [
  'js/solfeggio.js?v=' + rnd
  ]).forEach(function(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  });
}());
