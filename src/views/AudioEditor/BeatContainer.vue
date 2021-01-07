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
            <div :class="$style.list" v-if="showList === index">
              <Card class="box-card">
                <div slot="header" class="clearfix">
                  <span>操作列表</span>
                </div>
                <Button type="danger" @click.stop="toDeletePitch(index)">删除</Button>
              </Card>
            </div>
          </div>
        </template>
        <div :class="$style.sharp" ref="sharp"></div>
        <!-- <PitchLine></PitchLine> -->
      </div>
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const"
import { Card, Button, Message } from "element-ui"
import BeatPiano from './BeatPiano.vue'
import BeatStageBg from './BeatStageBg.vue'
import Arrow from './Arrow.vue'
// import PitchLine from './PitchLine.vue'

export default {
  name: "BeatContainer",
  components: {
    Card,
    Button,
    Message,
    BeatPiano,
    BeatStageBg,
    Arrow
    // PitchLine
  },
  data() {
    return {
      pitchList: pitchList,
      isMouseDown: false,
      startPos: null,
      endPos: null,
      stageOffset: null,
      stagePitches: [],
      movePitchStart: null,
      selectedPitch: -1,
      showList: -1
    }
  },
  computed: {
    beatForm() {
      return this.$store.state.beatForm
    },
    noteWidth() {
      return this.$store.getters.noteWidth
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
    // document.getElementById('audioStage').addEventListener('keydown', event => {
    //   console.log('keydown:')
    //   if (event && event.preventDefault) {
    //     event.preventDefault()
    //   }
    //   if (event.ctrlKey && event.keyCode == 90 || event.metaKey && event.keyCode == 90) {
    //     this.toResetPitches()
    //   }
    // })
  },
  methods: {
    // TODO 这个撤销功能要重新规划下
    // toResetPitches() {
    //   console.log('toResetPitches')
    //   this.stagePitches.splice(this.stagePitches.length - 1, 1)
    //   this.checkPitchDuplicated()
    // },
    checkPitchDuplicated() {
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
      // console.log(`pitches：`, pitches)
      this.$emit('getPitches', pitches)
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
      this.$emit("showBeat");
    },
    onPitchMouseDown(event, index){
      // console.log(`onPitchMouseDown`, event, index, event.button)
      // 绿色块鼠标按下事件
      const target = event.target
      target.style.opacity = 0.8
      this.toSelectPitch(index)
      if (event.button === 2) { // 按下了鼠标右键
        this.toPitchRight(index)
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
        if (newLeft < 0) {
          newLeft = 0
        }
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
        
        pitch.left = Math.floor(left / this.noteWidth) * this.noteWidth
        pitch.top = top - (top % 25);

        target.style.transform = `translate(${pitch.left}px, ${pitch.top}px)`
        target.dataset.left = pitch.left
        target.dataset.top = pitch.top
        this.checkPitchDuplicated()
      }
    },
    // getOffset(ele) { // 获取距离父元素的位置
    //   let par = ele.offsetParent;
    //   let left = ele.offsetLeft;
    //   let top = ele.offsetTop;
    //   while (par) {
    //     left += par.offsetLeft;
    //     top += par.offsetTop;
    //     par = par.offsetParent;
    //   }
    //   return { left, top };
    // },
    onMouseDown(event) {
      // console.log(`onStageMouseDown`)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      this.selectedPitch = -1
      this.showList = -1
      this.isMouseDown = true; // 要保证鼠标按下了，才能确保鼠标移动

      const rect = this.$refs.stage.getBoundingClientRect()

      this.startPos = {
        x: event.clientX + this.stageOffset.scrollLeft - rect.left,
        y: event.clientY + this.stageOffset.scrollTop - rect.top
      };
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
        // this.toScrollStage(event.clientX, rect.left)
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
        this.$refs.sharp.style.display = "none";

        //
        //   |``````|
        //   |______|
        //

        // 一个矩形里面，上边和下边的位置，哪个小取哪个，也就是取上边的位置
        const topPx = Math.min(this.startPos.y, this.endPos.y);

        // 取25的倍数，因为每一行是25px
        const top = topPx - (topPx % 25);
        const initLeft = Math.min(this.startPos.x, this.endPos.x);
        // 根据32分音符的最小像素调整左边距
        const left = Math.floor(initLeft / this.noteWidth) * this.noteWidth
        
        const initWidth = Math.abs(this.startPos.x - this.endPos.x);
        // 根据32分音符的最小像素调整宽度
        const width = Math.max(Math.ceil(initWidth / this.noteWidth) * this.noteWidth, 20)
        const hanzi = '啦'

        this.addOnePitch({
          width,
          height: 25,
          left,
          top,
          hanzi
        });
        this.toCheckOverStage(this.endPos.x)
      }
    },

    addOnePitch({ width, height, left, top, hanzi }) {
      if (width > 25) {
        console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: ${hanzi}`)
        this.stagePitches.push({
          width,
          height,
          left,
          top,
          hanzi,
          red: false
        });
        this.selectedPitch = this.stagePitches.length - 1 // 生成新的数据块后那个高亮
      }
      this.checkPitchDuplicated()
    },

    onArrowMoveEnd({ width, left, top, target }, index) {
      const pitch = this.stagePitches[index]
      
      // 结束后修正宽度和左边距
      pitch.left = Math.floor(left / this.noteWidth) * this.noteWidth
      pitch.width = Math.floor(width / this.noteWidth) * this.noteWidth
      pitch.top = top
      target.style.transform = `translate(${pitch.left}px, ${pitch.top}px)`
      target.style.width = pitch.width

      this.checkPitchDuplicated()
    },
    
    toSelectPitch(index) {
      this.selectedPitch = index
    },
    toPitchRight(index) {
      this.selectedPitch = index
      this.showList = index
    },
    toDeletePitch(index) {
      this.stagePitches.splice(index, 1)
      this.showList = -1 // 删除掉之后顺便把选择的还原
      this.checkPitchDuplicated()
    },
    toCheckOverStage(x) { // 向右移动如果超过舞台宽度，舞台继续加
      // console.log('toCheckOverStage:x', x)
      // console.log('this.stageWidth:', this.stageWidth)
      if ((x + 5) >= this.stageWidth) {
        this.$store.dispatch('updateMatter', 15)
      }
    }
    // toScrollStage(clientX, left) { // 如果移动超过舞台最右边，那要帮他滚动下滚动条,滚动条触发另一个bug,滚动取鼠标事件的bug
    //   const stageConWidth = this.$store.stageSize.width
    //   const stanceLeft = clientX + left
    //   if (stanceLeft > stageConWidth) {
    //     const distance = stageConWidth - stanceLeft
    //     this.$refs.stage.scrollLeft -= distance
    //   }
    // }
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
  width: calc(100% - 50px);
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
  z-index: 10;
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
  z-index: 20;
  padding-left: 5px;
  &.isActive {
    background: rgb(20, 155, 49)
  }
  &.isRed {
    border: 1px solid red;
  }
}


.list {
  width: 100px;
  // height: 20px;
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 30px;
  border-radius: 2px;
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 10px;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    border-bottom: 5px solid rgba(255, 255, 255, 0.5);
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
