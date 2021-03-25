<template>
  <Dialog
    title="编辑歌词"
    :visible.sync="lyricVisible"
    :close-on-click-modal="false"
    width="400px">
    <Form :rules="rule" ref="lyricForm" :model="lyricForm">
      <FormItem prop="lyric">
        <Input type="textarea"
          placeholder="请输入歌词"
          v-model="lyricForm.lyric"
          :maxlength="maxlength"
          :rows="5"
          show-word-limit
        />
      </FormItem>
      <span>注：输入“-”号，即表示延续之前的字的尾音</span>
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button @click="toCorrect">拼音校正</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Message } from 'element-ui'
import { Hanzi2Pinyin, getYinsu } from '@/api/audio'
import { validateChinese, isChineseChar } from '@/common/utils/validate'

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
      return this.$store.state.stagePitches
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
            Message.error('连音符格式错误，请确保连音符“-”前面有连续音符')
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
      const pinyinList = await this.getPinyin()
      this.save()
    },
    async getPinyin() {
      const res = await Hanzi2Pinyin({ hanziList: this.lyricArray })
      const pinyinList = res.data.data.pinyinList
      pinyinList.forEach(item => {
        let select = 0
        const it = this.stagePitches.find(it => it.hanzi === item.hanzi)
        if (it) {
          select = it.select
        }
        this.$set(item, 'select', select) // 先将选择的初始为响应式
      })
      this.$store.dispatch('changeStoreState', { pinyinList })
      return pinyinList
    },
    save() {
      const stagePitches = this.stagePitches
      const pinyinList = this.$store.state.pinyinList
      const lyricArray = this.lyricArray
      // console.log('lyricArray:', lyricArray)
      if (this.index === -1) {
        for(let i = 0; i < this.maxlength; i += 1) {
          // const item = pinyinList[i] || {}
          const hanzi = lyricArray[i]
          let pinyin = ['la']
          let select = 0
          let value = '-'
          pinyinList.forEach(item => {
            if (item.hanzi === hanzi) {
              pinyin = item.pinyin
              select = item.select
              value = item.pinyin[select]
            }
          })
          const pitch = stagePitches[i]

          // 歌词逐个有没改动
          if (pitch.hanzi !== this.lyricArray[i]) {
            pitch.pitchChanged = true
          }

          pitch.pinyinList = pinyin
          pitch.select = select
          pitch.hanzi = this.lyricArray[i] || '啦'
          pitch.pinyin = value
        }
      } else {
        const changeStagePitches = this.stagePitches.filter(v => v.selected)
        for (let i = 0; i < changeStagePitches.length; i += 1) {
          const pitch = changeStagePitches[i]
          pitch.pitchChanged = true
          pitch.hanzi = this.lyricArray[i]
          pitch.select = 0
          pitch.pinyinList = ['la']
          pitch.pinyin = '-'
          pinyinList.forEach(item => {
            if (item.hanzi === pitch.hanzi) {
              pitch.select = item.select
              pitch.pinyinList = item.pinyin
              pitch.pinyin = item.pinyin[item.select]
            }
          })
        }
      }
      this.$store.dispatch('saveFuYuan')
      this.$store.dispatch('getPitchLine')
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
      this.$emit('showLyric', this.lyricForm.lyric)
    }
  }
}
</script>

<style lang="less" module>

</style>
