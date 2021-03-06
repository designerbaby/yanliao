import { on, off } from '@/common/utils/dom'
import { renderThumbStyle, BAR_MAP } from './util'

export default {
  props: {
    vertical: Boolean,
    wrapRef: String,
    size: String,
    move: Number
  },
  data: () => ({
    cursorDown: false
  }),

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal']
    },

    wrap() {
      return this.$parent.$refs[this.wrapRef]
    }
  },

  render(h) {
    const { size, move, bar } = this

    return (
      <div class={['common-scrollbar-bar', 'is-' + bar.key]} onMousedown={this.clickTrackHandler}>
        <div
          ref="thumb"
          class="common-scrollbar-thumb"
          onMousedown={this.clickThumbHandler}
          style={renderThumbStyle({ size, move, bar })}
        />
        <div class="common-scrollbar-fixed" v-show={this.cursorDown}></div>
      </div>
    )
  },

  methods: {
    clickThumbHandler(e) {
      this.startDrag(e)
      this[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client])
      const thumbHalf = this.$refs.thumb[this.bar.offset] / 2
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / this.$el[this.bar.offset]

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },

    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true

      on(document, 'mousemove', this.mouseMoveDocumentHandler)
      on(document, 'mouseup', this.mouseUpDocumentHandler)
      document.onselectstart = () => false
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return
      const prevPage = this[this.bar.axis]

      if (!prevPage) return

      // console.log(e, this.$el, this.$el.getBoundingClientRect(), this.bar)
      const rect = this.$el.getBoundingClientRect()
      // ?????????????????????????????????
      // if (this.bar.axis === 'X' && Math.abs(e.clientY - rect.y) > 50) {
      //   this.mouseUpDocumentHandler()
      //   return
      // }

      const offset = (rect[this.bar.direction] - e[this.bar.client]) * -1
      const thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / this.$el[this.bar.offset]

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },

    mouseUpDocumentHandler(e) {
      // console.log('e', e)
      this.cursorDown = false
      this[this.bar.axis] = 0
      off(document, 'mousemove', this.mouseMoveDocumentHandler)
      document.onselectstart = null
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler)
  }
}
