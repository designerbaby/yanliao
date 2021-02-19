<template>
  <div
    :class="[$style.container]"
    :style="{
      transform: `translateX(${lineLeft}px)`,
      height: `${stageHeight}px`
    }"
    @mousedown.stop="onLineMouseDown"
    @mouseup.stop="onLineMouseUp"
  >
    <div :class="[$style.line, { [$style.fixed]: $store.state.isExceedHeader }]">
      <span :class="[$style.innerSpan]" :style="{ top: `${arrowTop}px`}"></span>
      <div :class="$style.inner"></div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { playState } from '@/common/utils/const'

export default {
  name: "BeatLine",
  data() {
    return {
      isLineMouseDown: false,
      left: 0,
      startLeft: 0,
      startX: 0,
      eventListener: null
    }
  },
  computed: {
    stageHeight() {
      return this.$store.getters.stageHeight;
    },
    lineLeft() {
      return this.$store.state.lineLeft;
    },
    playState() {
      return this.$store.state.playState
    },
    arrowTop() {
      if (this.$store.state.isExceedHeader) {
        // 48为头部的高度, 2为修正高度
        return this.$store.state.appScrollTop - 48 - 2
      }
      return 0
    }
  },
  methods: {
    onLineMouseDown(event) {
      console.log(`onLineMouseDown`);
      if (this.$store.state.isSynthetizing) {
        Message.error("正在合成音频中,不能修改哦~")
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.isLineMouseDown = true;
      this.startLeft = this.lineLeft;
      this.startX = event.clientX;
      // console.log(`down event.clientX`, event.clientX)

      document.addEventListener("mousemove", this.onLineMouseMove);
      document.addEventListener("mouseleave", this.onLineMouseUp);
    },
    onLineMouseMove(event) {
      if (this.isLineMouseDown) {
        const movePx = event.clientX - this.startX;
        const left = this.startLeft + movePx;
        // console.log(`move event.clientX`, this.startX, event.clientX, movePx, left)
        // if (left < 0) { // 小于0 不向左移动
        //   return
        // }
        this.left = left;
        // console.log(`this.left: ${this.left}`)

        this.$store.dispatch("changeStoreState", { lineLeft: left })
      }
    },
    onLineMouseUp(event) {
      console.log(`onLineMouseUp`);
      document.removeEventListener("mousemove", this.onLineMouseMove);
      document.removeEventListener("mouseleave", this.onLineMouseUp);
      if (this.isLineMouseDown) {
        this.isLineMouseDown = false;

        const movePx = event.clientX - this.startX;
        const left = this.startLeft + movePx;

        // 移动好线之后先存起来
        this.$store.dispatch("changeStoreState", { lineLeft: left })
      }
    }
  }
};
</script>

<style lang="less" module>
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1000; // 播放线的层级
  width: 2px;

  &:active {
    opacity: 0.5;
  }

  &.isActive {
    transition: left 0.3s linear;
  }
}
.line {
  width: 16px;
  position: absolute;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.innerSpan {
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-top: 8px solid #b8b8b8;
  border-bottom: 8px solid transparent;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.fixed {
  z-index: 2;
}

.inner {
  width: 3px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 1;
  background: #b8b8b8;
}
</style>
