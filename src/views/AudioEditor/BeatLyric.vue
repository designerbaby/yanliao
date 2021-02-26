<template>
  <Dialog
    title="编辑歌词"
    :visible.sync="lyricVisible"
    width="400px">
    <Form :rules="rule" ref="lyricForm" :model="lyricForm">
      <FormItem prop="lyric">
        <Input type="textarea"
          placeholder="请输入歌词"
          v-model="lyricForm.lyric"
          :maxlength="maxlength"
          :rows="5"
          show-word-limit
        ></Input>
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
import { Hanzi2Pinyin } from '@/api/audio'
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
      index: -1, // -1 代表批量更新歌词, 其他代表歌词的某一项
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
        lyric = this.stagePitches.find((item, i) => i === index).hanzi
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
      if (this.index !== -1) {
        if (this.lyricArray[0] === '-' && this.index === 0) {
          check = false
        }
      } else {
        if (this.lyricArray[0] === '-') {
          check = false
        }
      }
      return check
    },
    checkPitch() {
      let check = true
      const lyricArray = this.lyricArray
      // console.log('lyricArray:', lyricArray)
      if (lyricArray.indexOf('-') !== -1) {
        lyricArray.findIndex((value, index, arr) => {
          console.log('this.index:', this.index)
          const idx = this.index !== -1 ? this.index : index
          if (value === '-' && (idx - 1) >= 0) {
            const before = this.stagePitches.find((item, i) => i === idx - 1)
            const current = this.stagePitches.find((item, i) => i === idx)
            // console.log('this.stagePitches:', this.stagePitches)
            if (before.left + before.width !== current.left) {
              check = false
            }
          }
        })
      }
      return check
    },
    async saveStagePitches () {
      const pinyinList = await this.getPinyin()
      this.saveHanzi()
      this.savePinyin()
      this.savePinyinList()
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
    savePinyinList() {
      const pinyinList = this.$store.state.pinyinList
      if (this.index === -1) {
        for(let i = 0; i < this.maxlength; i += 1) {
          const yinpin = pinyinList[i] ? pinyinList[i].pinyin : ['la']
          const select = pinyinList[i] ? pinyinList[i].select: 0
          this.$store.dispatch('changeStagePitches', { index: i, key: 'pinyinList', value: yinpin })
          this.$store.dispatch('changeStagePitches', { index: i, key: 'select', value: select })
        }
      } else {
        this.$store.dispatch('changeStagePitches', { index: this.index, key: 'pinyinList', value: pinyinList[0].pinyin })
        this.$store.dispatch('changeStagePitches', { index: this.index, key: 'select', value: pinyinList[0].select })
      }
    },
    saveHanzi () {
      if (this.index === -1) {
        for (let i = 0; i < this.maxlength; i += 1) {
          this.$store.dispatch('changeStagePitches', { index: i, key: 'hanzi', value: this.lyricArray[i] || '啦' })
        }
      } else {
        this.$store.dispatch('changeStagePitches', { index: this.index, key: 'hanzi', value: this.lyricForm.lyric })
      }
    },
    savePinyin() {
      const pinyinList = this.$store.state.pinyinList
      if (this.index === -1) {
        for (let i = 0; i < this.maxlength; i += 1) {
          const select = pinyinList[i] ? pinyinList[i].select : 0
          const value = pinyinList[i] ? pinyinList[i].pinyin[select] : 'la'
          this.$store.dispatch('changeStagePitches', { index: i, key: 'pinyin', value: value })
        }
      } else {
        const pinyin = pinyinList[0].pinyin[pinyinList[0].select]
        this.$store.dispatch('changeStagePitches', { index: this.index, key: 'pinyin', value: pinyin })
      }
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
      this.$emit('showLyric', this.lyricForm.lyric, this.index)
    }
  }
}
</script>

<style lang="less" module>

</style>
