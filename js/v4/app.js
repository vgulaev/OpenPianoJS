import {ChordChain} from './classes/chordChain.js';
import {FragmentCoacher} from './coachers/fragmentCoacher.js'
import {GrandStaff} from './classes/grandStaff.js';
import {LearnCoacher} from './coachers/learnCoacher.js';
import {Mover} from './classes/mover.js';
import {MusicFiles} from '../../conf/settings.js'
import {Piano} from './classes/piano.js';
import {Sheet} from './classes/sheet.js';
import {Stats} from './classes/stats.js';
import {TempoCoacher} from './coachers/tempoCoacher.js';
import {UI} from './classes/ui.js'

class App {
  constructor() {
    this.stats = Stats;
    this.stats.init();
    this.stats.loadState();
    this.grandStaff = new GrandStaff(this);
    this.sheet = new Sheet(this);
    this.mover = new Mover(this);
    this.piano = new Piano(this);
    this.piano.init(this.mover);
    this.ui = new UI(this);
    this.sensei = new FragmentCoacher(this);
    // this.sensei = new LearnCoacher(this);
    // this.sensei = new TempoCoacher(this);
  }

  load(url) {
    this.sheet.name = MusicFiles.filter(e => e['fileName'] == url)[0].name;
    this.sheet
      .load(url)
      .then(() => {
        this.cc = new ChordChain(this.sheet);
        this.mover.assign(this.cc);
        this.sensei.init();
      });
  }
}

