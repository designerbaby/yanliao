<template>
  <div ref="container" class="audioEditor__con">
    <div class="audioEditor__beat" @click="toShowBeat">{{ fenzi }}/{{ fenmu }}</div>
    <div class="audioEditor__left">
      <template v-for="it in pitchList">
        <div class="audioEditor__left--white" v-if="it.type === 0" :key="it.pitch">{{ it.pitch }}</div>
      </template>
    </div>
    <div class="audioEditor__middle">
      <template v-for="it in pitchList">
        <div class="audioEditor__middle--white" v-if="it.type === 0" :key="it.pitch">{{ it.pitch }}</div>
        <div class="audioEditor__middle--black" v-else :key="it.pitch">{{ it.pitch }}</div>
      </template>
    </div>
    <div class="audioEditor__right">
      <template v-for="it in pitchList">
        <div class="audioEditor__right--gray" :key="it.pitch" v-if="it.type === 0"></div>
        <div class="audioEditor__right--black" :key="it.pitch" v-else></div>
      </template>
    </div>
    <div class="audioEditor__column">
      <div class="audioEditor__column--matter" v-for="n in matter" :key="n">
        <div class="audioEditor__column--num">{{ n }}</div>
        <div class="audioEditor__column--fenzi" v-for="m in fenzi" :key="m">
          <div
            class="audioEditor__column--fenmu"
            v-for="j in 32 / fenmu"
            :key="j"
            :style="{ width: `${noteWidth}px` }"
          ></div>
        </div>
      </div>
    </div>
    <BeatLine ref="BeatLine" :rect="rect" @saveLeft="toSaveLeft"></BeatLine>
    <div
      ref="stage"
      class="audioEditor__stage"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      id="audioStage"
    >
      <template v-for="(it, index) in stagePitches">
        <div
          :class="['audioEditor__stage__pitch', selectedPitch === index ? 'is-active' : '']"
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
            :class="['audioEditor__stage__left', showArrow === `1${index}` ? 'is-active' : '']"
            @mouseenter.stop="onArrowEnter(`1${index}`)"
            @mouseleave.stop="onArrowLeave"
            @mousemove.stop="onArrowMouseMove($event, index)"/>
          <img src="@/assets/right.png"
            :class="['audioEditor__stage__right', showArrow === `2${index}` ? 'is-active' : '']"
            @mouseenter.stop="onArrowEnter(`2${index}`)"
            @mouseleave.stop="onArrowLeave"
            @mousemove.stop="onArrowMouseMove($event, index)"/>
          <div class="audioEditor__stage__list" 
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
      <div class="audioEditor__stage__sharp" ref="sharp"></div>
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const"
import { Card, Button } from "element-ui"
import BeatLine from './BeatLine.vue'

