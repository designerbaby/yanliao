<template>
  <Dialog
    title="导入Midi"
    :visible.sync="midiVisible"
    width="400px"
    center>
    <div :class="$style.MidiDialog">
      要导入的音轨
      <Radio v-for="(it, index) in pitchLists"
        :key="index"
        :label="index"
        v-model="it.select"
        @change="changeSelect($event, it)"
        >
          音轨{{ index + 1 }}({{ it.length }}个音符)
      </Radio>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button @click="cancel">取 消</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
  <!-- <Modal @close="doClose">
    <div :class="$style.title">导入Midi</div>
    <div :class="$style.midTitle">选择要导入的音轨</div>
    <div :class="$style.midiList">
      <div :class="$style.radio" v-for="(it, index) in pitchLists" :key="index">
        <div :class="$style.select">
          <img src="@/assets/audioEditor/radio-actived.png" v-if="it.select">
          <img src="@/assets/audioEditor/radio-normal.png">
        </div>
      </div>
      音轨{{ index + 1 }}({{ it.length }}个音符, D9 - G9, Piano)
    </div>
    <div :class="$style.footer">
      <div :class="$style.cancel">取消</div>
      <div :class="$style.confirm">确定</div>
    </div>
  </Modal> -->
</template>

<script>
import { Dialog, Button, Message, Radio } from 'element-ui'
import Modal from '@/common/components/Modal.vue'

export default {
  name: 'MidiDialog',
  components: {
    Dialog,
    Button,
    Message,
    Radio,
    Modal
  },
  data() {
    return {
      midiVisible: false,
      pitchLists: [[{}, {}], [{}, {}]]
    }
  },
  methods: {
    show() {
      this.midiVisible = true
    },
    changeSelect(event, it) {
      console.log('changeSelect:', event, it)
    },
    cancel() {
      this.midiVisible = false
    },
    submit() {
      console.log('submit')
    },
    doClose() {

    }
  }
}
</script>

<style lang="less" module>
.MidiDialog{
}
</style>
