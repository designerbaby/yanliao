<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.main">
      <BeatPiano></BeatPiano>

      <!-- 钢琴右侧 -->
      <div :class="$style.right" ref="rightArea" id="rightArea">
        <div ref="stage" :class="$style.stage" id="audioStage">
          <BeatStageBg></BeatStageBg>
          <BeatLine></BeatLine>
          <div
            id="drawStage"
            ref="drawStage"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
            @click.right="onRightClickStage"
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
              data-ref="pitch"
              :key="index"
              :data-left="it.left"
              :data-top="it.top"
              @mousedown.self="onPitchMouseDown($event, index)"
              @mouseup.self="onPitchMouseUp"
              @click.shift.exact="onShiftClickPitch($event, index)"
              @click.right.stop.prevent.exact="onRightClickPitch($event, index)"
              @click.shift.right.exact="onShiftRightClickPitch($event, index)"
              slot="reference"
            >
              {{ it.hanzi }}
              <Arrow :pitch="it" direction="left" @move-end="onArrowMoveEnd($event, index)"/>
              <Arrow :pitch="it" direction="right" @move-end="onArrowMoveEnd($event, index)"/>
              <Breath v-if="it.breath" :it="it" :index="index"></Breath>
            </div>
          </template>
          <BeatMenuList
            ref="BeatMenuList"
            @editLyric="editLyric"
            v-if="$store.state.const.showMenuList"
          ></BeatMenuList>
          <div :class="$style.sharp" ref="sharp"></div>
          <PitchLine v-if="$store.state.const.mode === ModeState.StateLine" ref="PitchLine"></PitchLine>
          <PitchElement v-if="$store.state.const.mode === ModeState.StateElement" ref="PitchElement"></PitchElement>
        </div>
        <Parameters ref="Parameters" v-if="$store.state.const.typeMode !== TypeModeState.StateNone"></Parameters>

        <!-- 自定义横向滚动条 -->
        <Bar wrapRef="rightArea" :move="this.barState.x" :size="this.barState.w" />
      </div>

      <BeatStageList ref="BeatStageList" v-if="$store.state.const.showStageList"></BeatStageList>
    </div>
    <BeatLyric ref="BeatLyric" @showLyric="showLyric"></BeatLyric>
    <LyricCorrect ref="LyricCorrect" @saveAllPinyin="beatLyricSaveAllPinyin"></LyricCorrect>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PlayState, ModeState, TypeModeState } from "@/common/utils/const"
import { Message } from "element-ui"
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
import Breath from './Breath.vue'
import { amendTop, amendLeft, generateUUID } from '@/common/utils/helper'
import { turnChangeLineMap } from '@/common/utils/common'
import Bar from '@/common/components/Scrollbar/src/bar'
// import Editor from '@/common/editor'
// import AddPitchCommand from '@/common/commands/AddPitchCommand'
// import MovePitchCommand from '@/common/commands/MovePitchCommand'