export default {
  name: "BeatContainer",
  props: ["beatForm"],
  components: {
    Card,
    Button,
    BeatLine
  },
  data() {
    return {
      pitchList: pitchList,
      matter: 3, // 默认先给3个小节
      isMouseDown: false,
      startPos: null,
      endPos: null,
      stageOffset: null,
      stagePitches: [],
      movePitchStart: null,
      noteWidth: 20, // 32分音符占据的最小像素单位
      selectedPitch: -1,
      showArrow: -1,
      maxLeft: 0,
      showList: -1,
      rect: null,
      fenzi: parseInt(this.beatForm.fenzi, 10),
      fenmu: parseInt(this.beatForm.fenmu, 10)
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
      this.rect = this.$refs.container.getBoundingClientRect()
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

        // 要使用css3 的transform来优化性能
        // event.target.style.left = `${newLeft}px`
        // event.target.style.top = `${newTop}px`

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
      console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}, hanzi: ${hanzi}`)
      this.stagePitches.push({
        width,
        height,
        left,
        top,
        hanzi
      });
      this.$emit('getPitches', this.stagePitches, this.noteWidth)
      this.toGetMaxLeft(width, left)
    },

    toGetMaxLeft(width, left) { // 获取距离左边最大的值
      let maxLeft = this.maxLeft
      const newLeft = width + left
      if (newLeft > this.maxLeft) { // 如果最新的那个块比最大的块的左边大
        this.maxLeft = newLeft
      }
    },

    toSelectPitch(index) {
      this.selectedPitch = index
    },
     
    onArrowEnter(num) {
      this.showArrow = num
    },
    onArrowLeave() {
      this.showArrow = -1
    },
    onArrowMouseMove(event, index) {
      // log(`onArrowMouseMove, event: ${event}, index: ${index}`)
    },
    toMoveLinePos() {
      this.$refs.BeatLine.toMove(this.maxLeft)
    },
    toRestartLinePos() {
      this.$refs.BeatLine.toRestart()
    },
    toPitchRight(index) {
      this.showList = index
    },
    toDeletePitch(index) {
      this.stagePitches.splice(index, 1)
      this.showList = -1 // 删除掉之后顺便把选择的还原
    },
    toSaveLeft(endLeft) {
      const stagePitches = this.stagePitches
      const excessPitches = []
      stagePitches.forEach(item => {
        if (item.left > endLeft || (item.left + item.width) > endLeft) {
          excessPitches.push(item)
        }
      })
      log('excessPitches:', excessPitches)
      // this.$emit('getPitches', excessPitches, this.noteWidth)
    }
  }
};
</script>

<style lang="less">
.audioEditor__con {
  border-top: 1px solid #282828;
  display: flex;
  width: 100%;
  margin: 20px 0px;
  position: relative;
}
.audioEditor__stage {
  position: absolute;
  width: calc(100% - 50px);
  height: 100%;
  left: 50px;
  user-select: none;
  top: 0;
}
.audioEditor__stage__pitch {
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
}
.audioEditor__stage__sharp {
  border: 1px solid #ccc;
  position: absolute;
  left: 300px;
  top: 200px;
  width: 1px;
  height: 1px;
  background-color: rgba(204, 204, 204, 0.514);
}
.audioEditor__stage__left {
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

.audioEditor__stage__right {
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

.audioEditor__stage__list {
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
.audioEditor__beat {
  position: absolute;
  color: #fff;
  font-size: 13px;
  top: -20px;
  left: 15px;
}
.audioEditor__left {
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 8px;
  width: 50px;
  position: relative;
  float: left;
  font-size: 0;
  &--white {
    width: 50px;
    height: 42.86px;
    background: #b4b4b4;
    border: 1px solid #8b8b8b;
    border-right: #353535;
    border-bottom: #5d5e5e;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    z-index: 0;
    &:hover {
      background: rgb(4, 219, 51);
    }
    &:active {
      background: rgb(20, 155, 49);
    }
  }
}
.audioEditor__middle {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0;
  &--white {
    height: 25px;
    background: #fff;
    visibility: hidden;
    pointer-events: none;
  }
  &--black {
    width: 25px;
    height: 25px;
    background: #1d1d1d;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    &:hover {
      background: rgb(4, 219, 51);
    }
    &:active {
      background: rgb(20, 155, 49);
    }
  }
}
.audioEditor__right {
  width: 1700px;
  overflow: scroll;
  &--gray {
    background: #2d2d2d;
    height: 25px;
  }
  &--black {
    height: 25px;
    background: #232323;
  }
}
.audioEditor__column {
  position: absolute;
  top: 0;
  left: 50px;
  // border: 1px solid red;
  background: transparent;
  display: flex;
  &--matter {
    background: transparent;
    display: flex;
    position: relative;
  }
  &--num {
    color: #fff;
    font-size: 13px;
    border-left: 1px solid #626263;
    position: absolute;
    top: -20px;
    background: transparent;
  }
  &--fenzi {
    border-left: 1px solid #252525;
    background: transparent;
    display: flex;
  }
  &--fenmu {
    border-left: 1px solid #292828;
    background: transparent;
    // width: 20px;
    width: 0px;
    height: 2100px;
  }
}

</style>
