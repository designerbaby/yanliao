import WaveSurfer from 'wavesurfer.js'

let waveSurfer = null

let isReady = false
export const getWaveSurfer = () => {
  return waveSurfer
}

export const waveSurferIsReady = () => {
  return isReady
}

export const clearWaveSurfer = () => {
  waveSurfer.destroy()
  waveSurfer = null
}

export const setCurrentTime = (time) => {
  waveSurfer.setCurrentTime(time)
}

export const createWaveSurfer = (file, type) => {
  waveSurfer = WaveSurfer.create({
    container: '#waveform',
    backgroundColor: 'rgba(255,255,255,0.07)', // 音波的背景颜色
    height: 48,     // 音波的高度
    pixelRatio: 1,  // 渲染的更快
    interact: false, // 是否可以通过鼠标来调整音波的播放位置
    fillParent: false
    // minPxPerSec: 10
  })
  waveSurfer.on('ready', () => {
    isReady = true
  })

  if (type === 'blob') {
    waveSurfer.loadBlob(file)
  } else {
    waveSurfer.load(file)
  }
  return waveSurfer
}