export default {
  name: "BeatContainer",
  components: {
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
    PitchElement,
    Breath,
    Bar
  },
  data() {
    return {
      ModeState: ModeState,
      TypeModeState: TypeModeState,
      isMouseDown: false,
      startPos: null,
      endPos: null,
      movePitchStart: null,
      selectedUUID: null,
      mouseModalTarget: null,
      barState: {  // 自定义滚动条状态
        x: 0,
        w: ''
      }
    }
  },
  computed: {
    ...mapGetters(['stageWidth']),
    stagePitches() {
      return this.$store.state.change.stagePitches
    },
    noteWidth() {
      return this.$store.state.const.noteWidth
    },
    noteHeight() {
      return this.$store.state.const.noteHeight
    },
    isSynthetizing() {
      return this.$store.state.const.isSynthetizing
    },
    stageWidth() {
      return this.$store.getters['const/stageWidth']
    },
    stageHeight() {
      return this.$store.getters['const/stageHeight']
    },
    playState() {
      return this.$store.state.const.playState
    }
  },
  watch: {
    stageWidth() {
      this.$nextTick(this.scrollBar)
    }
  },
  mounted() {
    this.updateStageOffset()
    this.$refs.rightArea.addEventListener('scroll', () => {
      this.updateStageOffset()
    })
    document.getElementById('audioStage').oncontextmenu = (e) => {
      // 右键基础事件被阻止掉了
      return false
    }
  },
  methods: {
    doSelectUUID(uuid) {
      // 为空时清空
      if (!uuid) {
        this.selectedUUID = null
      } else {
        // 如果之前没有值才设置
        if (!this.selectedUUID) {
          this.selectedUUID = uuid
        }
      }
    },
    scrollTo(left) {
      this.$refs.rightArea.scrollLeft = left
    },
    updateStageOffset() {
      this.scrollBar()
      // 初始化舞台的位置
      const scrollLeft = this.$refs.rightArea.scrollLeft
      const scrollTop = this.$refs.rightArea.scrollTop
      const rect = this.$refs.stage.getBoundingClientRect()

      this.$store.dispatch("const/changeState", {
        stage: {
          ...this.$store.state.const.stage,
          scrollLeft,
          scrollTop,
          rectLeft: rect.left,
          rectTop: rect.top,
        }
      })

    },
    // 滚动进度条
    scrollBar() {
      const wrap = this.$refs.rightArea
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth
      this.barState.w = widthPercentage < 100 ? widthPercentage + '%' : ''
      this.barState.x = (wrap.scrollLeft * 100) / wrap.clientWidth
      // console.log('scrollBar', this.stageWidth, wrap.clientWidth, wrap.scrollWidth, this.barState)
    },
    onRightClickStage(event) {
      console.log('右键整个舞台事件 onRightClickStage:', event)
      this.$store.dispatch('change/resetStagePitchesSelect')
      this.doSelectUUID(null)
      const rect = this.$refs.stage.getBoundingClientRect()

      const left = event.clientX - 10
      const top = event.layerY + 10

      const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.$store.dispatch('const/changeState', { showStageList: true })
      this.$nextTick(() => {
        this.$refs.BeatStageList.setPosition(left, top, pos)
      })
    },
    onShiftClickPitch(event, index) {
      // 绿色块鼠标+shift事件
      console.log('绿色块鼠标+shift事件 onShiftClickPitch:', event, index)
      this.$store.dispatch('const/changeState', { showStageList: false })
      // this.doSelectUUID(this.stagePitches[index].uuid)
      let start = this.stagePitches.findIndex(v => v.uuid === this.selectedUUID)
      start = start === -1 ? index : start

      let [from, to] = [start, index]
      if (start > index) {
        [from, to] = [index, start]
      }
      console.log(`from ${from}, to:${to}`, this.stagePitches.map(v => v.selected).reverse())
      this.stagePitches.forEach((v, i) => {
        if (i >= from && i <= to) {
          v.selected = true
        } else {
          v.selected = false
        }
      })
    },
    onRightClickPitch(event, index) {
      console.log(`单纯点击鼠标绿色块右键事件 onRightClickPitch,`, event, index)
      if (!this.stagePitches[index].selected) {
        this.$store.dispatch('change/resetStagePitchesSelect')
      }
      this.$store.dispatch('const/changeState', { showStageList: false })
      this.commonRightClickPitch(event, index)
    },
    onShiftRightClickPitch(event, index) {
      console.log(`shift+鼠标右键事件 onShiftRightClickPitch,`, event, index)
      this.commonRightClickPitch(event, index)
    },
    commonRightClickPitch(event, index) {
      console.log('commonRightClickPitch', event, index)
      this.$store.dispatch('const/changeState', { showMenuList: true })
      this.stagePitches[index].selected = true
      this.doSelectUUID(this.stagePitches[index].uuid)
      this.$nextTick(() => {
        this.$refs.BeatMenuList.setPosition(event.layerX, event.layerY + this.noteHeight)
      })
    },
    onPitchMouseDown(event, index){
      // 绿色块鼠标按下事件
      console.log('onPitchMouseDown', event, index)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }

      this.$store.dispatch('const/changeState', { showMenuList: false, showStageList: false })
      const target = event.target
      target.style.opacity = 0.8
      this.doSelectUUID(this.stagePitches[index].uuid)
      // 起个蒙层防止鼠标移出
      if (event.button !== 2 && !event.shiftKey) { // 只有不是鼠标右键并且没按住shift键的时候，才出现这个蒙层
        this.mouseModalTarget = document.createElement('div')
        const mouseModalTarget = this.mouseModalTarget
        mouseModalTarget.style.zIndex = 99999
        mouseModalTarget.style.position = `absolute`
        mouseModalTarget.style.width = '200px'
        mouseModalTarget.style.height = '200px'
        mouseModalTarget.style.left = `${target.dataset.left - 100}px`
        mouseModalTarget.style.top = `${target.dataset.top - 100}px`
        mouseModalTarget.style.opacity = 0 // 蒙层的透明度
        mouseModalTarget.style.cursor = 'move'
        mouseModalTarget.style.background = 'red'
        mouseModalTarget.addEventListener('mouseup', this.onPitchMouseUp)
        this.$refs.stage.appendChild(mouseModalTarget)
      }

      // 都有的dom元素
      const allElements = [...this.$el.querySelectorAll('[data-ref="pitch"]')]
      const selectedElements = []
      const selectedPitches = []
      // 当前是否选中
      const selected = this.stagePitches[index].selected
      if (selected) {
        this.stagePitches.forEach((v, idx) => {
          if (v.selected) {
            selectedElements.push(allElements[idx])
            selectedPitches.push(v)
          }
        })
      } else { // 当前点击的项没有选中，则只操作当前点的项
        this.$store.dispatch('change/resetStagePitchesSelect')
        selectedElements.push(target)
        selectedPitches.push(this.stagePitches[index])
      }
      this.stagePitches[index].selected = true
      // 把选中的元素的透明弄成0.8
      selectedElements.forEach(v => v.style.opacity = 0.8)

      this.movePitchStart = {
        left: Number(target.dataset.left),
        top: Number(target.dataset.top),
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        index,
        selectedPitches,
        selectedElements
      }

      document.addEventListener('mousemove', this.onPitchMouseMove)
      document.addEventListener('mouseleave', this.onPitchMouseUp)
      // console.log(`this.movePitchStart:`, this.movePitchStart)
    },
    onPitchMouseMove(event){
      // 绿色块鼠标移动事件
      // console.log('onPitchMouseMove:', event)
      if (this.movePitchStart) {
        if (this.mouseModalTarget) {
          this.mouseModalTarget.style.left = `${event.target.dataset.left - 100}px`
          this.mouseModalTarget.style.top = `${event.target.dataset.top - 100}px`
        }
        const { target, selectedPitches, selectedElements } = this.movePitchStart

        const moveX = event.clientX - this.movePitchStart.clientX
        const moveY = event.clientY - this.movePitchStart.clientY

        // 只有每一个块的位置都在可拖动范围内才能拖动
        const canMove = selectedPitches.every(it => {
          return (it.left + moveX) >= 0 && (it.top + moveY) >= 0
        })
        if (canMove) {
          for (let i = 0; i < selectedPitches.length; i ++) {
            const pitch = selectedPitches[i]
            const eleDom = selectedElements[i]
            const newLeft = pitch.left + moveX
            const newTop = pitch.top + moveY

            eleDom.style.transform = `translate(${newLeft}px, ${newTop}px)`
            eleDom.dataset.left = newLeft
            eleDom.dataset.top = newTop
          }

        }
      }
    },
    onPitchMouseUp(event) {
      if (this.movePitchStart) {
        // console.log(`onPitchMouseUp`, event)
        if (this.mouseModalTarget) {
          this.$refs.stage.removeChild(this.mouseModalTarget)
          this.mouseModalTarget = null
        }
        document.removeEventListener('mousemove', this.onPitchMouseMove)
        document.removeEventListener('mouseleave', this.onPitchMouseUp)
        const { target, index, selectedPitches, selectedElements } = this.movePitchStart
        let pitchHasChanged = false
        const moveList = []
        for (let i = 0; i < selectedPitches.length; i ++) {
          const pitch = selectedPitches[i]
          const beforePitch = Object.assign({}, selectedPitches[i])
          const eleDom = selectedElements[i]
          // 移动结束时的位置
          const left = parseInt(eleDom.dataset.left, 10)
          const top = parseInt(eleDom.dataset.top, 10)
          // 修正位置，自动吸附
          const newLeft = amendLeft(left, this.noteWidth)
          const newTop = amendTop(top, this.noteHeight)
          // left和top有变动
          if (pitch.left !== newLeft || pitch.top !== newTop) {
            pitchHasChanged = true
          }
          if (pitch.breath) {
            pitch.breath.left = newLeft - pitch.breath.width
          }

          eleDom.style.transform = `translate(${newLeft}px, ${newTop}px)`
          eleDom.dataset.left = newLeft
          eleDom.dataset.top = newTop
          // 移动结束，透明度去掉
          eleDom.style.opacity = 1
          pitch.left = newLeft
          pitch.top = newTop

          moveList.push({
            before: beforePitch,
            after: pitch
          })
          // 当他是连字符的时候，他前面不能有空格
          if (!this.canMoveUpPitch(pitch)) {
            Message.error('连音符格式错误，请确保连音符“-”前面有连续音符')
            pitch.left = this.movePitchStart.left
            pitch.top = this.movePitchStart.top
            eleDom.style.transform = `translate(${this.movePitchStart.left}px, ${this.movePitchStart.top}px)`
            eleDom.dataset.left = this.movePitchStart.left
            eleDom.dataset.top = this.movePitchStart.top
            pitchHasChanged = false
            return
          }
        }

        // const editor = Editor.getInstance()
        // editor.execute(new MovePitchCommand(editor, moveList))

        turnChangeLineMap(this.$store.state, moveList, true)

        this.movePitchStart = null
        if (pitchHasChanged) { // 这里防止点击后就直接去获取f0数据
          this.$store.dispatch('change/afterChangePitchAndHandle')
        }
      }
    },
    canMoveUpPitch(pitch) {
      let canMoveUp = true
      if (pitch.pinyin === '-') {
        let idx = 0
        this.stagePitches.forEach((item, i) => {
          if (item.uuid == pitch.uuid) {
            idx = i
          }
        })
        const before = this.stagePitches[idx - 1]
        const current = this.stagePitches[idx]
        if (before.left + before.width !== current.left) {
          canMoveUp = false
        }
      }
      return canMoveUp
    },
    onMouseDown(event) {
      // 画音块，鼠标按住事件
      console.log('onMouseDown:', event)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.$store.dispatch('const/changeState', { showMenuList: false, showStageList: false })
      this.$store.dispatch('change/resetStagePitchesSelect')
      this.doSelectUUID(null)
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
        // console.log('onMouseMove', event)
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
      // console.log('onMouseUp', event)
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

        // const editor = Editor.getInstance()
        // const pitch = {
        //   width,
        //   height: this.noteHeight,
        //   left,
        //   top
        // }
        // editor.execute(new AddPitchCommand(editor, pitch))

        this.toCheckOverStage(this.endPos.x)
      }
    },

    addOnePitch({ width, height, left, top }) {
      this.$store.dispatch('change/resetStagePitchesSelect')
      this.doSelectUUID(null)
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
        pitchChanged: true,
        uuid: generateUUID()
      });
      this.doSelectUUID(this.stagePitches[this.stagePitches.length - 1].uuid)
      console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: 啦, pinyin: la, red: false, pinyinList: ['la'], select: 0, fu: 'l', yuan: 'a', selected: true, pitchChanged: true`)
      this.$store.dispatch('change/afterChangePitchAndHandle')
    },
    onArrowMoveEnd({ width, left, top, target, direction, moveArrowStart }, index) {
      let pitchHasChanged = false
      const pitch = this.stagePitches[index]
      // console.log(`onArrowMoveEnd: width: ${width}, left: ${left}, top: ${top}, target: ${target}, direction: ${direction}`)

      if (pitch.left !== left || pitch.top !== top || pitch.width !== width) {
        pitchHasChanged = true // 有变化的话，需要去拉取f0数据
      }

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
      pitch.pitchChanged = true // 有改变的话，需要去拉取元辅音
      if (pitch.breath) {
        pitch.breath.left = pitch.left - pitch.breath.width
      }
      console.log(`onArrowMoveEnd: pitch.left: ${pitch.left}, pitch.width: ${pitch.width}, pitch.top: ${pitch.top}, direction: ${direction}`)
      if (!this.canMoveUpPitch(pitch)) {
        Message.error('连音符格式错误，请确保连音符“-”前面有连续音符')
        pitch.left = moveArrowStart.left
        pitch.top = moveArrowStart.top
        pitch.width = moveArrowStart.width
        target.style.transform = `translate(${moveArrowStart.left}px, ${moveArrowStart.top}px)`
        target.style.width = `${moveArrowStart.width}px`
        pitchHasChanged = false
      }
      if (pitchHasChanged) { // 这里防止点击后就直接去获取f0数据
        this.$store.dispatch('change/afterChangePitchAndHandle')
      }
    },
    editLyric(type) {
      this.$refs.BeatLyric.showLyric(type)
    },
    beatLyricSaveAllPinyin() {
      this.$refs.BeatLyric.save()
    },
    showLyric(selectStagePitches) {
      this.$refs.LyricCorrect.showLyric(selectStagePitches)
    },
    toCheckOverStage(x) { // 向右移动如果超过舞台宽度，舞台继续加
      while ((x + 500) >= this.stageWidth) {
        this.$store.dispatch('const/updateMatter', 15)
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
  height: 100%;
  left: 50px;
  user-select: none;
  overflow-x: scroll;
  overflow-x: overlay;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent
  }
  &::-webkit-scrollbar-thumb {
    // background: rgba(0, 0, 0, 0.5);
    background: #b4b4b4;
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

</style>

<style lang='less' scoped>
/deep/ .common-scrollbar {
  &-bar {
    position: fixed;
    z-index: 9999;
    left: 50px;
    height: 14px;
    border-radius: 20px;

    &.is-vertical {
      display: none;
    }
  }
  &-thumb {
    background: #b4b4b4;
  }
}
</style>
