<template>
  <div class="edit-page">
    <div class="main">
      <div class="page-title">
        <img class="step" src="@/assets/2.png" alt=""/>
        <div class="text">改编歌曲</div>
      </div>
      <div class="section">
        <div class="title-box">
          <div class="edit-title">
            <div class="section-title">编辑歌词</div>
            <div class="tips">将原歌词替换成新歌词</div>
          </div>
          <div class="tone-title">
            <div class="section-title">选择音源</div>
            <div class="tips">选择谁来演唱这首歌</div>
          </div>
        </div>
        <div class="lyric-edit-box">
          <div class="lyric-item first-lyric-item">
            <div class="title">原歌词:</div>
            <div class="title">新歌词:</div>
            <div :class="toneType === 0 ? 'radio selected' : 'radio'">
              <div class="icon" @click="toneType = 0"></div>
              <input id="0" v-model="toneType" type="radio" :value="0" hidden>
              <label for="0">单个音源</label>
            </div>
            <div :class="toneType === 1 ? 'radio selected' : 'radio'">
              <div class="icon" @click="toneType = 1"></div>
              <input id="1" v-model="toneType" type="radio" :value="1" hidden>
              <label for="1">多个音源</label>
            </div>
          </div>

          <div class="lyric-item" v-for="(line, index) in oldLyricList" :key="line + index">
            <div class="text">{{ line }}</div>

            <div :class="validateResult.contents[index].status === false ? 'input check-failed' : 'input'">
              <input 
                :autofocus="index === 0 ? 'autofocus' : null" 
                placeholder="输入新歌词" 
                v-model="newLyricList[index].content" 
                @input="lyricInputChange($event, index)" 
                @blur="lyricInputBlur($event, index)" 
              />
              <span class="error-text">{{ validateResult.contents[index].text }}</span>
            </div>

            <div v-if="toneType === 0 && index === 0" :class="validateResult.singleTone === false ? 'tone-selector check-failed' : 'tone-selector'">
              <el-select
                filterable
                class="selector" 
                :placeholder="'选择谁来演唱这首歌'"
                v-model="singleToneId"
                @change="singleToneIdChange"
                >
                <el-option
                  v-for="item in toneList"
                  :key="item.tone_id + index"
                  :label="item.display_name"
                  :value="item.tone_id"
                >
                </el-option>
              </el-select>
              <img v-if="singleToneId !== null" src="@/assets/icon-player.png" alt="" @click="playerButtonClick($event, singleToneId)">
            </div>

            <div v-if="toneType === 1" :class="validateResult.tone[index] === false ? 'tone-selector check-failed' : 'tone-selector'">
              <el-select filterable class="selector" :placeholder="'选择谁来演唱这首歌'"
                v-model="newLyricList[index].toneId"
                @change="toneSelectorChange($event, index)"
              >
                <el-option
                  v-for="item in toneList"
                  :key="item.tone_id + index"
                  :label="item.display_name"
                  :value="item.tone_id"
                >
                </el-option>
              </el-select>
              <img 
                v-if="(newLyricList.findIndex((item) => { return item.toneId === newLyricList[index].toneId }) === index) && newLyricList[index].toneId !== null" 
                src="@/assets/icon-player.png" alt="" @click="playerButtonClick($event, newLyricList[index].toneId)"
                >
            </div>

          </div>

          <div class="audio-box">
            <audio v-for="item in toneList" :id="`audio-${item.tone_id}`" :key="item.tone_id" :src="item.audit_url"></audio>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <span>调节曲速</span>
          <span class="melody-tips">(单位: BPM)</span>
        </div>
        <el-input-number class="bpm-input" v-model="bpm" @input="bpmInputChange" controls-position="right"  />
        <div v-if="validateResult.bpm === false" class="bpm-error-text">曲速不能超过 50 - 200 (bpm) 的范围</div>
      </div>
      <div class="section">
        <div class="section-title">选择曲调
          <span class="melody-tips">(单位: 1 度代表 1 半音)</span>
        </div>
        <el-select class="melody-selector" 
          v-model="melody"
          :disabled="melodySelectorDisable === true ? true : false" :placeholder="melodySelectorDisable === true ? '请选择音源后再选择曲调' : ''"
        >
          <el-option
            v-for="item in melodyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="footer">
      <button @click="prevButtonClick" class="main-button">上一步</button>
      <button @click="confirmButtonClick" class="main-button">确定</button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      custom-class="dialog"
    >
      <div class="dialog-main">请先完善信息后再进行下一步</div>
      <div class="dialog-confirm-button" @click="dialogVisible = false">确定</div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  Select, 
  Option,
  Input,
  Dialog,
  InputNumber,
} from 'element-ui'

