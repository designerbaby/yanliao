<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.main">
      <BeatPiano></BeatPiano>
      <div :class="$style.right" ref="rightArea">
        <div ref="stage" :class="$style.stage" id="audioStage" @click.right="onRightClickStage">
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
              :class="[$style.pitch, it.selected ? $style.isActive : '', it.red ? $style.isRed: '']"
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
              @click.exact="onClickPitch($event, index)"
              @click.shift.exact="onShiftClickPitch($event, index)"
              @click.ctrl.exact="onCtrlClickPitch($event, index)"
              @click.right.stop.prevent.exact="onRightClickPitch($event, index)"
              @click.shift.right.exact="onShiftRightClickPitch($event, index)"
              slot="reference"
            >
              {{ it.hanzi }}
              <Arrow :pitch="it" direction="left" @move-end="onArrowMoveEnd($event, index)"/>
              <Arrow :pitch="it" direction="right" @move-end="onArrowMoveEnd($event, index)"/>
              <!-- <img :class="$style.aerate" src="@/assets/audioEditor/aerate.png" v-if="it.insertAeration"/> -->
            </div>
          </template>
          <BeatMenuList
            ref="BeatMenuList"
            @editLyric="editLyric"
            v-if="$store.state.showMenuList"
          ></BeatMenuList>
          <div :class="$style.sharp" ref="sharp"></div>
          <PitchLine v-if="$store.state.mode === modeState.StateLine" ref="PitchLine"></PitchLine>
          <PitchElement v-if="$store.state.mode === modeState.StateElement" ref="PitchElement"></PitchElement>
        </div>
        <Parameters ref="Parameters" v-if="$store.state.typeMode !== typeModeState.StateNone"></Parameters>
      </div>
      <BeatStageList ref="BeatStageList" v-if="$store.state.showStageList"></BeatStageList>
    </div>
    <BeatLyric ref="BeatLyric" @showLyric="showLyric"></BeatLyric>
    <LyricCorrect ref="LyricCorrect" @saveAllPinyin="beatLyricSaveAllPinyin"></LyricCorrect>
  </div>
</template>

<script>
import { pitchList, playState, modeState, typeModeState } from "@/common/utils/const"
import { Message } from "element-ui"
import BeatTop from './BeatTop.vue'
import BeatPiano from './BeatPiano.vue'
import BeatStageBg from './BeatStageBg.vue'
import BeatLine from './BeatLine.vue' // 播放线
import Arrow from './Arrow.vue'
import PitchLine from './PitchLine.vue' // 音高线
import PitchElement from './PitchElement.vue' // 音素
import BeatLyric from './BeatLyric.vue'
import LyricCorrect from './LyricCorrect.vue'
import BeatMenuList from './BeatMenuList.vue'
import BeatStageList from './BeatStageList.vue'
import Parameters from './Parameters.vue'
import StatusBar from './StatusBar.vue'
import { amendTop, amendLeft } from '@/common/utils/helper'

