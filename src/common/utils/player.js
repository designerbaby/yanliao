// import {Howl, Howler} from 'howler';
// https://github.com/goldfire/howler.js

export const PlayAudio = ({ url, startTime = 0, onProgress, onPlay, onPause, onEnd}) => {
  console.log(`PlayAudio:`, url, startTime)
  const eleId = `my-audio`
  var audio = document.getElementById(eleId)
  if (audio) {
    audio.parentNode.removeChild(audio)
  }
  
  audio = document.createElement('audio') //生成一个audio元素 
  audio.controls = true
  audio.src = url
  audio.id = eleId
  audio.type ="audio/wav"
  audio.style.display = 'none'

  audio.addEventListener("timeupdate", (event) => {
    const time = event.target.currentTime
    onProgress && onProgress(time)
  })

  audio.addEventListener("ended", (event) => {
    onEnd(event.target)
  })

  audio.addEventListener("play", (event) => {
    onPlay(event.target)
  })
  audio.addEventListener("pause", (event) => {
    onPause(event.target)
  })

  // audio.addEventListener("")

  document.body.appendChild(audio)

  // audio.play()
  // audio.currentTime = startTime

  return audio
}