globalThis.app = new App();
window.addEventListener('load', function( event ) {
  // app.load('data/xml/Arpeggio D minor broken.musicxml');
  // app.load('data/xml/Beethoven Bagatelle No. 25 in A minor.musicxml');
  // app.load('data/xml/Beethoven Piano_Sonata_No.21_Op.53.musicxml');
  // app.load('data/xml/Beethoven Sonata 14 C Sharp Minor.musicxml');
  // app.load('data/xml/Beethoven Sonata 14 C Sharp Minor 3rd Movemen.musicxml');
  // app.load('data/xml/Beethoven Sonata No. 8 Op. 13 Pathetique - Second Ab major.musicxml');
  // app.load('data/xml/Beethoven Sonate No. 17 Tempest 3rd Movement.musicxml');
  // app.load('data/xml/Beethoven Symphony No. 5 1 st movement Piano solo.musicxml');
  // app.load('data/xml/billie jean.musicxml');
  // app.load('data/xml/Burgmuller - Op.100 - Arabesque.musicxml');
  // app.load('data/xml/BWV 528_Organ_Sonata_No._4_-_2._Andante_Adagio_-_Vikingur_Olafsson_Interpretation.musicxml');
  // app.load('data/xml/BWV-565.musicxml');
  // app.load('data/xml/BWV 847 Prelude C Minor.musicxml');
  // app.load('data/xml/BWV 848 Prelude C Major.musicxml');
  // app.load('data/xml/BWV 1068 J._S._Bach_-_Air_on_the_G_String_Piano_arrangement.musicxml');
  // app.load('data/xml/BWV 849 Prelude C sharp Minor.musicxml');
  app.load('data/xml/BWV 853 Prelude N8 in E Flat Minor.musicxml');
  // app.load('data/xml/BWV 927.musicxml');
  // app.load('data/xml/BWV-565.musicxml');
  // app.load('data/xml/Canon_in_D_full.musicxml');
  // app.load('data/xml/Chopin - Fantaisie-Impromptu.musicxml');
  // app.load('data/xml/Chopin Sonata_No.2_in_B-flat_minor.musicxml');
  // app.load('data/xml/Chopin_-_Nocturne_Op_9_No_1_B_Flat_Minor.musicxml');
  // app.load('data/xml/Chopin_Nocture_opus_9_number2.musicxml');
  // app.load('data/xml/Czerny-Germer-19.musicxml');
  // app.load('data/xml/Debussy - Clair de Lune Suite Bergamasque No. 3.musicxml');
  // app.load('data/xml/Dance_of_the_Knights_Transcription_for_solo_piano.musicxml');
  // app.load('data/xml/Domenico Scarlatti K.466.musicxml');
  // app.load('data/xml/Einaudi - Fly.musicxml');
  // app.load('data/xml/Etude_No._15_in_D_Minor_Opus_45_No._15_Heller.musicxml');
  // app.load('data/xml/Ennio Morricone - Chi Mai.musicxml');
  // app.load('data/xml/Evil_Morty_Theme_For_the_Damaged_Coda_Solo_Piano.musicxml');
  // app.load('data/xml/Game_of_Thrones_Main_Theme.musicxml');
  // app.load('data/xml/Gnossienne_No._1.musicxml');
  // app.load('data/xml/Gymnopedie.musicxml');
  // app.load('data/xml/Grieg_-_Piano_Concerto_in_A_minor_-_1st_movement_-_Piano_Solo.musicxml');
  // app.load('data/xml/Hanon - Ex 6.musicxml');
  // app.load('data/xml/Ilya Beshelvi - Wind.musicxml');
  // app.load('data/xml/Jingle_Bells.musicxml');
  // app.load("data/xml/John Towner Williams - Hedwig's theme.musicxml")
  // app.load('data/xml/LE_COUCOU_by_DAQUIN_The_Cuckoo.musicxml');
  // app.load('data/xml/Liszt - Etude_in_G_Minor_La_Campanella_S._1413.musicxml');
  // app.load('data/xml/Liszt - Etude_in_G_Minor_La_Campanella_S._1413-cuted.musicxml');
  // app.load('data/xml/Lucifer - Creep.musicxml');
  // app.load('data/xml/Ludovico Einaudi - Dietro Casa.musicxml');
  // app.load('data/xml/Maksim Mrvica - Croatian Rhapsody.musicxml');
  // app.load('data/xml/Mozart - Lacrimosa_original_transcription_for_piano.musicxml');
  // app.load('data/xml/Mozart-Fantasia in D Minor K. 397.musicxml');
  // app.load('data/xml/Mozart-Sonata_16.musicxml');
  // app.load('data/xml/Myuu - Identity Crisis.musicxml');
  // app.load('data/xml/National_Anthem_of_the_USSRRussia.musicxml');
  // app.load('data/xml/Prelude_in_G_Minor_Op._23_No._5.musicxml');
  // app.load('data/xml/Philip Glass - Walk to school.musicxml');
  // app.load('data/xml/primavera.musicxml');
  // app.load('data/xml/Rachmaninoff_-_Piano_Concerto_No._2_Op._18.musicxml');
  // app.load('data/xml/Re major arpeggio.musicxml');
  // app.load('data/xml/River_Flows_in_You.musicxml');
  // app.load('data/xml/SYML - I wanted to Leave.musicxml');
  // app.load('data/xml/Schubert_Ellens Gesang III D.839.musicxml');
  // app.load('data/xml/Schumann_Toccata_Op._7_Piano_solo.musicxml');
  // app.load('data/xml/Shostakovich_Waltz_No._2.musicxml');
  // app.load('data/xml/Sorry Seems To Be The Hardest Word.musicxml');
  // app.load('data/xml/The Entertainer.musicxml');
  // app.load('data/xml/The pink panther theme.musicxml');
  // app.load('data/xml/Tchaikovsky_Op._39_Childrens_Album_-_P._I._IX. Новая кукла.musicxml');
  // app.load('data/xml/Tchaikovsky_Op._39_Childrens_Album_-_P._I._VI. Болезнь куклы.musicxml');
  // app.load('data/xml/Tchaikovsky_Op._39_Childrens_Album_-_P._I._VII. Похороны куклы.musicxml');
  // app.load('data/xml/Чайковский - Танец феи драже (Плетнёв).musicxml');
  // app.load('data/xml/The Daydream - Tears B minor.musicxml');
  // app.load('data/xml/Vivaldi_-_Violin_Concerto_in_E_major_Op._8_No._1_RV._269_Spring_for_Solo_Piano.musicxml');
  // app.load('data/xml/Yann Tiersen - Comptine Dun Autre Ete Lapres.musicxml');
  // app.load('data/xml/test.musicxml');
});
