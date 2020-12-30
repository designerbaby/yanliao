<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.beat" @click="toShowBeat">
      {{ beatForm.fenzi }}/{{ beatForm.fenmu }}
    </div>
    <BeatPiano></BeatPiano>
    <div
      ref="stage"
      :class="$style.stage"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      id="audioStage"
    >
      <BeatStageBg :noteWidth="noteWidth"></BeatStageBg>
      <template v-for="(it, index) in stagePitches">
        <div
          :class="[$style.pitch, selectedPitch === index ? 'is-active' : '', it.red ? 'is-red': '']"
          :style="{
            width: `${it.width}px`,
            height: `${it.height}px`,
            transform: `translate(${it.left}px, ${it.top}px)`
          }"
          :key="index"
          :data-left="it.left"
          :data-top="it.top"
          @mousedown.stop="onPitchMouseDown"
          @mousemove.stop="onPitchMouseMove"
          @mouseup.stop="onPitchMouseUp($event, index)"
          @mouseleave.stop="onPitchMouseUp($event, index)"
          @click.left="toSelectPitch(index)"
          @click.right="toPitchRight(index)"
          slot="reference"
        >
          {{ it.hanzi }}
          <img src="@/assets/right.png"
            :class="[$style.left, showArrow === `1${index}` ? 'is-active' : '']"
            @mouseenter.stop="onArrowEnter(`1${index}`)"
            @mouseleave.stop="onArrowLeave"
            @mouseup.stop="onArrowLeave"
            @mousemove.stop="onArrowMouseMove($event, 'left')"
            @mousedown.stop="onArrowMouseDown($event, 'left')"/>
          <img src="@/assets/right.png"
            :class="[$style.right, showArrow === `2${index}` ? 'is-active' : '']"
            @mouseenter.stop="onArrowEnter(`2${index}`)"
            @mouseleave.stop="onArrowLeave"
            @mouseup.stop="onArrowLeave"
            @mousemove.stop="onArrowMouseMove($event, 'right')"
            @mousedown.stop="onArrowMouseDown($event, 'right')"/>
          <div :class="$style.list" 
            v-if="showList === index"
          >
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
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const"
import { Card, Button } from "element-ui"
import BeatPiano from './BeatPiano.vue'
import BeatStageBg from './BeatStageBg.vue'

