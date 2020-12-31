<template>
  <div :class="$style.container" :style="{ width: `${stageWidth}px` }">
    <div :class="$style.row">
      <BeatLine></BeatLine>
      <template v-for="it in pitchList">
        <div :class="$style.gray" :key="it.pitch" v-if="it.type === 0" ></div>
        <div :class="$style.black" :key="it.pitch" v-else></div>
      </template>
    </div>
    <div :class="$style.column">
      <div :class="$style.matter" v-for="n in matter" :key="n">
        <div :class="$style.num">{{ n }}</div>
        <div :class="$style.fenzi" v-for="m in beatForm.fenzi" :key="m">
          <div
            :class="$style.fenmu"
            v-for="j in 32 / beatForm.fenmu"
            :key="j"
            :style="{ width: `${noteWidth}px` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeatLine from './BeatLine.vue'
import { pitchList } from "@/common/utils/const"

export default {
  name: 'BeatStageBg',
  components: {
    BeatLine
  },
  data() {
    return {
      pitchList: pitchList
    }
  },
  computed: {
    beatForm() {
      return this.$store.getters.beatForm
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    matter() {
      return this.$store.getters.matter
    },
    noteWidth() {
      return this.$store.getters.noteWidth
    }
  }
}
</script>

<style lang="less" module>
.container {
  position: relative;
  top: 25px;
}
.row {
  position: relative;
}

.gray {
  background: #2d2d2d;
  height: 25px;
}

.black {
  height: 25px;
  background: #232323;
}

.column {
  position: absolute;
  top: 0;
  left: 0px;
  // border: 1px solid red;
  background: transparent;
  display: flex;
}

.matter {
  background: transparent;
  display: flex;
  position: relative;
  // top: -20px;
}
.fenzi {
  background: transparent;
  display: flex;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 2100px;
    background: #252525;
  }
}
.fenmu {
  border-left: 1px solid #292828;
  background: transparent;
  height: 2100px;
}

.num {
  color: #fff;
  font-size: 13px;
  border-left: 1px solid #626263;
  background: transparent;
  text-align: left;
  position: absolute;
  top: -25px;
  padding-left: 5px;
  height: 25px;
  line-height: 25px;
}
</style>
