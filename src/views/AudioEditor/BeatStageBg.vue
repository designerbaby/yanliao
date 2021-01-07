<template>
  <div :class="$style.container" :style="{ width: `${stageWidth}px` }">
    <div :class="$style.row">
      <template v-for="it in pitchList">
        <div :class="$style.gray" :key="it.pitch" v-if="it.type === 0"></div>
        <div :class="$style.black" :key="it.pitch" v-else></div>
      </template>
    </div>
    <div :class="$style.column">
      <div :class="$style.fenziCon" v-for="n in matter" :key="n">
        
        <div :class="$style.fenzi" v-for="m in beatForm.fenzi" :key="m">
          <div
            :class="$style.fenmu"
            v-for="j in 32 / beatForm.fenmu"
            :key="j"
            :style="{ width: `${noteWidth}px`, height: `${stageHeight}px` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pitchList } from "@/common/utils/const"

export default {
  name: 'BeatStageBg',
  components: {},
  data() {
    return {
      pitchList: pitchList
    }
  },
  computed: {
    beatForm() {
      return this.$store.state.beatForm
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    matter() {
      return this.$store.state.matter
    },
    noteWidth() {
      return this.$store.state.noteWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    }
  }
}
</script>

<style lang="less" module>
.container {
  position: relative;
  // top: 25px;
}
.row {
  position: relative;
}

.gray {
  background: #2d2d2d;
  height: 25px;
  border-bottom: 1px solid #1d1d1d;
}

.black {
  height: 25px;
  background: #232323;
}

.fenziCon {
  display: flex;
}
.column {
  position: absolute;
  top: 0px;
  left: 0px;

  background: transparent;
  display: flex;
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
    height: 100%;
    background: #1d1d1d;
  }
}
.fenmu {
  border-left: 1px solid #272727;
  background: transparent;
}

</style>
