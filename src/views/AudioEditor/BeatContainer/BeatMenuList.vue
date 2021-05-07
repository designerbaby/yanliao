<template>
  <div :class="$style.list"
    :style="{
      left: `${left}px`,
      top: `${top}px`
    }">
    <img src="@/assets/audioEditor/arrow-black.png">
    <div :class="[$style.button, $style.top]" @click.stop="deletePitch">删除</div>
    <div :class="[$style.button, $style.line]" @click.stop="copy">复制</div>

    <div :class="[$style.button, $style.top]" @click.stop="editLyric(-2)">编辑歌词</div>
    <div :class="[$style.button, $style.bottom, $style.line]" @click.stop="editLyric(-1)">全量编辑歌词</div>

    <div :class="[$style.button, $style.top, $style.bottom]" @click.stop="cancelBreath" v-if="showBreath === 'cancel'">取消换气</div>
    <div :class="[$style.button, $style.top, $style.bottom]" @click.stop="insertBreath" v-if="showBreath === 'insert'">插入换气</div>
  </div>
</template>

<script>
import Editor from '@/common/editor'
import DeletePitchCommand from '@/common/commands/DeletePitchCommand'
import InsertBreathCommand from '@/common/commands/InsertBreathCommand'
import CancelBreathCommand from '@/common/commands/CancelBreathCommand'
import CopyPitchCommand from '@/common/commands/CopyPitchCommand'

export default {
  name: 'BeatMenuList',
  components: {
  },
  data() {
    return {
      left: 0,
      top: 0
    }
  },
  computed: {
    stagePitches() {
      return this.$store.state.change.stagePitches
    },
    showBreath() {
      let show = ''
      const selectStagePitches = this.stagePitches.filter(v => v.selected)
      if (selectStagePitches.length === 1 && selectStagePitches[0].breath) {
        // 只选择了一个，而且这个选择的有换气的内容，就显示取消换气
        show = 'cancel'
      }
      let selectHasPosition = false
      for (let i = 0; i < this.stagePitches.length; i += 1) {
        const current = this.stagePitches[i]
        if (current.selected) {
          if (i === 0) {
            selectHasPosition = true
          } else { // i > 0
            const before = this.stagePitches[i - 1]
            if (before.left + before.width !== current.left) {
              selectHasPosition = true
            }
          }
        }
      }
      if (selectStagePitches.length === 1 && !selectStagePitches[0].breath && selectHasPosition) {
        // 只选择了一个，而且这个选择的没有换气的内容，而且前面有空格，就显示换气的按钮
        show = 'insert'
      }
      return show
    }
  },
  methods: {
    setPosition(left, top) {
      this.left = left
      this.top = top
    },
    deletePitch() {
      const editor = Editor.getInstance()
      editor.execute(new DeletePitchCommand(editor))
      this.$store.dispatch('const/changeState', { showMenuList: false })
    },
    editLyric(type) {
      this.$emit('editLyric', type)
      this.$store.dispatch('const/changeState', { showMenuList: false })
    },
    copy() {
      this.$store.dispatch('done/copyPitches')

    },
    insertBreath() {
      const pitch = this.stagePitches.filter(v => v.selected)[0]

      const breath = {
        left: pitch.left - this.$store.state.const.noteWidth,
        width: this.$store.state.const.noteWidth,
        pinyin: 'br'
      }
      // selectStagePitches.forEach(item => {
      //   this.$set(item, 'breath', {
      //     left: item.left - this.$store.state.const.noteWidth,
      //     width: this.$store.state.const.noteWidth,
      //     pinyin: 'br'
      //   })
      // })

      const editor = Editor.getInstance()
      editor.execute(new InsertBreathCommand(editor, pitch, breath))
    },
    cancelBreath() {
      // 操作存储
      // this.$store.dispatch('done/push')
      const pitch = this.stagePitches.filter(v => v.selected)[0]
      // selectStagePitches.forEach(item => {
      //   item.breath = null
      // })
      const editor = Editor.getInstance()
      editor.execute(new CancelBreathCommand(editor, pitch))
    }
  }
}
</script>

<style lang="less" module>
.list {
  width: 140px;
  background: #151517;
  box-shadow: -4px 4px 10px 0 rgba(0,0,0, 0.30);
  border-radius: 8px;
  position: absolute;
  color: #fff;
  font-size: 14px;
  text-align: center;
  z-index: 20; // 右键编辑菜单的层级
  img {
    width: 14px;
    height: 8px;
    position: absolute;
    left: 6px;
    top: -8px;
  }
}
.button {
  width: 116px;
  height: 44px;
  line-height: 44px;
  margin: 0 auto;
  &:hover {
    background: #1C1C1E;
    border-radius: 8px;
  }
  &:active {
    background: #0E0E0F;
    border-radius: 8px;
  }
}

.top {
  margin-top: 8px;
}

.line {
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.bottom {
  margin-bottom: 8px;
}

</style>