export default {
  name: "BeatContainer",
  components: {
    BeatTop,
    Message,
    BeatPiano,
    BeatStageBg,
    Arrow,
    BeatLine,
    BeatStageList,
    PitchLine,
    BeatLyric,
    LyricCorrect,
    BeatMenuList,
    Parameters,
    StatusBar,
    PitchElement
  },
  data() {
    return {
      pitchList: pitchList,
      modeState: modeState,
      typeModeState: typeModeState,
      isMouseDown: false,
      startPos: null,
      endPos: null,
      movePitchStart: null,
      actionPitchIndex: -1
    }
  },
  computed: {
    stagePitches() {
      return this.$store.state.stagePitches
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
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    playState() {
      return this.$store.state.playState
    }
  },
  mounted() {
    this.updateStageOffset()
    // window.addEventListener('resize', () => { // 缩放功能
    //   this.updateStageOffset()
    // })
    this.$refs.rightArea.addEventListener('scroll', () => {
      this.updateStageOffset()
    })
    document.getElementById('audioStage').oncontextmenu = (e) => {
      // 右键基础事件被阻止掉了
      return false
    }
  },
  methods: {
    scrollTo(left) {
      this.$refs.rightArea.scrollLeft = left
    },
    updateStageOffset() {
      // 初始化舞台的位置
      const scrollLeft = this.$refs.rightArea.scrollLeft
      const scrollTop = this.$refs.rightArea.scrollTop

      this.$store.dispatch("changeStoreState", {
        stage: {
          ...this.$store.state.stage,
          scrollLeft,
          scrollTop
        }
      })
    },
    onRightClickStage(event) {
      console.log('右键整个舞台事件 onRightClickStage:', event)
      const rect = this.$refs.stage.getBoundingClientRect()

      const left = event.clientX - 10
      const top = event.layerY + 10

      const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.$store.dispatch('changeStoreState', { showStageList: true })
      this.$nextTick(() => {
        this.$refs.BeatStageList.setPosition(left, top, pos)
      })
    },
    onClickPitch(event, index){
      // 单纯单击绿色块鼠标事件
      console.log('单纯单击绿色块鼠标事件 onClickPitch:', event)
      this.$store.dispatch('resetStagePitchesSelect')
      this.actionPitchIndex = index
      this.stagePitches[index].selected = true
    },
    onShiftClickPitch(event, index) {
      // 绿色块鼠标+shift事件
      console.log('绿色块鼠标+shift事件 onShiftClickPitch:', event, index)
      this.$store.dispatch('resetStagePitchesSelect')
      console.log('this.actionPitchIndex:', this.actionPitchIndex)
      if (this.actionPitchIndex >= 0) {
        this.stagePitches.filter((_, i) => {
          if (this.actionPitchIndex < index) {
            return i >= this.actionPitchIndex && i <= index
          } else {
            return i >= index && i <= this.actionPitchIndex
          }
        }).forEach(v => v.selected = true)
      }

      this.actionPitchIndex = index
    },
    onCtrlClickPitch(event, index) {
      // 绿色块鼠标ctrl事件
      console.log('绿色块鼠标ctrl事件 onCtrlClickPitch:', event)
      this.stagePitches[index].selected = true
    },
    onRightClickPitch(event, index) {
      console.log(`单纯点击鼠标绿色块右键事件 onRightClickPitch,`, event, index)
      this.$store.dispatch('resetStagePitchesSelect')
      this.commonRightClickPitch(event, index)
    },
    onShiftRightClickPitch(event, index) {
      console.log(`shift+鼠标右键事件 onShiftRightClickPitch,`, event, index)
      this.commonRightClickPitch(event, index)
    },
    commonRightClickPitch(event, index) {
      this.$store.dispatch('changeStoreState', { showMenuList: true })
      this.stagePitches[index].selected = true
      this.$nextTick(() => {
        this.$refs.BeatMenuList.setPosition(event.layerX, event.layerY + this.noteHeight)
      })
    },
    onPitchMouseDown(event, index){
      // 绿色块鼠标按下事件
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
      // console.log('onPitchMouseMove:', event)
      if (this.movePitchStart) {
        const { target } = this.movePitchStart
        let newLeft = this.movePitchStart.left + (event.clientX - this.movePitchStart.clientX)
        let newTop = this.movePitchStart.top + (event.clientY - this.movePitchStart.clientY)

        if (newTop < 0) {
          newTop = 0
        }
        if (newLeft < 0) {
          newLeft = 0
        }

        target.style.transform = `translate(${newLeft}px, ${newTop}px)`
        target.dataset.left = newLeft
        target.dataset.top = newTop
      }
    },
    onPitchMouseUp(event) {
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

        const newLeft = amendLeft(left, this.noteWidth)
        const newTop = amendTop(top, this.noteHeight)
        // const isPositionChanged = pitch.left !== newLeft || pitch.top !== newTop
        pitch.left = newLeft
        pitch.top = newTop

        target.style.transform = `translate(${pitch.left}px, ${pitch.top}px)`
        target.dataset.left = pitch.left
        target.dataset.top = pitch.top
        this.$store.dispatch('afterChangePitchAndHandle')
        // if (isPositionChanged) {}
      }
    },
    onMouseDown(event) {
      // 画音块，鼠标按住事件
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }

      this.isMouseDown = true; // 要保证鼠标按下了，才能确保鼠标移动

      const rect = this.$refs.stage.getBoundingClientRect()

      this.startPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      // 初始化绿色块
      this.$refs.sharp.style.left = `${this.startPos.x}px`;
      this.$refs.sharp.style.top = `${this.startPos.y}px`;
      this.$refs.sharp.style.width = `1px`;
      this.$refs.sharp.style.height = `1px`;
      this.$refs.sharp.style.display = "block";
    },
    onMouseMove(event) {
      // 画音块鼠标移动事件
      if (this.isMouseDown) {
        const rect = this.$refs.stage.getBoundingClientRect()
        const pos = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
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
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
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

        const top = amendTop(topPx, this.noteHeight)
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
      this.$store.dispatch('resetStagePitchesSelect')
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
        fu: 'l',
        yuan: 'a',
        selected: true,
        pitchChanged: true
      });
      console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: 啦, pinyin: la, red: false, pinyinList: ['la'], select: 0, fu: 'l', yuan: 'a', selected: true, pitchChanged: true`)
      this.$store.dispatch('afterChangePitchAndHandle')
      this.stagePitches.forEach((item, index) => {
        if (item.selected) {
          this.actionPitchIndex = index
        }
      })
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
      pitch.pitchChanged = true
      // console.log(`onArrowMoveEnd: pitch.left: ${pitch.left}, pitch.width: ${pitch.width}, pitch.top: ${pitch.top}, direction: ${direction}`)
      this.$store.dispatch('afterChangePitchAndHandle')
    },
    editLyric(type) {
      this.$refs.BeatLyric.showLyric(type)
    },
    beatLyricSaveAllPinyin() {
      this.$refs.BeatLyric.save()
    },
    showLyric(lyric) {
      this.$refs.LyricCorrect.showLyric(lyric)
    },
    toCheckOverStage(x) { // 向右移动如果超过舞台宽度，舞台继续加
      // console.log('toCheckOverStage:x', x)
      // console.log('this.stageWidth:', this.stageWidth)
      while ((x + 500) >= this.stageWidth) {
        this.$store.dispatch('updateMatter', 15)
      }
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
  height: calc(100%);
  left: 50px;
  user-select: none;
  overflow-x: scroll;
  overflow-x: overlay;
  &::-webkit-scrollbar {
    position: absolute;
    width: 0px;
    height: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
  }
}

.stage {
  position: relative;
  // width: calc(100% - 50px);
  user-select: none;
}
.drawStage {
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 10; // 绘画舞台的层级
  overflow: hidden;
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

// .aerate {
//   width: 38px;
//   height: 53px;
//   position: absolute;
//   top: -47px;
//   left: -15px;
// }

</style>
