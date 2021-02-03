<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.beat" @click="toShowBeat">
      {{ beatForm.fenzi }}/{{ beatForm.fenmu }}
    </div>
    <BeatPiano></BeatPiano>
    <div :class="$style.right">
      <div :class="$style.top">
        <div :class="$style.matter" v-for="n in matter" :key="n" :style="{width: `${beatWidth}px`}">{{ n }}</div>
      </div>
      <div ref="stage" :class="$style.stage" id="audioStage">
        <BeatStageBg></BeatStageBg>
        <BeatLine></BeatLine>
        <div 
          ref="drawStage"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          :class="$style.drawStage" 
          :style="{ width: `${stageWidth}px`, height: `${stageHeight}px`}"
        ></div>
        <template v-for="(it, index) in stagePitches">
          <div
            :class="[$style.pitch, selectedPitch === index ? $style.isActive : '', it.red ? $style.isRed: '']"
            :style="{
              width: `${it.width}px`,
              height: `${it.height}px`,
              transform: `translate(${it.left}px, ${it.top}px)`
            }"
            :key="index"
            :data-left="it.left"
            :data-top="it.top"
            @mousedown.self="onPitchMouseDown($event, index)"
            @mouseup.self="onPitchMouseUp"
            slot="reference"
          >
            {{ it.hanzi }}
            <Arrow direction="left" :pitch="it" @move-end="onArrowMoveEnd($event, index)"/>
            <Arrow direction="right" :pitch="it" @move-end="onArrowMoveEnd($event, index)"/>
          </div>
        </template>
        <BeatList
          ref="BeatList"
          :index="index"
          @deletePitch="toDeletePitch"
          @editLyric="editLyric"
          v-if="showList === index"
        ></BeatList>
        <div :class="$style.sharp" ref="sharp"></div>
        <PitchLine v-if="this.$store.state.mode === 1" ref="PitchLine"></PitchLine>
      </div>
    </div>
    <BeatLyric ref="BeatLyric" @showLyric="showLyric"></BeatLyric>
    <LyricCorrect ref="LyricCorrect" @saveAllPinyin="beatLyricSaveAllPinyin"></LyricCorrect>
  </div>
</template>

<script>
import { pitchList, playState } from "@/common/utils/const"
import { Message } from "element-ui"
import BeatPiano from './BeatPiano.vue'
import BeatStageBg from './BeatStageBg.vue'
import BeatLine from './BeatLine.vue' // 播放线
import Arrow from './Arrow.vue'
import PitchLine from './PitchLine.vue' // 音高线
import BeatLyric from './BeatLyric.vue'
import LyricCorrect from './LyricCorrect.vue'
import BeatList from './BeatList.vue'
import { amendTop, amendLeft } from '@/common/utils/helper'

