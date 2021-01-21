<template>
  <div :class="$style.BeatSetting">
    <Drawer
      title="设置面板"
      :visible.sync="drawer"
      :append-to-body="true"
      :custom-class="$style.beatSetting"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="true"
      size="15%"
      :with-title="false">
      <div>
        <div :class="$style.text">当前音源</div>
        <div :class="$style.tone">
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
          <img src="@/assets/icon-player.png" @click="playerButtonClick">
        </div>
      </div>
      <div>
        <div :class="$style.text">当前曲速</div>
        <div :class="$style.tone">
          <InputNumber :class="$style.bpmInput" v-model="bpm" @input="bpmInputChange" controls-position="right" :min="50" :max="200"/>
          <div :class="$style.bpmText">(50-200BPM)</div>
        </div>
      </div>
      <div :class="$style.tone">
        <Button type="primary" @click.stop="save">保存</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { Drawer, Select, Option, InputNumber, Button } from "element-ui"
import { songOtherDetail } from '@/api/api'
import { PlayAudio } from '@/common/utils/player'

export default {
  name: 'BeatSetting',
  data() {
    return {
      drawer: false,
      audio: null,
      toneList: [],
      toneId: this.$store.state.toneId,
      bpm: this.$store.state.bpm
    }
  },
  components: {
    Drawer,
    Select,
    Option,
    InputNumber,
    Button
  },
  mounted() {
    this.getSongOtherDetail()
  },
  methods: {
    showDrawer() {
      this.drawer = true
    },
    async getSongOtherDetail() {
      const { data } = await songOtherDetail()
      this.toneList = data.data.tone_list
    },
    singleToneIdChange(value) {
      console.log('singleToneIdChange:', value)
      this.toneId = value
    },
    bpmInputChange(value) {
      this.bpm = value
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
    },
    save() {
      this.toneList.forEach(item => {
        if (this.toneId === item.tone_id) {
          this.$store.dispatch('changeStoreState', { toneId: item.tone_id, toneName: item.name })
        }
      })
      this.$store.dispatch('changeStoreState', { bpm: this.bpm })
      // 重新生成音高线
      this.$emit('buildPitchLine')
    }
  }
}
</script>

<style lang="less" module>
.v-modal {
  background: transparent;
}
.BeatSetting{
  color: #b8b8b8;
}

.beatSetting {
  right: 93px !important;
  top: 200px !important;
  background: #2f2f30 !important;
  border: 1px solid #626263;
}

.text {
  font-size: 15px;
  color: #b8b8b8;
  margin: 2px 16px;
}

.tone {
  margin: 0 16px;
}


.bpmText {
  color: #b8b8b8;
  font-size: 12px;
}
</style>
