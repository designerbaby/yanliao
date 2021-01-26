<template>
  <div :class="[$style.BeatSetting, showDrawer ? $style.isActive : '']"
    :style="{ height: `${stageHeight + 25}px`}">
    <div :class="$style.top">
      <div :class="$style.title">设置面板</div>
      <img src="@/assets/audioEditor/close.png" @click.stop="closeDrawer">
    </div>
    <div :class="$style.text">当前音源</div>
    <div :class="$style.setting">
      <div :class="$style.select">
        <Select
          filterable
          :class="$style.selector" 
          :placeholder="'选择谁来演唱这首歌'"
          v-model="toneId"
          @change="singleToneIdChange"
          >
          <Option
            v-for="item in toneList"
            :key="item.tone_id"
            :label="item.display_name"
            :value="item.tone_id"
          >
          </Option>
        </Select>
      </div>
      <div :class="$style.listen">
        <img src="@/assets/audioEditor/audition.png" @click="playerButtonClick">
        试听
      </div>
    </div>
    <div :class="$style.text">当前曲速</div>
    <div :class="$style.select">
      <InputNumber :class="$style.bpmInput" v-model="bpm" @input="bpmInputChange" controls-position="right" :min="50" :max="200"/>
    </div>
    <div :class="$style.bpmText">请控制输入范围在50-200BPM</div>
  </div>
</template>

<script>
import { Select, Option, InputNumber } from "element-ui"
import { songOtherDetail } from '@/api/api'
import { PlayAudio } from '@/common/utils/player'

export default {
  name: 'BeatSetting',
  data() {
    return {
      showDrawer: false,
      audio: null,
      toneList: [],
      toneId: this.$store.state.toneId,
      bpm: this.$store.state.bpm
    }
  },
  components: {
    Select,
    Option,
    InputNumber
  },
  computed: {
    stageHeight() {
      return this.$store.getters.stageHeight
    }
  },
  mounted() {
    this.getSongOtherDetail()
  },
  methods: {
    handleDrawer() {
      if (this.showDrawer) {
        this.showDrawer = false
      } else {
        this.showDrawer = true
      }
    },
    closeDrawer() {
      this.showDrawer = false
    },
    async getSongOtherDetail() {
      const { data } = await songOtherDetail()
      this.toneList = data.data.tone_list
    },
    singleToneIdChange(value) {
      console.log('singleToneIdChange:', value)
      this.toneId = value
      this.toneList.forEach(item => {
        if (this.toneId === item.tone_id) {
          this.$store.dispatch('changeStoreState', { toneId: item.tone_id, toneName: item.name })
        }
      })
      this.$emit('buildPitchLine')
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true })
    },
    bpmInputChange(value) {
      this.bpm = value
      this.$store.dispatch('changeStoreState', { bpm: this.bpm })
      this.$emit('buildPitchLine')
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true })
    },
    playerButtonClick() {
      let url = ''
      this.toneList.forEach(item => {
        if (this.toneId === item.tone_id) {
          url = item.audit_url
        }
      })
      this.audio = PlayAudio({
        url,
        onPlay: (audio) => {
          console.log('playing')
        },
        onPause: (dom) => {
          console.log('pause')
        },
        onEnd: () => {
          console.log('end')
        }
      })
      this.audio.play()
    }
  }
}
</script>

<style lang="less" module>
.BeatSetting{
  color: #fff;
  width: 316px;
  top: 78px;
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  position: absolute;
  right: -316px;
  transition: right 0.2s linear;
  z-index: 2000;
  &.isActive {
    right: 0;
  }
}

.top {
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  img {
    width: 24px;
    height: 24px;
    margin: 0 24px 0 0;
    cursor: pointer;
  }
}

.title {
  font-size: 16px;
  margin: 0 0 0 24px;
}

.text {
  font-size: 14px;
  color: rgba(255,255,255,0.80);
  margin: 8px 0 10px 24px;
}

.setting {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; 
}

.select {
  margin: 0 0 0 24px;
}

.listen {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  margin: 0 50px 0 20px;
  img {
    width: 26px;
    height: 26px;
    margin: 2px 0;
    cursor: pointer;
  }
}

.bpmText {
  font-size: 12px;
  color: rgba(255,255,255,0.60);
  margin: 5px 0 0 24px;
}
</style>
