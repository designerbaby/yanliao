<template>
  <div :class="$style.list"
    :style="{
      left: `${left}px`,
      top: `${top}px`
    }">
    <img src="@/assets/audioEditor/arrow-black.png">
    <div :class="[$style.button, $style.top, $style.bottom]" @click.stop="toPaste">粘贴</div>
  </div>
</template>

<script>
import { Message } from "element-ui"

export default {
  name: 'BeatRightList',
  props: {
    index: Number
  },
  data() {
    return {
      left: 0,
      top: 0
    }
  },
  computed: {
    stagePitches() {
      return this.$store.state.stagePitches
    }
  },
  methods: {
    setPosition(left, top) {
      this.left = left
      this.top = top
    },
    toPaste() {
      console.log('toPaste')
    }
  }
}
</script>

<style lang="less" module>
.list {
  width: 140px;
  background: #151517;
  box-shadow: -4px 4px 10px 0 rgba(0,0,0, 0.30);
  border-radius: 8px;
  position: absolute;
  color: #fff;
  font-size: 14px;
  text-align: center;
  z-index: 20; // 右键编辑菜单的层级
  img {
    width: 14px;
    height: 8px;
    position: absolute;
    left: 6px;
    top: -8px;
  }
}
.button {
  width: 116px;
  height: 44px;
  line-height: 44px;
  margin: 0 auto;
  &:hover {
    background: #1C1C1E;
    border-radius: 8px;
  }
  &:active {
    background: #0E0E0F;
    border-radius: 8px;
  }
}

.top {
  margin-top: 8px;
}

.line {
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.bottom {
  margin-bottom: 8px;
}

</style>
