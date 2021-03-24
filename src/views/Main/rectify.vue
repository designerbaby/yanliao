<template>
  <div class="re-edit-page">
    <div class="page-title">
      <img class="step" src="@/assets/3.png" alt=""/>
      <div class="text">校正歌词</div>
    </div>
    <div class="tips">您的歌词中含有多音字（标红显示），请确保下面每个字对应的拼音是正确的</div>
    <div class="lyric">
      <div class="item" v-for="(line, lineIndex) in lyricList" :key="line.content + lineIndex">
        <span v-for="(char, charIndex) in Array.from(line.content)" :key="char + charIndex">
          <span :class="polyphonicMap[lineIndex] && polyphonicMap[lineIndex][charIndex] ? 'strong' : ''">{{ char }}</span>
          <span class="pinyin-selector-box" v-if="polyphonicMap[lineIndex] && polyphonicMap[lineIndex][charIndex]">
            <span class="bracket">[</span>
            <span v-for="item in polyphonicMap[lineIndex][charIndex].options" :key="item + charIndex" :class="polyphonicMap[lineIndex][charIndex].model === item ? 'selected' : ''">
              <span class="radio-icon" @click="radioClick(lineIndex, charIndex, item)"></span>
              <input type="radio" :name="char + lineIndex + charIndex" :value="item" v-model="polyphonicMap[lineIndex][charIndex].model" @change="radioChange" hidden>
              <span class="pinyin" @click="radioClick(lineIndex, charIndex, item)">{{ item }}</span>
            </span>
            <span class="bracket">]</span>
          </span>
        </span>
      </div>
    </div>
    <div class="footer">
      <button @click="prevButtonClick" class="main-button">上一步</button>
      <button @click="audioButtonClick" class="main-button">去调音</button>
      <button @click="confirmButtonClick" class="main-button">生成音频</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  preSubmit,
  submit,
} from '@/api/api'

import {
  addDraft,
  fetchDraftDetailById,
  deleteDraft,
} from "@/api/draft"

