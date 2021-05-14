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
        @on-start="onDrawStart"
        @on-draw="onDraw"
        @on-end="onDrawEnd"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          :class="$style.svg"
          >
          <g>
            <path :d="f0Init" stroke="gray" fill="transparent" stroke-linejoin="round"/>
            <path :d="volumeMap" stroke="white" fill="transparent" stroke-linejoin="round" :class="$style.dpath" :style="{ transform: `scaleX(${scale})` }" v-if="typeMode === TypeModeState.StateVolume"/>
            <!-- <path v-for="(it, index) in divideVolumeMap" :key="index" :d="it" stroke="white" fill="transparent" stroke-linejoin="round" :class="$style.dpath" :style="{ transform: `scaleX(${scale})` }" v-if="typeMode === TypeModeState.StateVolume"/> -->
            <path :d="tensionMap" stroke="white" fill="transparent" stroke-linejoin="round" :class="$style.dpath" :style="{ transform: `scaleX(${scale})` }" v-if="typeMode === TypeModeState.StateTension"/>
          </g>
        </svg>
      </Drawable>
    </div>
  </div>
</template>

<script>
import Drawable from '@/views/AudioEditor/Components/Drawable.vue'
import { TypeModeState } from '@/common/utils/const'
import Editor from '@/common/editor'
import ChangeVolumeCommand from '@/common/commands/ChangeVolumeCommand'
import ChangeTensionCommand from '@/common/commands/ChangeTensionCommand'
import { divideArray } from '@/common/utils/helper'

export default {
  name: 'Parameters',
  components: { Drawable },
  data() {
    return {
      TypeModeState: TypeModeState,
      drawMap: new Map(),
      typeContainerHeight: 250
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
    },
    // divideVolumeMap() {
    //   return this.divideFormatSvgPath(this.$store.state.change.volumeMap)
    // },
    scale() {
      return this.$store.getters['const/scale']
    }
  },
  methods: {
    cloneStateMap() {
      let stateMap = []
      // 开始画之前把之前的数据保存一份，用于撤销
      if (this.typeMode === TypeModeState.StateVolume) {
        stateMap = [...this.$store.state.change.volumeMap]
      } else if (this.typeMode === TypeModeState.StateTension) {
        stateMap = [...this.$store.state.change.tensionMap]
      }
      return stateMap
    },
    onDrawStart() {
      // 开始画之前把之前的数据保存一份，用于撤销
      this.drawBefore = this.cloneStateMap()
      // console.log(`onDrawStart, before:`, this.drawBefore)
    },
    onDraw(values) {
      // 一个完整的拖动，把每一小步合并存起来
      for (const [x, v] of values) {
        this.drawMap.set(x, v)
      }
      let stateMap = this.cloneStateMap()

      if (this.typeMode === TypeModeState.StateVolume) {
        const newStateMap = ChangeVolumeCommand.format(stateMap, this.drawMap)
        this.$store.commit('change/changeState', { volumeMap: newStateMap })
      } else if (this.typeMode === TypeModeState.StateTension) {
        const newStateMap = ChangeTensionCommand.format(stateMap, this.drawMap)
        this.$store.commit('change/changeState', { tensionMap: newStateMap })
      }
      // console.log(`onDraw, volumeMap:`, volumeMap, this.drawMap)
    },
    onDrawEnd() {
      const editor = Editor.getInstance()
      // Create a copy
      const draw = new Map(this.drawMap)
      if (this.typeMode === TypeModeState.StateVolume) {
        editor.execute(new ChangeVolumeCommand(editor, this.drawBefore, draw))
      } else if (this.typeMode === TypeModeState.StateTension) {
        editor.execute(new ChangeTensionCommand(editor, this.drawBefore, draw))
      }
      // 一次完整的操作结束后，把临时数据清空
      this.drawMap.clear()
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
    // divideFormatSvgPath(data) {
    //   let resultArr = []
    //   for (let i = 0; i < data.length; i += 1) {
    //     const x = Math.round(this.pitchWidth * i)
    //     let value = data[x]
    //     if (value === null || value === undefined) {
    //       value = 0
    //     }
    //     let y = this.db2PositionY(value)
    //     resultArr.push({
    //       x,
    //       y
    //     })
    //   }
    //   const divide = divideArray(99, resultArr)
    //   let classifyDraw = []
    //   for (let i = 0; i < divide.length; i += 1) {
    //     const item = divide[i]
    //     if (i < divide.length - 1) {
    //       item.push(divide[i + 1][0])
    //     }
    //     classifyDraw.push(this.drawFormatData(item))
    //   }
    //   return classifyDraw
    //   // return this.drawFormatData(resultArr)
    // },
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
      // console.log('drawFormatData:', resultArr)
      // 改成数组形式,优化下性能
      let result = []
      for (let i = 0; i < resultArr.length; i += 1) {
        const x = resultArr[i].x
        const y = resultArr[i].y
        if (i === 0) {
          result.push('M ')
        }

        if ((i - 1) % 3 === 0) {
          result.push('C ')
        }
        result.push(x)
        result.push(',')
        result.push(y)
        result.push(' ')
      }
      if (resultArr.length > 0) {
        const lastX = Math.round(resultArr[resultArr.length - 1].x)

        const mod = (resultArr.length - 1) % 3

        const size = mod === 0 ? 0 : 3 - mod

        for (let j = 0; j < size ; j += 1) {
          result.push(lastX)
          result.push(',')
          result.push(125)
          result.push(' ')
        }

        result.push('L')
        result.push(' ')
        result.push(lastX)
        result.push(',')
        result.push(125)
        result.push(' ')
        result.push(this.stageWidth)
        result.push(',')
        result.push(125)
        result.push(' ')
      }

      return result.join('')
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
.dpath {
  // transition: transform 2s ease-in-out 0.5s;
  transform-origin: left center;
  transform: transitionZ(0); // 开启硬件加速
}
</style>
