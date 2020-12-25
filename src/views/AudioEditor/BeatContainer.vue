<template>
  <div class="audioEditor__con">
    <div class="audioEditor__beat" @click="toShowBeat">{{ beatForm.fenzi }}/{{ beatForm.fenmu }}</div>
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
        <div class="audioEditor__column--fenzi" v-for="m in beatForm.fenzi" :key="m">
          <div
            class="audioEditor__column--fenmu"
            v-for="j in 32 / beatForm.fenmu"
            :key="j"
            @dblclick="toCreateRecTangle"
            :style="{ width: `${noteWidth}px` }"
          ></div>
        </div>
      </div>
    </div>
    <div class="audioEditor__line" :style="{ left: linex }">
      <span></span>
    </div>
    <div
      ref="stage"
      class="audioEditor__stage"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <template v-for="(it, index) in stagePitches">
      <div
        class="audioEditor__stage__pitch"
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
        @click="toSelectPitch(index)"
      ></div>
      </template>
      <div class="audioEditor__stage__sharp" ref="sharp"></div>
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const";
export default {
  name: "BeatContainer",
  props: ["beatForm"],
  data() {
    return {
      pitchList: pitchList,
      matter: 3, // 默认先给10个小节
      linex: `55px`,
      isMouseDown: false,
      startPos: null,
      endPos: null,
      isMouseMove: false,
      stageOffset: null,
      stagePitches: [],
      movePitchStart: null,
      noteWidth: 20, // 32分音符占据的最小像素单位
      selectedPitch: -1
    }
  },
  
  mounted() {
    
    this.updateStageOffset()
    window.addEventListener('resize', () => {
      this.updateStageOffset()
    })
    document.querySelector('#app').addEventListener('scroll', () => {
      this.updateStageOffset()
    })
  },
  methods: {
    updateStageOffset() {
      // 初始化舞台的位置
      this.stageOffset = this.getOffset(this.$refs.stage);

      // console.log(`updateStageOffset`, this.stageOffset)
    },
    toShowBeat() {
      this.$emit("showBeat");
    },
    toCreateRecTangle(event) {
      console.log("toCreateRecTangle:", event);
    },
    onPitchMouseDown(event){
      // 绿色块鼠标按下事件
      const target = event.target
      target.style.opacity = 0.8
      this.movePitchStart = {
        left: Number(target.dataset.left),
        top: Number(target.dataset.top),
        clientX: event.clientX,
        clientY: event.clientY
      }
      console.log(`this.movePitchStart:`, this.movePitchStart)
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

        console.log(`onPitchMouseMove:`)
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
      console.log("onMouseDown", event);
      this.isMouseDown = true; // 要保证鼠标按下了，才能确保鼠标移动
      this.startPos = {
        x: event.clientX - this.stageOffset.left,
        y: event.clientY - this.stageOffset.top
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
        const pos = {
          x: event.clientX - this.stageOffset.left,
          y: event.clientY - this.stageOffset.top
        };

        const width = pos.x - this.startPos.x;
        const height = pos.y - this.startPos.y;

        console.log(`size:`, width, height);

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
        this.endPos = {
          x: event.clientX - this.stageOffset.left,
          y: event.clientY - this.stageOffset.top
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
        const width = Math.ceil(initWidth/ this.noteWidth) * this.noteWidth

        this.addOnePitch({
          width,
          height: 25,
          left,
          top
        });
      }
    },

    addOnePitch({ width, height, left, top }) {
      console.log(`addOnePitch: width:${width}, height: ${height}, left: ${left}, top: ${top}`)
      this.stagePitches.push({
        width,
        height,
        left,
        top
      });
    },

    toSelectPitch (index) {
      console.log('toSelectPitch:', index)
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
.audioEditor__line {
  position: absolute;
  top: 0;
  left: 60px;
  span {
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-top: 8px solid #b8b8b8;
    border-bottom: 8px solid transparent;
    position: absolute;
    left: -7px;
  }
  width: 3px;
  height: 2100px;
  background: #b8b8b8;
}
</style>
