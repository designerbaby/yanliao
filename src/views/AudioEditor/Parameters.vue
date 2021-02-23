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
            <path :d="f0Init" stroke="gray" fill="transparent" stroke-linejoin="round"/>
            <path :d="f0Volume" stroke="white" fill="transparent" stroke-linejoin="round" v-if="typeMode === 0"/>
            <path :d="f0Tension" stroke="white" fill="transparent" stroke-linejoin="round" v-if="typeMode === 1"/>
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
    pitchWidth() {
      return this.$store.getters.pitchWidth
    },
    firstPitch() {
      return this.$store.getters.firstPitch
    },
    typeContainerHeight() {
      return this.$store.state.typeContainerHeight
    },
    typeName() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case 0:
          return '响度'
        case 1:
          return '张力'
        default:
          return ''
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
        case 1: 
          return {
            plus: '紧张',
            minus: '放松'
          }
        default: 
          return {}
      }
    },
    typeRange() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case 0: return 2400
        case 1: return 200
        default: return 100
      }
    },
    stageStyle() {
      return { 
        width: `${this.stageWidth}px`,
        left: `-${this.$store.state.stage.scrollLeft}px`,
        height: `${this.typeContainerHeight}px` // !328
      }
    },
    f0Init() {
      let result = `M 0,125 L ${this.stageWidth},125 `
      return result
    },
    f0Volume() {
      const { f0Volume, changedVolumeMap } = this.$store.state
      // console.log('f0Volume', f0Volume, changedVolumeMap)
      return this.formatSvgPath(f0Volume, changedVolumeMap)
    },
    f0Tension() {
      const { f0Tension, changedTensionMap }= this.$store.state
      return this.formatSvgPath(f0Tension, changedTensionMap)
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
    onDraw(values) {
      // console.log(`onDraw values:`, values)
      if (this.typeMode === 0) {
        this.$store.dispatch('changeF0Volume', { values })
      } else {
        this.$store.dispatch('changeF0Tension', { values })
      }
    },
    positionY2Db(y) {
      const dbPerPx = this.typeRange / this.typeContainerHeight
      if (y > (this.typeContainerHeight / 2)) {
        return -(dbPerPx * (y - (this.typeContainerHeight / 2)))
      } else if (y < (this.typeContainerHeight / 2)) { // 下半部分
        return (this.typeRange / 2) - dbPerPx * y // 从下往上是逐渐增大
      }
      return 0
    },
    db2PositionY(db) {
      const pxPerDb = this.typeContainerHeight / this.typeRange
      let y = this.typeContainerHeight / 2
      if (db > 0) { // 上半部分
        y = (this.typeContainerHeight / 2) - pxPerDb * db
      } else if (db < 0) { 
        y = Math.abs(pxPerDb * db) + (this.typeContainerHeight / 2)
      }
      return y
    },
    formatSvgPath (data, changed) {
      // let result = 'M 0,125 ' // !164
      let result = ''
      const width = (10 * 8 * 90 * 20) / (60 * 1000)
      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < data.length; i += 1) {

        // const x = Math.round(this.pitchWidth * i)
        const x = Math.round(width * i)
        let value = data[i]
        if (x in changed) {
          // console.log(`changed`, x, changed[x], changed)
          value = changed[x]
        }
        let y = this.db2PositionY(value)
        if (i === 0) {
          result += "M "
        }


        if ((i - 1) % 3 === 0) {
          result += "C "
        }
        result += `${x},${y} `
      } 

      if (data.length > 0) {
        // const lastX = Math.round(this.pitchWidth * (data.length - 1))
        const lastX = Math.round(width * (data.length - 1))

        const mod = (data.length - 1) % 3

        const size = mod === 0 ? 0 : 3 - mod

        for (let j = 0; j < size ; j += 1) {
          result += `${lastX},125 `
        }


        result += `L ${lastX},125 ${this.stageWidth},125 `
      }
    


      return result.trimRight()

      // return drawSvgPath(points)
    },
    valueHandler(x, y) {
      return this.positionY2Db(y)
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
  height: 282px;
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
  height: 250px; // !328
}
.drawStage {
  position: absolute;
  width: 100%;
  height: 250px; // !328
  left: 0;
  bottom: 0;
}
.left {
  left: 9px;
  position: absolute;
}

.panel {
  height: 250px; // !328
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
