<template>
  <Dialog
    title="编辑歌词"
    :visible.sync="lyricVisible"
    :close-on-click-modal="false"
    custom-class="lyric-dialog">
    <Form :rules="rule" ref="lyricForm" :model="lyricForm">
      <FormItem prop="lyric">
        <Input type="textarea"
          placeholder="请输入歌词"
          v-model="lyricForm.lyric"
          :maxlength="maxlength"
          :rows="7"
          show-word-limit
        />
      </FormItem>
      <span class="text">注：输入“-”号，即表示延续之前的字的尾音</span>
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button @click="toCorrect">拼音校正</Button>
      <Button type="primary" @click="submit">确定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Message } from 'element-ui'
import { Hanzi2Pinyin } from '@/api/audio'
import { validateChinese } from '@/common/utils/validate'
import { isChineseChar } from '@/common/utils/helper'
import ChangePitchLyricCommand from '@/common/commands/ChangePitchLyricCommand'

export default {
  name: 'BeatLyric',
  data() {
    return {
      lyricVisible: false,
      maxlength: 1,
      lyricForm: {
        lyric: ''
      },
      index: -1, // -1 代表全量更新歌词, 其他根据有没选择去处理
      rule: {
        lyric: [
          { required: true, message: '请输入歌词,且必须为中文或者“-”',
            trigger: 'blur', validator: validateChinese }
        ]
      }
    }
  },
  components: {
    Dialog,
    Button,
    Input,
    Message,
    Form,
    FormItem
  },
  computed: {
    lyricArray() {
      return this.lyricForm.lyric.split('')
    },
    stagePitches() {
      return this.$store.state.change.stagePitches
    }
  },
  methods: {
    showLyric(index) {
      console.log('showLyric index:', index)
      this.lyricVisible = true
      this.index = index
      this.setLyric(index)
    },
    setLyric(index) {
      let lyric = ''
      if (index === -1) {
        this.stagePitches.forEach(item => {
          lyric += item.hanzi
        })
      } else {
        this.stagePitches.forEach(item => {
          if (item.selected) {
            lyric += item.hanzi
          }
        })
      }
      this.lyricForm.lyric = lyric
      this.maxlength = this.lyricArray.length
    },

    submit() {
      this.$refs.lyricForm.validate((valid) => {
        if (valid) {
          if (!this.checkPitch()) {
            // Message.error('连音符格式错误，请确保连音符“-”前面有连续音符')
          } else if (!this.checkFisrtPitch()) {
            Message.error('第一个音符不可以输入“-”')
          } else {
            this.saveStagePitches()
            this.lyricVisible = false
          }
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    checkFisrtPitch() {
      // console.log('this.lyricArray:', this.lyricArray)
      let check = true

      if (this.index === -1) {
        if (this.lyricArray[0] === '-') {
          check = false
        }
      } else {
        const selectIndex = []
        this.stagePitches.forEach((item, index) => {
          if (item.selected) {
            selectIndex.push(index)
          }
        })
        if (this.lyricArray[0] === '-' && selectIndex[0] === 0) {
          check = false
        }
      }

      return check
    },
    checkPitch() {
      let check = true
      const lyricArray = this.lyricArray
      if (lyricArray.indexOf('-') !== -1) {
        lyricArray.findIndex((value, index, arr) => {
          const idx = this.index === -1 ? index : this.getIndex(index)
          if (value === '-' && (idx - 1) >= 0) {
            const before = this.stagePitches.find((item, i) => i === idx - 1)
            const current = this.stagePitches.find((item, i) => i === idx)
            if (before.left + before.width !== current.left) {
              Message.error(`第${idx+1}个字符是连音符“-”,请确保其前面有连续音符`)
              check = false
              return
            }
          }
        })
      }
      return check
    },
    getIndex(index) {
      let selectIndex = []
      const changeStagePitches = this.stagePitches.filter(v => v.selected)
      for (let i = 0; i < this.stagePitches.length; i += 1) {
        if (this.stagePitches[i].selected) {
          selectIndex.push(i)
        }
      }
      return selectIndex[index]
    },
    async saveStagePitches () {
      await this.getPinyin()
      this.save()
    },
    async getPinyin() {
      const res = await Hanzi2Pinyin({ hanziList: this.lyricArray })
      let pinyinList = res.data.data.pinyinList
      for (let i = 0; i < this.maxlength; i += 1) {
        if (!isChineseChar(this.lyricArray[i])){
          pinyinList.splice(i, 0, {
            hanzi: this.lyricArray[i],
            pinyin: [this.lyricArray[i]]
          })
        }
      }
      this.$store.dispatch('const/changeState', { pinyinList })
      return pinyinList
    },
    save() {
      this.$execute(new ChangePitchLyricCommand(this.$editor(), this.lyricArray, this.maxlength, this.index))
    },
    async checkComplexPinyin() {
      let hasPolyphnic = false
      const pinyinList = await this.getPinyin()
      for (let i = 0; i < pinyinList.length; i += 1) {
        if (pinyinList[i].pinyin.length > 1) {
          hasPolyphnic = true
          break
        }
      }
      return hasPolyphnic
    },
    async toCorrect() {
      const hasPolyphnic = await this.checkComplexPinyin()
      if (!hasPolyphnic) {
        Message.warning('没有多音字，无需校正~')
        return
      }
      const selectStagePitches = this.index === -1 ? this.stagePitches : this.stagePitches.filter(v => v.selected)
      this.$emit('showLyric', selectStagePitches)
    }
  }
}
</script>

<style lang="less">
.lyric-dialog {
  width: 520px;
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: 20px;
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
  .el-dialog__header {
    border-bottom: 1px solid rgba(0,0,0,0.07);
    height: 64px;
    padding: 0;
    line-height: 64px;
  }
  .el-textarea__inner {
    border: 2px solid rgba(255,255,255,0.15);
    font-size: 14px;
    color: #FFFFFF;
    font-family: PingFangSC-Regular;
    background: #323232;
    border-radius: 8px;
    &:focus {
      border-color: rgba(255,255,255,0.15);
    }
  }
  .el-textarea .el-input__count {
    background: #323232;
    font-size: 12px;
    color: rgba(255,255,255,0.40);
  }
  .el-form-item {
    margin-bottom: 8px;
  }
  .text {
    font-size: 12px;
    color: rgba(255,255,255,0.60);
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
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
  }
  .el-button--default {
    background: #1D1D1D;
    width: 96px;
    padding: 0;
    &:hover {
      background: #292929;
    }
  }
  .el-button--primary {
    background: #179B30;
    height: 40px !important;
    width: 80px;
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
}
</style>
