// Support prefixed AudioContext used in Safari and old Chrome versions.
const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext(); // 创建音频的上下文

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

if ($audio.canPlayType('audio/webm; codecs=vorbis')) {
  extension = 'webm';
} else if ($audio.canPlayType('audio/mp4; codecs=mp4a.40.5')) {
  extension = 'm4a';
} else if ($audio.canPlayType('audio/wav; codecs=1')) {
  extension = 'wav';
} else {
  extension = 'mp3';
}
// const url = `https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.${extension}`
// const url = `https://musicx-1253428821.file.myqcloud.com/files/C4.${extension}?date=${Date.now()}`
const url = 'https://musicx-1253428821.file.myqcloud.com/files/C5.MP3'

function loadSample(url) { // 根据音源链接转成AudioBuffer对象
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

function playSample(sample, note) {
  const source = context.createBufferSource(); // 创建一个新的AudioBufferSourceNode接口
  source.buffer = sample; // 设置二进制源为AudioBuffer对象来播放
  source.playbackRate.value = 2 ** ((note - 60) / 12); // 根据音高来改变源播放的速率
  source.connect(context.destination); //  跟播放器连接
  source.start(0); // 对缓冲区包含的音频数据进行播放
}

let sample = loadSample(url)
export const playPiano = (pitch) => {
  sample.then(s => playSample(s, pitch))
}