import Header from '@/common/components/Header.vue'
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
    return {
      submitSuccess: false,
      oldForm: {},
      lyricList: [],
      polyphonicList: [],
      polyphonicMap: {}
    }
  },
  created() {
    const draftId = sessionStorage.getItem('draftId')
    if (draftId) {
      // 获取草稿数据
      this.getDraftInfo(draftId)
    } else {
      // 获取默认数据
      this.getDefaultInfo()
    }
  },
  mounted() {
    reportEvent('edit-page-2-exposure')
    window.onbeforeunload = (event) => {
      const isModified = this.comparisonFormData()
      if (isModified === true) {
        this.submitDraft()
        return '您可能有数据没有保存'
      }
    }
  },
  destroyed() {
    window.onbeforeunload = null
  },
  methods: {
    getDefaultInfo() {
      this.oldForm = JSON.parse(sessionStorage.getItem('form'))
      console.log('getDefaultInfo this.oldForm:', this.oldForm)
      this.polyphonicList = JSON.parse(sessionStorage.getItem('polyphonicList'))
      this.initFormData()
    },
    getDraftInfo(draftId) {
      fetchDraftDetailById(draftId).then((response) => {
        const { data } = response.data
        const d = data.audio_draft_info.content
        d.arrange_id = this.$route.query.arrangeId || undefined
        this.oldForm = d
        return preSubmit(d)
      }).then((response) => {
        const { data } = response.data
        this.polyphonicList = data.polyphonic_list
        console.log('fetchDraftDetailById this.polyphonicList:', this.polyphonicList)
        this.initFormData()
      })
    },
    initFormData() {
      this.lyricList = this.oldForm.new_lyric_list
      this.initPolyphonicMap()
      this.defaultForm = this.getFormData()
    },
    // 初始化多音字表单对象
    initPolyphonicMap() {
      this.polyphonicList.forEach((item) => {
        const x = item.x
        const y = item.y
        const l = item.pinyin_list
        if (!this.polyphonicMap[x]) {
          this.polyphonicMap[x] = {}
        }
        this.polyphonicMap[x][y] = {
          options: l,
          // model: l[0],
        }
        if (this.oldForm.fix_pinyin_list && this.oldForm.fix_pinyin_list.length !== 0) {
          this.polyphonicMap[x][y].model = this.oldForm.fix_pinyin_list.filter((i) => i.x === x).find((i) => i.y === y).pinyin || ''
        } else {
          this.polyphonicMap[x][y].model = l[0]
        }
      })
    },
    // 删除草稿数据
    deleteDraft() {
      const draftId = sessionStorage.getItem('draftId')
      deleteDraft(draftId)
      sessionStorage.setItem('draftId', '')
    },
    // 获取表单数据
    getFormData() {
      const formData = this.polyphonicList.map((item) => {
        const x = item.x
        const y = item.y
        if (this.polyphonicMap[x][y]) {
          let v = ''
          if (this.polyphonicMap[x][y].model) {
            v = this.polyphonicMap[x][y].model
          }
          const o = {
            x,
            y,
            pinyin: v,
          }
          return o
        }
      })
      return JSON.stringify(formData)
    },
    comparisonFormData() {
      const defaultForm = this.defaultForm
      const currentForm = this.getFormData()
      let isModified = false
      if (defaultForm !== currentForm) {
        isModified = true
      }
      return isModified
    },
    submitDraft() {
      const oldForm = this.oldForm
      const draftId = sessionStorage.getItem('draftId')
      const f = Object.assign({}, oldForm, {
        step: 2,
        draft_id: draftId || '',
        fix_pinyin_list: JSON.parse(this.getFormData()),
      })
      console.log('submitDraft f:', f)
      addDraft(f).then((response) => {
        const { data } = response.data
        const id = data.draft_id
        sessionStorage.setItem('draftId', id)
      })
    },
    radioClick(lineIndex, charIndex, item) {
      this.polyphonicMap[lineIndex][charIndex].model = item
      this.$forceUpdate()
    },
    radioChange() {
      // 多音字编辑页-拼音修正次数
      reportEvent("edit-page-2-polyphoic-update")
      this.$forceUpdate()
    },
    prevButtonClick() {
      // 多音字编辑页-上一步按钮-点击
      reportEvent("edit-page-2-prev-button")
      let editPath = sessionStorage.getItem('editPath')
      console.log('editPath:', editPath)
      if (editPath) {
        this.$router.push(JSON.parse(editPath))
      } else {
        // debugger
        this.$router.push('/edit/' + this.oldForm.music_id)
      }
      // this.$router.go(-1)
    },
    // 去调音
    audioButtonClick() {
      let xml2JsonReq = JSON.parse(sessionStorage.getItem('form'))
      if (this.$route.query.arrangeId) {
        xml2JsonReq.arrange_id = this.$route.query.arrangeId
      }
      xml2JsonReq.fix_pinyin_list = JSON.parse(this.getFormData())
      xml2JsonReq.is_add_ac = 0 // 不增加伴奏,为以后做伴奏做铺垫
      sessionStorage.setItem('xml2JsonReq', JSON.stringify(xml2JsonReq))
      this.$router.push(`/audioEditor?musicId=${xml2JsonReq.music_id}&index=1`)
    },
    confirmButtonClick() {
      // 多音字编辑页-确认按钮-点击
      reportEvent("edit-page-2-confirm-button")
      const f = this.oldForm
      f.fix_pinyin_list = JSON.parse(this.getFormData())
      log('rectify confirmButtonClick 提交数据：', f)
      submit(f).then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 0) {
          this.deleteDraft()
          this.submitSuccess = true
          this.$router.push(`/profile`)
        } else {
          Message.error(response.data.err_msg)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .re-edit-page {
    .page-title {
      padding: 0px 0 0 94px;
      display: flex;
      align-items: flex-end;
      .text {
        height: 38px;
        line-height: 38px;
        color: #000;
        font-size: 38px;
        margin-left: 10px;
      }
    }
    .tips {
      font-size: 20px;
      color: #979797;
      margin: 22px 0 0 150px;
    }
    .lyric {
      margin: 40px 0 0 150px;
      color: #000;
      font-size: 0px;
      .item {
        margin-top: 22px;
        font-size: 0px;
        .strong {
          color: #e02020;
        }
        .pinyin-selector-box {
          .bracket {
            color: #e02020;
            margin: 0 1px;
          }
          .pinyin {
            color: #979797;
            cursor: pointer;
          }
          .radio-icon {
            width: 14px;
            height: 14px;
            border: 1px solid #979797;
            border-radius: 50%;
            margin: 0 4px;
            position: relative;
            cursor: pointer;
          }
          .selected {
            .pinyin {
              color: #e02020;
            }
            .radio-icon {
              border-color: #e02020;
            }
            .radio-icon::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 8px;
              height: 8px;
              background: #e02020;
              border-radius: 50%;
            }
          }
        }
        span {
          font-size: 18px;
          display: inline-block;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: center;
      padding: 0 0 114px 0;
      margin: 78px 0 0 0;
      .main-button {
        width: 200px;
        height: 40px;
        color: #fff;
        font-weight: 500;
        border-radius: 40px;
        background: linear-gradient(to right, #44b5ff, #79d2ff);
        display: block;
        font-size: 18px;
      }
      .main-button + .main-button {
        margin-left: 40px;
      }
    }
  }
</style>
