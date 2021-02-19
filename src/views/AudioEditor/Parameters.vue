<template>
  <div :class="$style.container">
    <div :class="$style.top">
      <span :class="$style.left">{{ typeName }}</span>
      <img src="@/assets/audioEditor/close.png" @click.stop="closeParameter" :style="{left: `${clientWidth - 86}px`}">
    </div>
    <div :class="$style.mark">
      <span :class="[$style.text, $style.leftTop]">{{ typeParas.plus }}</span>
      <span :class="[$style.text, $style.rightTop]" :style="{left: `${clientWidth - 105}px`}">{{ typeParas.plus }}</span>
      <span :class="[$style.text, $style.leftBottom]">{{ typeParas.minus }}</span>
      <span :class="[$style.text, $style.rightBottom]" :style="{left: `${clientWidth - 105}px`}">{{ typeParas.minus }}</span>
    </div>
    <!-- <canvas 
      ref="Canvas"
      :class="$style.canvas" 
      :style="stageStyle" 
      id="Canvas"
      :width="`${stageWidth}`"
      height="328"
      @mousedown.stop="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup.stop="onMouseUp"
      @mouseleave="onMouseUp">
      您的浏览器不支持canvs，请更换浏览器重试~
    </canvas> -->
    <div :class="$style.drawStage">
      <Drawable 
        :className="$style.draw"
        :styles="stageStyle"
        :valueHandler="valueHandler"
        @on-draw="onDraw"
        >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          version="1.1" 
          :class="$style.svg"
          >
          <g>
            <path :d="svgData" stroke="white" fill="transparent" stroke-linejoin="round"/>
            <!-- <path :d="svgDataDraw" stroke="white" fill="transparent" stroke-linejoin="round" /> -->
          </g>
        </svg>
      </Drawable>
    </div>
  </div>
</template>

<script>
import Drawable from './Components/Drawable.vue'
export default {
  name: 'Parameters',
  components: { Drawable },
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
        left: `-${this.$store.state.stage.scrollLeft}px`,
        height: '328px'
      }
    },
    pitchWidth() {
      return this.$store.getters.pitchWidth
    },
    firstPitch() {
      return this.$store.getters.firstPitch
    },
    svgData() {
      const d = this.$store.state.f0Db
      return this.formatSvgPath(d)
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onDraw(values) {
      console.log(`onDraw values:`, values)

      this.$store.dispatch('changeF0Db', { values })
    },
    getPositionY(value) {
      let y = 0
      if (value > 0) {
        y = 328 - value
      } else if (value < 0) { 
        y = 328 + Math.abs(value)
      }
      return y
    },
    formatSvgPath (data) {
      let result = 'M 0,164 '

      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < data.length; i += 1) {
        const value = data[i]
        const x = Math.round(this.pitchWidth * i)
        let y = this.getPositionY(value)

        if ((i) % 3 ==0) {
          result += "C "
        }
        result += `${x},${y} `
      } 

      if (data.length > 0) {
        result += `L ${this.getPositionY(data[data.length - 1])},164 `
      }

      result += `L ${this.stageWidth},164 `

      return result

      // return drawSvgPath(points)
    },
    valueHandler(x, y) {
      return 328 - y
    },
    closeParameter() {
      this.$store.dispatch('changeStoreState', { typeMode: -1 })
    }
  }
}
</script>

<style lang="less" module>
.container{
  z-index: 1000;
  position: fixed;
  bottom: 0;
  background: rgba(#323232, 0.8);
  border-radius: 1px;
  height: 360px;
  width: calc(100% - 50px);
}

.svg {
  width: 100%;
  height: 100%;
}
.top {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  background: #30302f;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  border-bottom: 1px solid #2a2a2a;
  position: relative;
  img {
    position: absolute;
    left: 20px;
    width: 24px;
    height: 24px;
  }
}

.mark {
  height: 328px;
}
.drawStage {
  position: absolute;
  width: 100%;
  height: 328px;
  left: 0;
  bottom: 0;
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
  width: 100%;
  height: 100%;
}
</style>
