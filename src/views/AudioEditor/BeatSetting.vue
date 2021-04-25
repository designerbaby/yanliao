<template>
  <div :class="[$style.BeatSetting, showDrawer ? $style.isActive : '', isExceedHeader ? $style.isFloat : '']"
    :style="{ height: `${stageHeight + 25}px`}">
    <div :class="$style.top">
      <div :class="$style.title">设置面板</div>
      <img src="@/assets/audioEditor/close.png" @click.stop="closeDrawer">
    </div>
    <div :class="$style.text">歌曲名称</div>
    <div :class="$style.select">
      <Input v-model="$store.state.musicName" placeholder="请输入歌曲名称"/>
    </div>
    <div :class="[$style.text, $style.qusu]">当前音源</div>
    <div :class="$style.setting">
      <div :class="$style.select">
        <Select
          filterable
          :class="$style.selector"
          :placeholder="'选择谁来演唱这首歌'"
          v-model="$store.state.toneId"
          @change="singleToneIdChange"
          >
          <Option
            v-for="item in toneList"
            :key="item.tone_id"
            :label="item.display_name"
            :value="item.tone_id"
          >
            <span style="float: left">{{ item.display_name }}</span>
            <span style="float: right; color:#8492a6; font-size: 13px;">by {{ item.nickname }}</span>
          </Option>
        </Select>
      </div>
      <div :class="$style.listen">
        <img src="@/assets/audioEditor/audition.png" @click="playerButtonClick">
        试听
      </div>
    </div>
    <div :class="[$style.text, $style.qusu]">当前曲速</div>
    <div :class="$style.setting">
      <InputNumber :class="$style.bpmInput"
        :value="$store.state.bpm"
        @change="bpmChangeChange"
        controls-position="right"
        :min="50" :max="200"
      />
      <div :class="$style.confirm">
        <Button type="success" @click="confirmBpm">确定</Button>
      </div>
    </div>
    <div :class="$style.bpmText">请控制输入范围在50-200BPM</div>
  </div>
</template>
<script>
import { Select, Option, InputNumber, Input, Button } from "element-ui"
import { songOtherDetail } from '@/api/api'
import { PlayAudio } from '@/common/utils/player'
import { timeToPx } from '@/common/utils/helper'

export default {
  name: 'BeatSetting',
  data() {
    return {
      showDrawer: false,
      audio: null,
      toneList: [],
      name: '',
      inputBpmValue: 0
    }
  },
  components: {
    Select,
    Option,
    InputNumber,
    Input,
    Button
  },
  computed: {
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    isExceedHeader() {
      return this.$store.state.isExceedHeader
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
      this.toneList.forEach(item => {
        if (value === item.tone_id) {
          this.$store.dispatch('changeStoreState', { toneId: item.tone_id, toneName: item.name, auditUrl: item.audit_url })
        }
      })
      this.$store.dispatch('getPitchLine')
    },
    bpmChangeChange(value) {
      console.log('bpmChangeChange:', value)
      this.inputBpmValue = value
    },
    confirmBpm() {
      if (this.inputBpmValue === 0) {
        this.inputBpmValue = this.$store.state.bpm
      }
      console.log('confirmBpm:', this.inputBpmValue)
      // 有伴奏的话，要相应修改伴奏的长度
      if (this.$store.state.wavesurfer) {
        const duration = this.$store.state.wavesurfer.getDuration()
        const waveWidth = timeToPx(duration * 1000, this.$store.state.noteWidth / 10, this.inputBpmValue)

        this.$store.dispatch('changeStoreState', { waveWidth })
      }

      // 为了修复，bpm改变的时候，曲线闪一下的bug,这里特殊处理。
      const oldBpm = this.$store.state.bpm
      this.$store.dispatch('changeStoreState', { bpm: this.inputBpmValue, pitchChanged: true })
      this.$store.dispatch('getPitchLine', {
        beforeRequest: () => {
          // 请求函数之前把bpm改回旧的，这样曲线就不会变动
          this.$store.state.bpm = oldBpm
          if (this.$store.state.wavesurfer) {
            this.$store.dispatch('changeStoreState', { waveWidth: 0 })
            this.$store.state.wavesurfer.destroy()
          }
        },
        afterRequest: () => {
          // 数据请求回来之后，把bpm改成真正修改后的值，这样f0和bpm都是新的，曲线重新绘制
          this.$store.state.bpm = this.inputBpmValue
          // 修改伴奏
          this.$store.dispatch('showWaveSurfer', { file: this.$store.state.trackList[1].file, type: 'url' })
        }
      })
    },
    playerButtonClick() {
      this.toneList.forEach(item => {
        if (this.$store.state.toneId === item.tone_id) {
          this.$store.dispatch('changeStoreState', { auditUrl: item.audit_url })
        }
      })
      const url = this.$store.state.auditUrl
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
  box-shadow: -4px 4px 4px 0 rgba(0,0,0,0.30);
  position: absolute;
  right: -316px;
  transition: right 0.2s linear;
  z-index: 2000; // 编辑拍号的层级
  &.isActive {
    right: 0;
  }
  &.isFloat {
    position: fixed;
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
  margin: 8px 0 8px 24px;
  &.qusu {
    margin: 24px 0 8px 24px;
  }
}

.setting {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select {
  margin: 0 0 0 24px;
  width: 196px;
}

.listen {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  margin: 0 50px 0 20px;
  line-height: 14px;
  img {
    width: 26px;
    height: 26px;
    // margin: 2px 0;
    cursor: pointer;
  }
}

.bpmText {
  font-size: 12px;
  color: rgba(255,255,255,0.60);
  margin: 5px 0 0 24px;
}

.confirm {
  margin: 0px 0 0 20px;
  // .el-button--success {
  //   background-color: #009032 !important;
  //   border-color: #009032 !important;
  // }
}
</style>