export default {
  name: "BeatContainer",
  components: {
    Card,
    Button,
    BeatPiano,
    BeatStageBg
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
      moveArrowStart: null,
      noteWidth: 20, // 32分音符占据的最小像素单位
      selectedPitch: -1,
      showArrow: -1,
      showList: -1,
      beforeItemPos: 0
    }
  },
  computed: {
    beatForm() {
      return this.$store.state.beatForm
    }
  },
  
  mounted() {
    this.updateStageOffset()
    // window.addEventListener('resize', () => {
    //   this.updateStageOffset()
    // })
    // document.querySelector('#app').addEventListener('scroll', () => {
    //   this.updateStageOffset()
    // })
    document.getElementById('audioStage').oncontextmenu = (e) => { 
      // 右键基础事件被阻止掉了
      return false
    }
  },
  methods: {
    updateStageOffset() {
      // 初始化舞台的位置
      // this.stageOffset = this.getOffset(this.$refs.stage);
      const rect = this.$refs.stage.getBoundingClientRect()
      this.stageOffset = {
        left: rect.left,
        top: rect.top
      }

    },
    toShowBeat() {
      this.$emit("showBeat");
    },
    onPitchMouseDown(event){
      // 绿色块鼠标按下事件
      const target = event.target
      target.style.opacity = 0.8
      // target.style.background = '#149b31'
      this.movePitchStart = {
        left: Number(target.dataset.left),
        top: Number(target.dataset.top),
        clientX: event.clientX,
        clientY: event.clientY
      }
      // console.log(`this.movePitchStart:`, this.movePitchStart)
    },
    onPitchMouseMove(event){
      // 绿色块鼠标移动事件
      if (this.movePitchStart) {
        
        const newLeft = this.movePitchStart.left + (event.clientX - this.movePitchStart.clientX)
        const newTop = this.movePitchStart.top + (event.clientY - this.movePitchStart.clientY)

        event.target.style.transform = `translate(${newLeft}px, ${newTop}px)`
        event.target.dataset.left = newLeft
        event.target.dataset.top = newTop

      }
    },
    onPitchMouseUp(event, index) {
      // 绿色块鼠标移走事件
      event.target.style.opacity = 1
      this.movePitchStart = null

      const left = parseInt(event.target.dataset.left, 10)
      const top = parseInt(event.target.dataset.top, 10)

      // 松开时修正位置
      const pitch = this.stagePitches[index]
      pitch.left = left
      pitch.top = top - (top % 25);
  
    },
    getOffset(ele) { // 获取距离父元素的位置
      let par = ele.offsetParent;
      let left = ele.offsetLeft;
      let top = ele.offsetTop;
      while (par) {
        left += par.offsetLeft;
        top += par.offsetTop;
        par = par.offsetParent;
      }
      return { left, top };
    },
    onMouseDown(event) {
      this.selectedPitch = -1
      this.showList = -1
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
      }
    },

    addOnePitch({ width, height, left, top, hanzi }) {
      let red = false
      // if (this.beforeItemPos >= left) {
      //   red = true
      // }
      if (width > 25) {
        console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: ${hanzi}`)
        this.stagePitches.push({
          width,
          height,
          left,
          top,
          hanzi,
          red: red
        });
        this.selectedPitch = this.stagePitches.length - 1
      }
      
      // this.beforeItemPos = width + left

      this.$emit('getPitches', this.stagePitches, this.noteWidth)
    },
    
    toSelectPitch(index) {
      this.selectedPitch = index
    },
    toPitchRight(index) {
      this.selectedPitch = index
      this.showList = index
    },
     
    onArrowEnter(num) {
      this.showArrow = num
    },
    onArrowMouseDown(event, type) { // 鼠标按下事件
      const target = event.target
      target.style.opacity = 0.8
      this.moveArrowStart = {
        width: target.parentNode.style.width,
        left: target.style.left,
        clientX: event.clientX
      }
      
      log('moveArrowStart:', JSON.stringify(this.moveArrowStart))
    },
    onArrowMouseMove(event, type) {
      if (this.moveArrowStart) {
        if (type === 'right') {
          const newWidth = this.moveArrowStart.width + (event.clientX - this.moveArrowStart.clientX)
          event.target.parentNode.style.width = newWidth
        } else {
          const pianyi = event.clientX - this.moveArrowStart.clientX
          const newWidth = this.moveArrowStart.width + pianyi
          const newLeft = this.moveArrowStart.left - pianyi
          event.target.parentNode.style.width = newWidth
          event.target.parentNode.style.left = newLeft
        }
      }
    },
    onArrowLeave() {
      this.showArrow = -1
      this.moveArrowStart = null
      const left = parseInt(this.moveArrowStart)
    },
    toDeletePitch(index) {
      this.stagePitches.splice(index, 1)
      this.showList = -1 // 删除掉之后顺便把选择的还原
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
  padding-top: 20px;
}
.stage {
  position: absolute;
  width: calc(100% - 50px);
  height: 100%;
  left: 50px;
  user-select: none;
  top: 20px;
  // padding-top: 20px;
  overflow-x: scroll;
}
.beat {
  position: absolute;
  color: #fff;
  font-size: 13px;
  top: 0px;
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
  // text-align: center;
  &.is-active {
    background: rgb(20, 155, 49)
  }
  &.is-red {
    border: 1px solid red;
  }
}

.left {
  position: absolute;
  height: 25px;
  width: 30px;
  right: -27px;
  top: 0;
  opacity: 0;
  &.is-active {
    opacity: 1;
  }
}

.right {
  transform: scale(-1);
  position: absolute;
  height: 25px;
  width: 30px;
  left: -27px;
  top: 0;
  opacity: 0;
  &.is-active {
    opacity: 1;
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
  border: 1px solid #ccc;
  position: absolute;
  left: 300px;
  top: 200px;
  width: 1px;
  height: 1px;
  background-color: rgba(204, 204, 204, 0.514);
}
</style>
