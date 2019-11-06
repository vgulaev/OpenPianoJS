(function () {
  let rnd = Math.random();

  let prefix = 'lib';
  if ('vgulaev.github.io' == location.host) {
    prefix = 'https://surikov.github.io';
  }

  let libs = [
    `${prefix}/webaudiofont/npm/dist/WebAudioFontPlayer.js?v=` + rnd,
    `${prefix}/webaudiofontdata/sound/0000_Aspirin_sf2_file.js?v=` + rnd,
    `${prefix}/webaudiofontdata/sound/0000_Chaos_sf2_file.js?v=` + rnd
  ];

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
