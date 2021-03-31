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
</template>

<script>
import { Dialog, Button, Message, Radio } from 'element-ui'

export default {
  name: 'MidiDialog',
  components: {
    Dialog,
    Button,
    Message,
    Radio
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
    }
  }
}
</script>

<style lang="less" module>
.MidiDialog{
}
</style>