export default {
  name: "BeatContainer",
  components: {
    Message,
    BeatPiano,
    BeatStageBg,
    Arrow,
    BeatLine,
    PitchLine,
    BeatLyric,
    LyricCorrect,
    BeatList
  },
  data() {
    return {
      pitchList: pitchList,
      isMouseDown: false,
      startPos: null,
      endPos: null,
      stageOffset: null,
      movePitchStart: null,
      selectedPitch: -1,
      showList: -1,
      index: 0
    }
  },
  computed: {
    stagePitches() {
      return this.$store.state.stagePitches
    },
    beatForm() {
      return this.$store.state.beatForm
    },
    noteWidth() {
      return this.$store.state.noteWidth
    },
    noteHeight() {
      return this.$store.state.noteHeight
    },
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    matter() {
      return this.$store.state.matter
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    beatWidth() {
      return this.$store.getters.beatWidth
    },
    playState() {
      return this.$store.state.playState
    }
  },
  mounted() {
    this.updateStageOffset()
    // window.addEventListener('resize', () => {
    //   this.updateStageOffset()
    // })
    this.$refs.stage.addEventListener('scroll', () => {
      this.updateStageOffset()
    })
    document.getElementById('audioStage').oncontextmenu = (e) => { 
      // 右键基础事件被阻止掉了
      return false
    }
  },
  methods: {
    checkPitchDuplicated() { // 检查音符块有没重叠
      // log('checkPitchDuplicated pitches:', this.stagePitches)
      const pitches = this.stagePitches
      for(let i = 0; i < pitches.length; i++){
        const pitch1 = pitches[i]
        pitch1.red = false
        for(let j = 0; j < pitches.length; j++){
          const pitch2 = pitches[j]
          if (i !== j) {
            let leftPitch = null
            let rightPitch = null

            if (pitch1.left < pitch2.left) {
              leftPitch = pitch1
              rightPitch = pitch2
            } else {
              leftPitch = pitch2
              rightPitch = pitch1
            }
            
            const isRed = leftPitch.left + leftPitch.width > rightPitch.left
            if (isRed) {
              pitch1.red = isRed
            }
            // console.log(`检查外层第${i}个格子left:${pitch1.left},width:${pitch1.width}，内层第${j}个格子left:${pitch2.left},width:${pitch2.width} ,red:${isRed}`)
          }
        }
      }
    },
    updateStageOffset() {
      // 初始化舞台的位置
      const scrollLeft = this.$refs.stage.scrollLeft
      const scrollTop = this.$refs.stage.scrollTop
      this.stageOffset = {
        scrollLeft,
        scrollTop
      }
    },
    toShowBeat() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.$emit("showBeat");
    },
    onPitchMouseDown(event, index){
      console.log(`onPitchMouseDown`, event, index, event.button)
      // 绿色块鼠标按下事件
      this.hideRight()
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      const target = event.target
      target.style.opacity = 0.8
      this.index = index
      this.toSelectPitch(index)
      if (event.button === 2) { // 按下了鼠标右键
        this.showRight(index)
        this.$nextTick(() => {
          this.$refs.BeatList.setPosition(event.layerX, event.layerY + this.noteHeight)
        })
      }
      this.movePitchStart = {
        left: Number(target.dataset.left),
        top: Number(target.dataset.top),
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        index
      }

      document.addEventListener('mousemove', this.onPitchMouseMove)
      document.addEventListener('mouseleave', this.onPitchMouseUp)
      // console.log(`this.movePitchStart:`, this.movePitchStart)
    },
    onPitchMouseMove(event){
      // 绿色块鼠标移动事件
      if (this.movePitchStart) {
        const { target } = this.movePitchStart
        let newLeft = this.movePitchStart.left + (event.clientX - this.movePitchStart.clientX)
        let newTop = this.movePitchStart.top + (event.clientY - this.movePitchStart.clientY)

        if (newTop < 0) {
          newTop = 0
        }
        if (newLeft < 0) { // sdk那边限制不能从0开始画
          newLeft = 0
        }
        // console.log('target:', target)
        target.style.transform = `translate(${newLeft}px, ${newTop}px)`
        target.dataset.left = newLeft
        target.dataset.top = newTop
      }
    },
    onPitchMouseUp(event) {
      console.log(`onPitchMouseUp`)
      if (this.movePitchStart) {
        document.removeEventListener('mousemove', this.onPitchMouseMove)
        document.removeEventListener('mouseleave', this.onPitchMouseUp)
        const { target, index } = this.movePitchStart
        // 绿色块鼠标移走事件
        event.target.style.opacity = 1
        this.movePitchStart = null

        const left = parseInt(event.target.dataset.left, 10)
        const top = parseInt(event.target.dataset.top, 10)

        // 松开时修正位置
        const pitch = this.stagePitches[index]
        
        // pitch.left = Math.floor(left / this.noteWidth) * this.noteWidth
        pitch.left = amendLeft(left, this.noteWidth)
        pitch.top = amendTop(top, this.noteHeight)

        target.style.transform = `translate(${pitch.left}px, ${pitch.top}px)`
        target.dataset.left = pitch.left
        target.dataset.top = pitch.top
        this.checkPitchDuplicated()
      }
    },
    onMouseDown(event) {
      // console.log(`onStageMouseDown`)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.hideRight()
      this.isMouseDown = true; // 要保证鼠标按下了，才能确保鼠标移动

      const rect = this.$refs.stage.getBoundingClientRect()

      this.startPos = {
        x: event.clientX + this.stageOffset.scrollLeft - rect.left,
        y: event.clientY + this.stageOffset.scrollTop - rect.top
      };
      // console.log(`this.startPos, x: ${this.startPos.x}, y: ${this.startPos.y}`)
      // 初始化绿色块
      this.$refs.sharp.style.left = `${this.startPos.x}px`;
      this.$refs.sharp.style.top = `${this.startPos.y}px`;
      this.$refs.sharp.style.width = `1px`;
      this.$refs.sharp.style.height = `1px`;
      this.$refs.sharp.style.display = "block";
    },
    onMouseMove(event) {
      if (this.isMouseDown) {
        const rect = this.$refs.stage.getBoundingClientRect()
        const pos = {
          x: event.clientX + this.stageOffset.scrollLeft - rect.left,
          y: event.clientY + this.stageOffset.scrollTop - rect.top
        };
        
        const width = pos.x - this.startPos.x;
        const height = pos.y - this.startPos.y;

        // console.log(`size:`, width, height);

        // 小于0 表示从开始位置在右边，从右边往左边滑
        if (width < 0) {
          this.$refs.sharp.style.left = `${pos.x}px`;
        }
        // 小于0 表示从开始位置在下边，从下边往上滑
        if (height < 0) {
          this.$refs.sharp.style.top = `${pos.y}px`;
        }

        this.$refs.sharp.style.width = `${Math.abs(width)}px`;
        this.$refs.sharp.style.height = `${Math.abs(height)}px`;
        this.toCheckOverStage(pos.x)
      }
    },
    onMouseUp(event) {
      // 必须先按下了鼠标，才有松开鼠标事件
      if (this.isMouseDown) {
        this.isMouseDown = false;
        const rect = this.$refs.stage.getBoundingClientRect()
        this.endPos = {
          x: event.clientX + this.stageOffset.scrollLeft - rect.left,
          y: event.clientY + this.stageOffset.scrollTop - rect.top
        };
        // console.log(`this.endPos: x${this.endPos.x}, y: ${this.endPos.y}`)
        this.$refs.sharp.style.display = "none";

        //
        //   |``````|
        //   |______|
        //

        // 一个矩形里面，上边和下边的位置，哪个小取哪个，也就是取上边的位置
        const startToEndx = this.endPos.x - this.startPos.x
        const startToEndy = this.endPos.y - this.startPos.x

        if (Math.abs(startToEndx) < 10 || Math.abs(startToEndy) < 10) {
          // Message.error('移动距离小于10')
          return
        }

        const topPx = Math.min(this.startPos.y, this.endPos.y);
        const initLeft = Math.min(this.startPos.x, this.endPos.x);
        // const top = topPx - (topPx % this.noteHeight);
        const top = amendTop(topPx, this.noteHeight)
        // const left = Math.floor(initLeft / this.noteWidth) * this.noteWidth
        const left = amendLeft(initLeft, this.noteWidth)
        
        const initWidth = Math.abs(this.startPos.x - this.endPos.x);
        // 根据32分音符的最小像素调整宽度
        const width = Math.max(Math.ceil(initWidth / this.noteWidth) * this.noteWidth, 20)
        this.addOnePitch({
          width,
          height: this.noteHeight,
          left,
          top
        });
        this.toCheckOverStage(this.endPos.x)
      }
    },

    addOnePitch({ width, height, left, top }) {
      this.stagePitches.push({
        width,
        height,
        left,
        top,
        hanzi: '啦',
        pinyin: 'la',
        red: false,
        pinyinList: ['la'],
        select: 0,
      });
      console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: 啦, pinyin: la, red: false, pinyinList: ['la'], select: 0`)
      this.selectedPitch = this.stagePitches.length - 1 // 生成新的数据块后那个高亮
      this.stagePitches.sort((a, b) => a.left - b.left) // 上面push之后是乱序的，要排序下
      this.checkPitchDuplicated()
      this.checkPitchesOverStage()
    },

    onArrowMoveEnd({ width, left, top, target, direction }, index) {
      const pitch = this.stagePitches[index]
      // console.log(`onArrowMoveEnd: width: ${width}, left: ${left}, top: ${top}, target: ${target}, direction: ${direction}`)
      // 结束后修正宽度和左边距
      pitch.left = Math.floor(left / this.noteWidth) * this.noteWidth
      pitch.top = top
      if (direction === 'left') {
        // 向左的话,他是要增的，所以要向上取整
        pitch.width = Math.ceil(width / this.noteWidth) * this.noteWidth
      } else {
        pitch.width = Math.floor(width / this.noteWidth) * this.noteWidth
      }
      
      target.style.transform = `translate(${pitch.left}px, ${pitch.top}px)`
      target.style.width = `${pitch.width}px`
      
      // console.log(`onArrowMoveEnd: pitch.left: ${pitch.left}, pitch.width: ${pitch.width}, pitch.top: ${pitch.top}, direction: ${direction}`)

      this.checkPitchDuplicated()
    },
    
    toSelectPitch(index) {
      this.selectedPitch = index
    },
    showRight(index) {
      this.selectedPitch = index
      this.showList = index
    },
    hideRight () {
      this.selectedPitch = -1
      this.showList = -1
    },
    toDeletePitch(index) {
      this.stagePitches.splice(index, 1)
      this.showList = -1 // 删除掉之后顺便把选择的还原
      this.checkPitchDuplicated()
    },
    editLyric(index) {
      this.$refs.BeatLyric.showLyric(index)
      this.showList = -1
    },
    showLyric(lyric, index) {
      console.log('showLyric:', lyric, index)
      this.$refs.LyricCorrect.showLyric(lyric, index)
    },
    beatLyricSaveAllPinyin() {
      this.$refs.BeatLyric.savePinyin()
      this.$refs.BeatLyric.savePinyinList()
      this.$refs.BeatLyric.saveHanzi()
    },
    toCheckOverStage(x) { // 向右移动如果超过舞台宽度，舞台继续加
      // console.log('toCheckOverStage:x', x)
      // console.log('this.stageWidth:', this.stageWidth)
      if ((x + 100) >= this.stageWidth) {
        this.$store.dispatch('updateMatter', 15)
      }
    },
    checkPitchesOverStage() {
      let maxPitchRight = 0
      this.stagePitches.forEach((item) => {
        const right = item.left + item.width
        maxPitchRight = Math.max(maxPitchRight, right)
        this.$store.dispatch('changeStoreState', { maxPitchRight: maxPitchRight})
      })
    }
  }
};
</script>

<style lang="less" module>
.container {
  border-top: 1px solid #282828;
  display: flex;
  width: 100%;
  margin: 0px;
  position: relative;
}

.right {
  position: absolute;
  width: calc(100% - 50px);
  height: 100%;
  left: 50px;
  user-select: none;
  overflow-x: scroll;
}

.top {
  height: 25px;
  position: relative;
  display: flex;
}

.stage {
  position: relative;
  // width: calc(100% - 50px);
  user-select: none;
}
.matter {
  height: 25px;
  color: #fff;
  font-size: 13px;
  border-left: 1px solid #626263;
  text-align: left;
  position: relative;
  padding-left: 5px;
  line-height: 25px;
  flex-shrink: 0;
}

.drawStage {
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 10; // 绘画舞台的层级
  overflow: hidden;
}
.beat {
  position: absolute;
  color: #fff;
  font-size: 13px;
  top: 3px;
  left: 15px;
}
.pitch {
  height: 0;
  width: 0;
  background: #57673b;
  border-radius: 3px;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  line-height: 25px;
  z-index: 10; // 音块的层级
  padding-left: 5px;
  &.isActive {
    background: rgb(20, 155, 49)
  }
  &.isRed {
    border: 1px solid red;
  }
}

.sharp {
  display: none;
  border: 1px solid #ccc;
  position: absolute;
  left: 300px;
  top: 200px;
  width: 1px;
  height: 1px;
  background-color: rgba(204, 204, 204, 0.514);
}


</style>
