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
let extension = '';

// 声音地址
// mp4: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.mp4
// wav: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.wav 
// webm: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.webm
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

let sample = null
function toloadSample () {
  const url = `https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.${extension}`
  loadSample(url).then(sam => {
    sample = sam
  })
}
toloadSample()
// 这里主要是为了去缓存下sample
export const playPiano = (pitch) => {
  if (!sample) {
    toloadSample()
    playSample(sample, pitch); 
  } else {
    playSample(sample, pitch); 
  }
}
