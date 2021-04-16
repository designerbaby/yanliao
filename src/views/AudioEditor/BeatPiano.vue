<template>
  <div :class="$style.container">
    <div :class="$style.left">
      <template v-for="it in pitchList">
        <div :class="$style.white" v-if="it.type === 0 && it.show === 1" :key="it.pitch" @click.stop="play(it)">{{ it.str }}</div>
        <div :class="$style.white" v-else-if="it.type === 0" :key="it.pitch" @click.stop="play(it)">{{ it.str }}</div>
      </template>
    </div>
    <div :class="$style.middle">
      <template v-for="it in pitchList">
        <div :class="$style.middleWhite" v-if="it.type === 0" :key="it.pitch"></div>
        <div :class="$style.middleBlack" v-else :key="it.pitch" @click.stop="play(it)"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const"
import { playPiano } from "@/common/utils/webAudio"

export default {
  name: 'BeatPiano',
  data() {
    return {
      pitchList: pitchList
    }
  },
  mounted() {},
  methods: {
    play(it) {
      playPiano(it.pitch)
    }
  }
}
</script>

<style lang="less" module>
.container {
  position: relative;
  z-index: 1001;
}

.left {
  display: flex;
  flex-direction: column;
  color: #727271;
  width: 50px;
  position: relative;
  float: left;
  font-size: 12px;
  text-align: right;
}
.white {
  width: 50px;
  height: 42.4px;
  background: #b4b4b4;
  border: 1px solid #8b8b8b;
  border-right: #353535;
  border-bottom: #5d5e5e;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  z-index: 0; // 钢琴键盘的层级
  line-height: 42px;
  &:hover {
    background: rgb(4, 219, 51);
  }
  &:active {
    background: rgb(20, 155, 49);
  }
  &:last-child {
    height: 35px;
  }
  &:first-child {
    height: 30px;
  }
}

.middle {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
}

.middleWhite {
  height: 25px;
  background: #fff;
  visibility: hidden;
  pointer-events: none;
}
.middleBlack {
  width: 25px;
  height: 25px;
  line-height: 25px;
  background: #1d1d1d;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  color: #fff;
  &:hover {
    background: rgb(4, 219, 51);
  }
  &:active {
    background: rgb(20, 155, 49);
  }
}
</style>
