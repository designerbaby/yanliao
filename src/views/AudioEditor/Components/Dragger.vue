<template>
    <div
      :class="[$style.container, className]"
      :style="styles"
      @mouseup.stop.prevent="onArrowEleLeave"
      @mousedown.prevent="onMouseDown">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Dragger',
  props: ['className', 'styles'],
  methods: {
    onMouseDown(event){
      // 0-鼠标左盘/1-鼠标中键/2-鼠标右键
      if (event.button !== 0) return
      // console.log(`Dragger onMouseDown`, event)
      // const { left, top } = event.target.getBoundingClientRect()
      const [left, top] = [event.clientX, event.clientY]
      // const target = event.target.cloneNode(true)
      const target = document.createElement('div')
      target.style.zIndex = 99999
      target.style.position = `absolute`
      target.style.width = '200px'
      target.style.height = '200px'
      target.style.left = `${left - 100}px`
      target.style.top = `${top - 100}px`
      target.style.opacity = 0  // 蒙层的透明度
      target.style.cursor = 'move'
      target.style.background = 'red'

      const onMove = (evt) => {
        target.style.left = `${evt.clientX - 100}px`
        target.style.top = `${evt.clientY - 100}px`
        this.$emit('on-move', evt)
      }

      const onMoveEnd = (evt) => {
        // console.log(`target mouse up`)
        target.parentNode.removeChild(target)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseleave', onMoveEnd)
        this.$emit('on-end', evt)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseleave', onMoveEnd)
      target.addEventListener('mouseup', onMoveEnd)
      document.body.appendChild(target)
      this.$emit('on-start', event)
    },
    onArrowEleLeave(event) {
      console.log(`onArrowEleLeave event: ${event}`)
    }
  }
}
</script>

<style lang="less" module>
.container {
  position: relative;
}
</style>
