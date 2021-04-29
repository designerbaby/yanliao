import { toObject, getScrollBarWidth } from './util'
import Bar from './bar'
import { on, off } from '@/common/utils/dom'
import { addResizeListener, removeResizeListener } from '@/common/utils/resize'

export default {
  components: { Bar },

  props: {
    native: Boolean,
    horizontal: Boolean,
    wrapStyle: Object,
    wrapClass: String,
    viewClass: String,
    viewStyle: Object,
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0
    }
  },

  computed: {
    wrap() {
      return this.$refs.wrap
    }
  },

  render(h) {
    let gutter = getScrollBarWidth()
    let style = this.wrapStyle

    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle)
        style.marginRight = style.marginBottom = gutterWith
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }
    const view = h(
      this.tag,
      {
        class: ['common-scrollbar-view', this.viewClass],
        style: this.viewStyle,
        ref: 'resize'
      },
      this.$slots.default
    )
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        onMousewheel={this.handleMousewheel}
        class={[
          this.wrapClass,
          'common-scrollbar-wrap',
          gutter ? '' : 'common-scrollbar-wrap--hidden-default'
        ]}
      >
        {[view]}
      </div>
    )
    let nodes

    if (!this.native) {
      nodes = [
        wrap,
        <Bar wrapRef="wrap" move={this.moveX} size={this.sizeWidth} />,
        <Bar wrapRef="wrap" vertical move={this.moveY} size={this.sizeHeight} />
      ]
    } else {
      nodes = [
        <div
          ref="wrap"
          class={[this.wrapClass, 'common-scrollbar-wrap']}
          style={style}
        >
          {[view]}
        </div>
      ]
    }
    return h('div', { class: 'common-scrollbar' }, nodes)
  },

  methods: {
    handleScroll() {
      const wrap = this.wrap

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
    },
    handleMousewheel(e) {
      if (this.horizontal) { return; }
      const { scrollTop, scrollHeight, clientHeight } = this.$refs.wrap
      const delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0)
      if (
        (delta > 0 && scrollTop <= delta) ||
        (delta < 0 && scrollHeight - clientHeight - scrollTop <= -1 * delta)
      ) {
        this.$refs.wrap.scrollTop = delta > 0 ? 0 : scrollHeight
        e.preventDefault()
      }
    },

    update() {
      let heightPercentage, widthPercentage
      const wrap = this.wrap
      if (!wrap) return

      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
    }
  },

  mounted() {
    if (this.native) return
    this.$nextTick(this.update)
    !this.noresize && addResizeListener(this.$refs.resize, this.update)
    on(window, 'resize', this.update)
  },

  beforeDestroy() {
    if (this.native) return
    !this.noresize && removeResizeListener(this.$refs.resize, this.update)
    off(window, 'resize', this.update)
  }
}