import { 
  songDetail,
  songOtherDetail,
  preSubmit,
  submit,
  editInfo,
  melodyConfig,
} from '@/api/api'

import {
  addDraft,
  fetchDraftDetailById,
  deleteDraft,
} from '@/api/draft'

import Header from '@/common/components/Header.vue'
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'Home',
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-dialog': Dialog,
    'el-input-number': InputNumber,
    Header,
  },
  data() {
    return {
      submitSuccess: false,
      // 是否编辑过
      edited: false,
      maxTone: 0,
      minTone: 0,
      melodySelectorDisable: true,
      defaultValue: {},
      showMelodyTips: false,
      singleToneId: null,
      validateResult: {
        contents: [],
        tone: [],
        bpm: null,
        singleTone: null,
      },
      // 初次选择音源
      firstSelectTone: true,
      musicId: null,
      // 音源模式, 0: 单个音源, 1: 多个音源
      toneType: 0,
      newLyricList: [],
      bpm: 50,
      melody: null,
      // 表单校验
      formChecked: true,
      // 弹窗展示
      dialogVisible: false,
      melodyOptions: [],
      oldLyricList: [],
      toneList: [],
      toneId: 0
    }
  },
  watch:{
    toneType(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.validateResult.tone = this.oldLyricList.map(item => null)
        this.validateResult.singleTone = null
        if (newValue === 0) {
          if (!this.singleToneId) {
            this.melodySelectorDisable = true
          } else {
            this.melodySelectorDisable = false
          }
        } else if (newValue === 1) {
          if (this.newLyricList.every(item => !item.toneId)) {
            this.melodySelectorDisable = true
          } else {
            this.melodySelectorDisable = false
          }
        }
      }
    },
  },
  created() {
    const musicId = parseInt(this.$route.params.musicId) // 歌曲id
    const arrangeId = this.$route.params.arrangeId // 编辑id
    let toneId = this.$route.params.toneId // 音色id
    const draftId = sessionStorage.getItem('draftId') // 草稿箱id
    // if (sessionStorage.getItem('draftToneId')) { 
    //   log('从我的草稿过来的')
    //   // 这里做下兼容，如果是从我的草稿过来的(即有这个draftToneId),toneId就从session拿
    //   toneId = sessionStorage.getItem('draftToneId')
    //   sessionStorage.setItem('draftToneId', '')
    // }
    // if (parseInt(sessionStorage.getItem('isRectify'), 10) === 1) {
    //   log('从rectify页面过来的')
    //   // 这里兼容主要是从rectify页面来，然后拿到本地的tone_id。
    //   toneId = (JSON.parse(sessionStorage.getItem('form')).new_lyric_list[0] || {}).tone_id
    //   sessionStorage.setItem('isRectify', 0)
    // }

    this.toneId = toneId
    this.musicId = musicId
    this.arrangeId = arrangeId
    this.draftId = draftId

    songOtherDetail(musicId).then((response) => {
      const { data } = response.data
      this.toneList = data.tone_list
    })
    if (arrangeId) {
      this.getEditedInfo(arrangeId)
    } else if (draftId) {
      this.getDraftInfo(draftId)
    } else {
      // 获取歌曲基本信息
      this.getSongInfo()
    }
  },
  mounted() {
    reportEvent('edit-page-exposure')
    this.toOnBeforeUpload()
    // this.initEdit()
    // setInterval(() => {
    //   this.submitDraft()
    // }, 1000)
  },
  destroyed() {
    window.onbeforeunload = null
  },
  methods: {
    // initEdit() { // 初始来的时候查询曲调信息
    //   this.getMelodyConfig(this.toneId)
    // },
    toOnBeforeUpload() {
      // 在浏览器退出之前，判断是否有数据修改了没保存
      window.onbeforeunload = (event) => {
        const isModified = this.comparisonFormData()
        if (isModified === true) {
          this.submitDraft()
          return '您可能有数据没有保存'
        }
      }
    },
    comparisonFormData() {
      // 对比form两个有没改变
      const defaultForm = this.defaultForm
      const currentForm = this.getFormData()
      let isModified = false
      if (JSON.stringify(defaultForm) !== JSON.stringify(currentForm)) {
        isModified = true
      }
      return isModified
    },
    getDraftInfo(draftId) {
      // 拉取草稿箱
      fetchDraftDetailById(draftId).then((response) => {
        const { data } = response.data
        this.initFormData(data)
      })
    },
    getEditedInfo(arrangeId) {
      // 查询歌曲的编辑信息
      editInfo(arrangeId).then((response) => {
        const { data } = response.data
        this.initFormData(data)
      })
    },
    // 获取歌曲基本信息
    getSongInfo() {
      const musicId = this.musicId
      songDetail(musicId).then((response) => {
        const { data } = response.data
        this.initFormData(data)
      })
    },
    initLyricData(data) {
      if (this.arrangeId || this.draftId) {
        if (this.toneType === 0) {
          this.singleToneId = data.new_lyric_list[0].tone_id || null
          this.newLyricList = data.new_lyric_list.map(item => { return { content: item.content, toneId: null, } })
        } else {
          this.newLyricList = data.new_lyric_list.map(item => { return { content: item.content, toneId: item.tone_id || null, } })
        }
      } else {
        this.newLyricList = this.oldLyricList.map((item) => {
          const o = {
            content: item,
            toneId: null,
          }
          return o
        })
      }
    },
    // 初始化表单数据
    initFormData(data) {
      log('initFormData data:', data)
      let type = 'normal'
      if (this.arrangeId) {
        type = 'edit'
      } else if (this.draftId) {
        type = 'draft'
      }
      const m = {
        'normal': () => {
          this.oldLyricList = data.lyric_list
          this.bpm = data.avg_bpm
          this.maxTone = 0
          this.minTone = 0
          this.countAdjust = data.count_adjust || []
          this.initLyricData()
        },
        'edit': () => {
          const editInfo = data.edit_info
          log('edit editInfo:', editInfo)
          this.maxTone = data.max_tone
          this.minTone = data.min_tone
          this.bpm = editInfo.bpm
          this.melody = editInfo.up_down_tone
          this.toneType = editInfo.tone_type
          this.oldLyricList = data.lyric_list
          this.countAdjust = data.count_adjust || []
          this.initLyricData(editInfo)
          // // 这里主要兼容，在矫正歌词点上一步时，先显示上次编辑的东西
          // if (parseInt(sessionStorage.getItem('isRectify'), 10) === 1) {
          //   const oldForm = JSON.parse(sessionStorage.getItem('form'))
          //   log('oldForm:', oldForm)
          //   log('toneList:', this.toneList)
          //   this.toneType = oldForm.tone_type
          //   this.bpm = oldForm.bpm
          //   this.melody = oldForm.up_down_tone
          //   this.newLyricList = oldForm.new_lyric_list
          //   sessionStorage.setItem('isRectify', 0)
          // } 
        },
        'draft': () => {
          const draftDetail = data.audio_draft_info.content
          this.bpm = draftDetail.bpm
          this.melody = draftDetail.up_down_tone
          this.toneType = draftDetail.tone_type
          this.maxTone = draftDetail.max_tone
          this.minTone = draftDetail.min_tone
          this.oldLyricList = draftDetail.new_lyric_list.map(item => item.content)
          const musicId = this.musicId
          songDetail(musicId).then((response) => {
            this.oldLyricList = response.data.data.lyric_list
            this.initvalidateData()
          })
          this.countAdjust = data.audio_draft_info.count_adjust || []
          this.initLyricData(draftDetail)
        }
      }
      m[type]()
      this.$nextTick(() => {
        this.melodySelectorDisable = this.maxTone === 0 && this.minTone === 0 ? true : false
      })
      this.initMelodyOption()
      this.initvalidateData()
      this.defaultForm = this.getFormData()
    },
    // 提交草稿
    submitDraft() {
      const formData = this.getFormData()
      const draftId = sessionStorage.getItem('draftId')
      const f = Object.assign({}, formData, {
        step: 1,
        draft_id: draftId || '',
      })
      addDraft(f).then((response) => {
        const { data } = response.data
        const id = data.draft_id
        sessionStorage.setItem('draftId', id)
      })
    },
    // 获取表单数据
    getFormData() {
      const formData = {
        music_id: this.musicId,
        tone_type: this.toneType,
        new_lyric_list: this.cleansingData(this.newLyricList),
        bpm: parseInt(this.bpm),
        up_down_tone: this.melody,
        max_tone: this.maxTone,
        min_tone: this.minTone,
      }
      return formData
    },
    /* 数据初始化 start */
    // 初始化校验数据
    initvalidateData() {
      this.validateResult = {
        contents: this.oldLyricList.map(item => { 
          return { status: null, text: '', }
        }),
        bpm: null,
        tone: this.oldLyricList.map(item => null),
        singleTone: null,
      }
    },
    // 初始化曲调选择项
    initMelodyOption() {
      const max = this.maxTone
      const min = this.minTone
      const melodyOptions = []
      // 初始化选择项内容
      for (let i = min; i <= max; i++) {
        const o = {
          value: i,
        }
        if (i > 0) {
          o.label = `升 ${i} 度`
        } else if (i === 0) {
          o.label = '曲调不变(默认)'
        } else {
          o.label = `降 ${Math.abs(i)} 度`
        }
        melodyOptions.push(o)
      }
      if (max < 0) { // 最大的小于0，并且没有0
        melodyOptions.push({
          value: 0,
          label: '曲调不变(默认)'
        })
      }
      if (min > 0) {
        melodyOptions.unshift({
          value: 0,
          label: '曲调不变(默认)'
        })
      }
      this.melodyOptions = melodyOptions
    },
    /* 数据初始化 end */

    // 获取 melody 配置
    getMelodyConfig(toneId) {
      const musicId = this.musicId
      console.log(`getMelodyConfig: musicId:${musicId}, toneId:${toneId}`)
      melodyConfig(musicId, toneId).then((response) => {
        this.melodySelectorDisable = false
        const { data } = response.data
        this.maxTone = parseInt(data.tone_max)
        this.minTone = parseInt(data.tone_min)
        this.initMelodyOption()
        this.melody = parseInt((this.maxTone + this.minTone) / 2)
      })
    },

    /* 事件监听 start */
    // bpm 输入框 input 事件
    bpmInputChange(value) {
      this.checkBpmInput()
    },
    // 音源选择框 change 事件
    toneSelectorChange(value, index) {
      if (this.firstSelectTone === true && this.toneType === 1) {
        log('初次选择音源')
        this.newLyricList.forEach((item) => {
          item.toneId = value
        })
        this.getMelodyConfig(value)
        this.checkAllToneSelector()
        this.firstSelectTone = false
      }

      if (value) {
        this.validateResult.tone[index] = true
      } else {
        this.validateResult.tone[index] = false
      }
    },
    // 选择谁来唱这首歌的事件
    singleToneIdChange(value) {
      if (value) {
        this.getMelodyConfig(value)
        this.validateResult.singleTone = true
      } else {
        this.validateResult.singleTone = false
      }
    },
    // 歌词输入框 input 事件
    lyricInputChange(event, index) {
      const target = event.target
      const value = target.value
      const maxLength = this.checkSingleContentInput(value, index)
      this.edited = true
      // if (maxLength) {
      //   this.newLyricList[index].content = this.newLyricList[index].content.slice(0, maxLength)
      // }
    },
    // 歌词输入框 blur 事件
    lyricInputBlur(event, index) {
      const target = event.target
      const value = target.value
    },
    // 播放按钮点击
    playerButtonClick(event, index) {
      const allPlayer = document.querySelectorAll(`audio`)
      allPlayer.forEach(item => {
        item.pause()
      })
      const player = document.querySelector(`#audio-${index}`)
      player.currentTime = 0
      player.play()
    },
    // 上一页按钮点击
    prevButtonClick() {
      // 编辑页-上一步按钮-点击
      reportEvent('edit-page-prev-button')
      this.$router.push('/search')
    },
    // 删除草稿
    deleteDraft() {
      const draftId = sessionStorage.getItem('draftId')
      deleteDraft(draftId)
      sessionStorage.setItem('draftId', '')
    },
    // 确认按钮点击
    confirmButtonClick() {
      // 编辑页-确认按钮-点击
      reportEvent('edit-page-confirm-button')
      const f = this.getFormData()
      const arrangeId = this.$route.params.arrangeId
      if (arrangeId) {
        f.arrange_id = arrangeId
      }
      log('提交数据', f)
      this.checkForm()
      if (this.formChecked === true) {
        preSubmit(f).then((response) => {
          const { data } = response.data
          const polyphonicList = data.polyphonic_list
          if (polyphonicList.length === 0) {
            f.fix_pinyin_list = []
            return submit(f)
          } else {
            sessionStorage.setItem('form', JSON.stringify(f))
            sessionStorage.setItem('polyphonicList', JSON.stringify(data.polyphonic_list))
            sessionStorage.setItem('editPath', JSON.stringify(this.$router.history.current.path))
            // this.submitDraft()
            this.$router.push('/rectify')
          }
        }).then((response) => {
          if (!response) {
            return
          }
          const { data } = response.data
          this.submitSuccess = true
          this.deleteDraft()
          this.$router.push(`/profile`)
        })
      } else {
        this.dialogVisible = true
      }

      if (this.defaultForm.bpm !== this.bpm) {
        // 编辑页-用户修改曲速
        reportEvent('edit-page-update-bpm')
      }
      if (this.defaultForm.melody !== this.melody) {
        // 编辑页-用户修改曲调
        reportEvent('edit-page-update-melody')
      }
    },
    /* 事件监听 end */

    /* 表单校验 start */
    fillValidateResult(status, text, index) {
      const o = {
        status: status,
        text: text,
      }
      this.validateResult.contents[index] = o
    },
    // 检查曲速
    checkBpmInput() {
      const bpm = this.bpm
      if (bpm < 50 || bpm > 200) {
        this.validateResult.bpm = false
      } else {
        this.validateResult.bpm = true
      }
    },
    // 检查唱歌内容
    checkSingleContentInput(value, index) {
      const countAdjust = this.countAdjust.find((item) => item.line === index + 1)
      const defaultValidateObject = {
        status: true,
        text: '',
      }
      this.validateResult.contents[index] = defaultValidateObject
      // 为空
      if (value.length === 0) {
        this.fillValidateResult(false, '请输入歌词', index)
        return this.oldLyricList[index].length
      }
      // 中文
      if (/^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(value) === false) {
        this.fillValidateResult(false, '只能输入中文', index)
        return this.oldLyricList[index].length
      }
      // 长度
      if (countAdjust) {
        if (Array.from(value).length !== countAdjust.count) {
          // 英文
          this.fillValidateResult(false, `${Array.from(value).length}/${countAdjust.count}`, index)
          return countAdjust.count
        }
      } else {
        if (Array.from(value).length !== Array.from(this.oldLyricList[index]).length) {
          // 中文
          this.fillValidateResult(false, `${Array.from(value).length}/${Array.from(this.oldLyricList[index]).length}`, index)
          return Array.from(this.oldLyricList[index]).length
        }
      }
      return Array.from(this.oldLyricList[index]).length
    },
    // 检查所有内容的输入
    checkAllContentInput() {
      this.newLyricList.forEach((item, index) => {
        const value = item.content
        this.checkSingleContentInput(value, index)
      })
    },
    // 检查所有曲调的选择
    checkAllToneSelector() {
      if (this.toneType === 0) {
        if (this.singleToneId !== null) {
          this.validateResult.singleTone = true
        } else {
          this.validateResult.singleTone = false
        }
      } else {
        this.newLyricList.forEach((item, index) => {
          const value = item.toneId
          if (value !== null) {
            this.validateResult.tone[index] = true
          } else {
            this.validateResult.tone[index] = false
          }
        })
      }
    },
    // 检查表单
    checkForm() {
      // 检查 bpm input
      this.checkBpmInput()
      // 检查所有 content input
      this.checkAllContentInput()
      // 检查所有 tone selector
      this.checkAllToneSelector()
      log('validate result', this.validateResult)

      this.formChecked = true
      const validateResult = this.validateResult
      Object.keys(validateResult).forEach((k) => {
        const value = validateResult[k]
        const type = Object.prototype.toString.call(value)
        if (type === '[object Array]') {
          // 数组
          for (let i = 0; i < value.length; i++) {
            const v = value[i]
            if (Object.prototype.toString.call(v) === '[object Boolean]') {
              if (v === false) {
                this.formChecked = false
                break
              }
            } else if (Object.prototype.toString.call(v) === '[object Object]') {
              if (v.status === false) {
                this.formChecked = false
                break
              }
            }
          }
        } else if (type === '[object Boolean]') {
          if (value === false) {
            this.formChecked = false
          }
        }
      })
    },
    /* 表单校验 end */

    // 清洗数据
    cleansingData(list) {
      return list.map((item, index) => {
        const o = {
          content: item.content,
        }
        if (this.toneType === 0) {
          if (index === 0) {
            o.tone_id = this.singleToneId
          }
        } else {
          if (item.toneId) {
            o.tone_id = item.toneId
          }
        }
        return o
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .edit-page {
    // width: 100vw;
    .main {
      padding: 0px 0 0 94px;
      .page-title {
        margin-bottom: 76px;
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
      .section {
        margin: 0px 0 0 44px;
        .melody-tips {
          color: #939393;
          font-size: 16px;
          margin-left: 20px;
          font-weight: 500;
        }
        .bpm-error-text {
          color: #e02020;
          display: inline;
          margin-left: 12px;
        }
        .title-box {
          display: flex;
          .tone-title {
            margin-left: 630px;
            div {
              padding-left: 5px;
            }
          }
          .edit-title, .tone-title {
            min-width: 216px;
          }
        } 
        .section-title {
          font-size: 30px;
          color: #000;
          display: flex;
          align-items: center;
          height: 30px;
          padding: 0 0 0 16px;
        }
        .section-title::before {
          content: '';
          width: 5px;
          height: 30px;
          display: block;
          background: #2cabff;
          margin-right: 10px;
        }
        .tips {
          margin-top: 12px;
          font-size: 20px;
          color: #b2b2b2;
          padding: 0 0 0 16px;
          margin-bottom: 30px;
        }
        .lyric-edit-box {
          margin-bottom: 84px;
          .first-lyric-item {
            margin-bottom: 18px;
            .radio {
              margin-left: 94px;
              display: flex;
              align-items: center;
              min-width: 90px;
              color: #000;
              font-size: 20px;
              label {
                cursor: pointer;
              }
              .icon {
                position: relative;
                cursor: pointer;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                border: 1px solid #d8d8d8;
                margin-right: 6px;
              }
              input:checked + label {
                color: #2cabff;
              }
            }
            .radio {
              .icon {
                min-width: 20px;
              }
              label {
                min-width: 80px;
              }
            }
            .selected {
              .icon {
                border: 1px solid #2cabff;
              }
              .icon::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2cabff;
                width: 12px;
                height: 12px;
                border-radius: 50%;
              }
            }
            .radio + .radio {
              margin-left: 68px;
            }
          }
          .lyric-item {
            height: 48px;
            color: #979797;
            font-size: 16px;
            line-height: 48px;
            display: flex;
            .title {
              font-size: 20px;
              color: #000;
              min-width: 358px;
              font-weight: 500;
              padding-left: 16px;
            }
            .title + .title {
              margin-left: 40px;
            }
            .text {
              padding: 0 0 0 16px;
              min-width: 358px;
              border-bottom: 1px solid #e0e0e0;
            }
            .input {
              position: relative;
              min-width: 398px;
              input {
                margin-left: 40px;
                display: block;
                width: 358px;
                height: 100%;
                border: none;
                outline: none;
                border-bottom: 1px solid #e0e0e0;
                padding-left: 16px;
                font-size: 16px;
              }
            }
            .tone-selector {
              display: flex;
              align-items: center;
              min-width: 287px;
              img {
                cursor: pointer;
                margin-left: 14px;
              }
            }
            .error-text {
              display: none;
              line-height: 48px;
              color: #da2c2c;
              font-size: 12px;
              position: absolute;
              right: 0;
              top: 0;
              font-weight: 300;
            }
            .input::placeholder {
              font-size: 16px;
              color: #979797;
            }
            .selector {
              margin-left: 94px;
              width: 280px;
            }
          }
        }
        .bpm-input {
          width: 150px;
          margin: 26px 0px 80px;
          font-size: 20px;
          padding: 0 0 0 16px;
        }
        .melody-selector {
          width: 260px;
          margin-top: 26px;
          padding: 0 0 0 16px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: center;
      padding: 0 0 114px 0;
      margin: 101px 0 0 0;
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

<style lang="less">
  .bpm-input {
    input {
      text-align: center;
    }
    .el-input {
      font-size: 20px;
    }
  }
  .dialog {
    border-radius: 10px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    margin: 0 !important;
    .dialog-main {
      font-size: 22px;
      color: #000;
      text-align: center;
    }
    .dialog-confirm-button {
      color: #fff;
      background: linear-gradient(to right, #44b5ff, #79d2ff);
      font-size: 18px;
      width: 150px;
      height: 40px;
      border-radius: 30px;
      margin: 40px auto 0;
      text-align: center;
      line-height: 40px;
      font-weight: 500;
      cursor: pointer;
    }
  }
  .check-failed {
    input {
      border-color: #e02020 !important;
      // color: #e02020;
    }
    input::placeholder {
      color: #e02020;
    }
    .el-input__inner {
      border-color: #e02020;
    }
    .el-input__inner:hover {
      border-color: #e02020;
    }
    .el-select .el-input.is-focus .el-input__inner {
      border-color: #e02020;
    }
    .error-text {
      display: block !important;
    }
  }
  .el-select-dropdown__item:hover {
    background: rgba(44, 171, 255, 0.05);
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: rgba(44, 171, 255, 0.05);
  }
  .selector {
    .el-input__inner {
      font-size: 16px;
    }
  }
  
  .melody-selector {
    .el-input__inner {
      font-size: 16px;
    }
  }
</style>