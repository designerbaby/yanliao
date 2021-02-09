<template>
  <div :class="$style.Parameters">
    <div :class="$style.top">
      <span :class="$style.left">{{ typeName }}</span>
      <img src="@/assets/audioEditor/close.png" @click.stop="closeParameter" :style="{left: `${clientWidth - 86}px`}">
    </div>
    <span :class="[$style.text, $style.leftTop]">{{ typeParas.plus }}</span>
    <span :class="[$style.text, $style.rightTop]" :style="{left: `${clientWidth - 105}px`}">{{ typeParas.plus }}</span>
    <span :class="[$style.text, $style.leftBottom]">{{ typeParas.minus }}</span>
    <span :class="[$style.text, $style.rightBottom]" :style="{left: `${clientWidth - 105}px`}">{{ typeParas.minus }}</span>
    <canvas 
      ref="canvas"
      :class="$style.canvas" 
      :style="stageStyle" 
      id="canvas" @click.stop="initLine"
      @mousedown.stop="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup.stop="onMouseUp"
      @mouseleave="onMouseUp">
      您的浏览器不支持canvs，请更换浏览器重试~
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'Parameters',
  computed: {
    clientWidth() {
      return document.documentElement.clientWidth
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    typeMode() {
      return this.$store.state.typeMode
    },
    typeName() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case 0:
          return '响度'
          break
        case 1:
          return '张力'
          break
        default:
          return ''
          break
      }
    },
    typeParas() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case 0:
          return {
            plus: '+12 dB',
            minus: '-12 dB'
          }
          break
        case 1: 
          return {
            plus: '紧张',
            minus: '放松'
          }
          break
        default: 
          return {}
          break
      }
    },
    stageStyle() {
      return { 
        width: `${this.stageWidth}px`,
        left: `-${this.$store.state.stage.scrollLeft}px`
      }
    }
  },
  data() {
    return {
      mouseStart: null,
      startPos: null,
      endPos: null,
      stageOffset: null
    }
  },
  mounted() {
    
  },
  methods: {
    closeParameter() {
      this.$store.dispatch('changeStoreState', { typeMode: -1 })
    },
    initLine () {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      context.beginPath()
      context.moveTo(164, 0)
      context.lineTo(164, 200)
      context.lineWidth = 1
      context.strokeStyle = '#fff'
      context.stroke()
      context.closePath()
    },
    onMouseDown (event) {
      console.log(`onMouseDown event`, event)
      const rect = this.$refs.canvas.getBoundingClientRect()
      this.mouseStart = {
        rect
      }
    },
    onMouseMove (event) {
      // console.log(`onMouseMove event`, event)
      if (this.mouseStart) {
        
      }
    },
    onMouseUp (event) {
      console.log(`onMouseUp event`, event)
      this.mouseStart = null
    }
  }
}
</script>

<style lang="less" module>
.Parameters{
  z-index: 1000;
  position: fixed;
  bottom: 0;
  background: rgba(#323232, 0.8);
  border-radius: 1px;
  height: 360px;
  width: 100%;
}

.top {
  height: 32px;
  display: flex;
  align-items: center;
  background: #30302f;
  position: fixed;
  bottom: 328px;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  border-bottom: 1px solid #2a2a2a;
  width: 100%;
  img {
    position: absolute;
    left: 20px;
    width: 24px;
    height: 24px;
  }
}

.left {
  left: 9px;
  position: absolute;
}

.panel {
  height: 328px;
  position: absolute;
  bottom: 0;
}
.text {
  position: absolute;
  font-size: 12px;
  color: rgba(255,255,255,0.60);
}
.leftTop {
  top: 44px;
  left: 12px;
}
.rightTop {
  top: 44px;
}
.leftBottom {
  bottom: 12px;
  left: 12px;
}
.rightBottom {
  bottom: 12px;
}

.canvas {
  background: transparent;
  height: 328px;
  position: absolute;
  bottom: 0px;
}
</style>
