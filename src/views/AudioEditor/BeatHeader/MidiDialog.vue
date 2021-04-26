<template>
  <Dialog
    title="导入Midi"
    :visible.sync="midiVisible"
    custom-class="midi-dialog">
    <div>
      <div :class="$style.tips">选择要导入的音轨</div>
      <RadioGroup v-model="selectMid">
        <Radio v-for="(it, index) in midPitchList"
          :key="index"
          :label="index">
            音轨 {{ index + 1 }} ({{ it.pitchList.length }}个音符, {{ it.lowestPitchStr }}-{{ it.highestPitchStr }}, Piano)
        </Radio>
      </RadioGroup>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button @click="cancel">取 消</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Button, Message, Radio, RadioGroup } from 'element-ui'
import { pitchList } from '@/common/utils/const'
import { pitchList2StagePitches } from '@/common/utils/common'
import { getWaveSurfer } from '@/common/utils/waveSurfer'

export default {
  name: 'MidiDialog',
  components: {
    Dialog,
    Button,
    Message,
    Radio,
    RadioGroup
  },
  data() {
    return {
      midiVisible: false,
      midPitchList: [],
      selectMid: 0,
      fileName: ''
    }
  },
  methods: {
    handleMidPitchList(midPitchList) {
      for (let i = 0; i < midPitchList.length; i += 1) {
        const item = midPitchList[i]
        const pitchLists = item.pitchList
        let lowestPitch = pitchLists[0].pitch
        let highestPitch = pitchLists[0].pitch
        for (let j = 0; j < pitchLists.length; j += 1) {
          lowestPitch = Math.min(lowestPitch, pitchLists[j].pitch)
          highestPitch = Math.max(highestPitch, pitchLists[j].pitch)
        }
        if (lowestPitch < pitchList[pitchList.length - 1].pitch) {
          Message.error('最低音小于现在的音域')
          this.$emit('midi-cancel')
          return
        }
        if (highestPitch > pitchList[0].pitch) {
          Message.error('最高音大于现在的音域')
          this.$emit('midi-cancel')
          return
        }
        item.lowestPitchStr = pitchList.find(v => v.pitch === lowestPitch).str
        item.highestPitchStr = pitchList.find(v => v.pitch === highestPitch).str
      }
      this.midPitchList = midPitchList
      this.midiVisible = true
    },
    show(data, fileName) {
      this.handleMidPitchList(data.midPitchList)
      this.fileName = fileName
    },
    cancel() {
      this.midiVisible = false
      this.$emit('midi-cancel')
    },
    submit() {
      const pitchList = this.midPitchList[this.selectMid].pitchList
      const stagePitches = pitchList2StagePitches(pitchList, 'grid', this)
      this.midiVisible = false
      this.$store.dispatch('changeStoreState', {
        taskId: 0,
        bpm: pitchList[0].bpm,
        toneName: pitchList[0].singer,
        toneId: pitchList[0].toneId,
        musicName: this.fileName,
        stagePitches: stagePitches,
        pitchChanged: true,
        f0Draw: [],
        volumeMap: [],
        tensionMap: [],
        changedLineMap: {}
      })
      this.$store.dispatch('afterChangePitchAndHandle')
      this.$store.dispatch('saveFuYuan')
      this.$store.dispatch('adjustStageWidth')
      this.$emit('midi-cancel')
      // 有伴奏的话，清空伴奏
      const waveSurfer = getWaveSurfer()
      if (waveSurfer) {
        this.$store.dispatch('changeStoreState', { waveWidth: 0 })
        waveSurfer.destroy()
      }
      Message.success('导入成功～')
    }
  }
}
</script>

<style lang="less">
.midi-dialog {
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  width: 520px;
  color: #fff;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .el-dialog__header {
    height: 64px;
    line-height: 64px;
    padding: 0;
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .el-dialog__headerbtn {
    font-size: 20px;
    color: #d0d0d0;
  }
  .el-dialog__close, .el-icon, .el-icon-close {
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
    &:active {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .el-dialog__body {
    padding: 24px 0 16px 0;
  }
  .el-dialog__footer {
    border-top: 1px solid rgba(0,0,0,0.07);
    height: 72px;
    line-height: 72px;
    padding: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .el-button {
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    width: 80px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
  }
  .el-button--default {
    background: #1D1D1D;
    padding: 0;
    &:hover {
      background: #292929;
    }
  }
  .el-button--primary {
    background: #179B30;
    height: 40px !important;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    margin: 0 24px 0 16px;
    border: 0;
    &:hover {
      background: #2ea545;
    }
  }
  .el-radio__inner {
    border-radius: 3px;
    border: 1px solid #888888;
    background-color: transparent;
    &:hover {
      border-color: #888888;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #888888;
    background: #009032;
  }
  .el-radio__input.is-checked+.el-radio__label  {
    color: #ffffff;
  }
  .el-radio {
    display: block;
    height: 44px;
    line-height: 44px;
    margin: 0 24px;
    color: #fff;
    font-size: 14px;
  }
}
</style>
<style module lang="less">
.tips {
  margin: 0px 0 0 24px;
  font-size: 14px;
  color: #fff;
  height: 44px;
  line-height: 44px;
}
</style>
