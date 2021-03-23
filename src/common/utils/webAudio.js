// Support prefixed AudioContext used in Safari and old Chrome versions.
const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

// Polyfill for old callback-based syntax used in Safari.
if (context.decodeAudioData.length !== 1) {
  const originalDecodeAudioData = context.decodeAudioData.bind(context);
  context.decodeAudioData = buffer =>
    new Promise((resolve, reject) =>
      originalDecodeAudioData(buffer, resolve, reject)
    );
}

const $audio = document.createElement("audio");
let extension = null;

if ($audio.canPlayType('audio/webm; codecs=vorbis')) {
  extension = 'webm';
} else if ($audio.canPlayType('audio/mp4; codecs=mp4a.40.5')) {
  extension = 'm4a';
} else if ($audio.canPlayType('audio/wav; codecs=1')) {
  extension = 'wav';
}

function loadSample(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

function playSample(sample, note) {
  const source = context.createBufferSource();
  source.buffer = sample;
  source.playbackRate.value = 2 ** ((note - 60) / 12);
  source.connect(context.destination);
  source.start(0);
}

const keyMap = {
  'KeyZ': 48,
  'KeyS': 49,
  'KeyX': 50,
  'KeyD': 51,
  'KeyC': 52,
  'KeyV': 53,
  'KeyG': 54,
  'KeyB': 55,
  'KeyH': 56,
  'KeyN': 57,
  'KeyJ': 58,
  'KeyM': 59,
  'KeyQ': 60,
  'Digit2': 61,
  'KeyW': 62,
  'Digit3': 63,
  'KeyE': 64,
  'KeyR': 65,
  'Digit5': 66,
  'KeyT': 67,
  'Digit6': 68,
  'KeyY': 69,
  'Digit7': 70,
  'KeyU': 71,
};

loadSample(`harpsichord-c4.${extension}`)
  .then(sample => {
    document.body.addEventListener('mousedown', event => {
      if (event.target.classList.contains('keyboard__key')) {
        playSample(sample, +event.target.dataset.note);
      }
    });
    document.addEventListener('keydown', event => {
      const note = keyMap[event.code];
      if (note) {
        playSample(sample, note);
        document.querySelector(`[data-note="${note}"]`).classList.add('keyboard__key--active');
      }
    });
    document.addEventListener('keyup', event => {
      const note = keyMap[event.code];
      if (note) {
        document.querySelector(`[data-note="${note}"]`).classList.remove('keyboard__key--active');
      }
    });
  })
