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
        @mouse-down="saveOp"
        @on-draw="onDraw"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          :class="$style.svg"
          >
          <g>
            <path :d="f0Init" stroke="gray" fill="transparent" stroke-linejoin="round"/>
            <path :d="volumeMap" stroke="white" fill="transparent" stroke-linejoin="round" v-if="typeMode === TypeModeState.StateVolume"/>
            <path :d="tensionMap" stroke="white" fill="transparent" stroke-linejoin="round" v-if="typeMode === TypeModeState.StateTension"/>
          </g>
        </svg>
      </Drawable>
    </div>
  </div>
</template>

<script>
import Drawable from '@/views/AudioEditor/Components/Drawable.vue'
import { TypeModeState } from '@/common/utils/const'

export default {
  name: 'Parameters',
  components: { Drawable },
  data() {
    return {
      TypeModeState: TypeModeState
    }
  },
  computed: {
    clientWidth() {
      return document.documentElement.clientWidth
    },
    stageWidth() {
      return this.$store.getters['const/stageWidth']
    },
    typeMode() {
      return this.$store.state.const.typeMode
    },
    pitchWidth() {
      // 10是因为数据的每一项间隔10ms
      return this.$store.getters['const/pitchWidth']
    },
    typeContainerHeight() {
      return this.$store.state.const.typeContainerHeight
    },
    typeName() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case TypeModeState.StateVolume:
          return '响度'
        case TypeModeState.StateTension:
          return '张力'
        default:
          return ''
      }
    },
    typeParas() {
      const typeMode = this.typeMode
      switch (typeMode) {
        case TypeModeState.StateVolume:
          return {
            plus: '+12 dB',
            minus: '-12 dB'
          }
        case TypeModeState.StateTension:
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
        case TypeModeState.StateVolume: return 2400
        case TypeModeState.StateTension: return 200
        default: return 100
      }
    },
    stageStyle() {
      return {
        width: `${this.stageWidth}px`,
        left: `-${this.$store.state.const.stage.scrollLeft}px`,
        height: `${this.typeContainerHeight}px`
      }
    },
    f0Init() {
      let result = `M 0,125 L ${this.stageWidth},125 `
      return result
    },
    volumeMap() {
      return this.formatSvgPath(this.$store.state.change.volumeMap)
    },
    tensionMap() {
      return this.formatSvgPath(this.$store.state.change.tensionMap)
    }
  },
  methods: {
    saveOp() {
      // 操作存储
      // this.$store.dispatch('done/push')
    },
    onDraw(values) {
      // console.log(`onDraw values:`, values)
      if (this.typeMode === TypeModeState.StateVolume) {
        this.$store.dispatch('change/changeVolumeMap', { values })
      } else if (this.typeMode === TypeModeState.StateTension) {
        this.$store.dispatch('change/changeTensionMap', { values })
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
    formatSvgPath (data) {
      let resultArr = []
      for (let i = 0; i < data.length; i += 1) {
        const x = Math.round(this.pitchWidth * i)
        let value = data[x]
        if (value === null || value === undefined) {
          value = 0
        }
        let y = this.db2PositionY(value)
        resultArr.push({
          x,
          y
        })
      }
      // console.log('resultArr:', resultArr)
      return this.drawFormatData(resultArr)
    },
    drawFormatData (resultArr) {
      let result = ''
      for (let i = 0; i < resultArr.length; i += 1) {
        const x = resultArr[i].x
        const y = resultArr[i].y
        if (i === 0) {
          result += `M `
        }

        if ((i - 1) % 3 === 0) {
          result += "C "
        }
        result += `${x},${y} `
      }

      if (resultArr.length > 0) {
        const lastX = Math.round(resultArr[resultArr.length - 1].x)

        const mod = (resultArr.length - 1) % 3

        const size = mod === 0 ? 0 : 3 - mod

        for (let j = 0; j < size ; j += 1) {
          result += `${lastX},125 `
        }

        result += `L ${lastX},125 ${this.stageWidth},125 `
      }

      return result.trimRight()
    },
    valueHandler(x, y) {
      return this.positionY2Db(y)
    },
    closeParameter() {
      this.$store.dispatch('const/changeState', { typeMode: TypeModeState.StateNone })
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
  height: 250px;
}
.drawStage {
  position: absolute;
  width: 100%;
  height: 250px;
  left: 0;
  bottom: 0;
}
.left {
  left: 9px;
  position: absolute;
}

.panel {
  height: 250px;
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
