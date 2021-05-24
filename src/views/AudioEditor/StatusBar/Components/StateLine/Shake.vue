<template>
  <div :class="[$style.shake, visible ? '' : $style.small]">
    <div :class="$style.header">
      <div>
        <span>颤音周期： {{shakeOption.cycle.toFixed(1)}}小格</span>
        <span>颤音振幅： {{shakeOption.swing.toFixed(1)}}半音</span>
      </div>
      <img :class="$style.header.circle"
           src="@/assets/shake/circle.png"
           alt=""
           @click="show">
    </div>
    <div :class="[$style.content, visible ? '' : $style.small]">
      <div :class="$style.preview">
        <div :class="$style.container">
          <div :class="$style.row">
            <div :class="$style.gray"></div>
            <div :class="$style.black"></div>
            <div :class="$style.gray"></div>
            <div :class="$style.black"></div>
            <div :class="$style.gray"></div>
            <div :class="$style.black"></div>
          </div>
          <div :class="$style.column">
            <div :class="$style.fenziCon">
              <div :class="$style.fenzi"
                   v-for="i in 2"
                   :key="i">
                <div :class="$style.fenmu"
                     v-for="j in 8"
                     :key="j"></div>
              </div>
            </div>
          </div>
        </div>
        <svg>
          <g>
            <!-- <path d="M0 50 C 40 10, 60 10, 100 50 C 140 90, 160 90, 200 50" stroke="white" fill="transparent" stroke-linejoin="round"/> -->
            <path v-for="(item, index) in dn"
                  :d="genStr(index)"
                  stroke="white"
                  fill="transparent"
                  stroke-linejoin="round" />
          </g>
        </svg>
      </div>
      <div :class="$style.slider">
        <div>
          <span>颤音周期</span>
          <p>
            <Slider :show-tooltip="false" v-model="cycle"></Slider>
          </p>
          <span>{{shakeOption.cycle.toFixed(1)}}小格</span>
        </div>
        <div>
          <span>颤音振幅</span>
          <p>
            <Slider :show-tooltip="false" v-model="swing"></Slider>
          </p>
          <span>{{shakeOption.swing.toFixed(1)}}半音</span>
        </div>
      </div>
      <div :class="$style.footer">
        <p>注：周期单位“1小格”等于最小格的宽度</p>
        <p>&nbsp;&nbsp;振幅单位“1半音”即是1个音名对应的1行的高度</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Slider } from 'element-ui'

const LOCAL = {
  OY: 75, // svg起点坐标
  YN: 16, // 示意图最大音符个数
  NW: 20, // 音符宽度
  NH: 25, // 音符高度
  MT: 8,  // 最大周期
  MS: 2,  // 最大振幅
}

export default {
  data: () => ({
    cycle: 0,
    swing: 0,
    visible: false
  }),
  computed: {
    ...mapState('const', ['shakeOption']),
    dn() {
      return Math.ceil(LOCAL.YN / this.shakeOption.cycle)
    }
  },
  watch: {
    cycle(val) {
      this.$store.dispatch('const/changeState', { shakeOption: { ...this.shakeOption, cycle: Number((val / 100 * LOCAL.MT).toFixed(1)) } })
    },
    swing(val) {
      this.$store.dispatch('const/changeState', { shakeOption: { ...this.shakeOption, swing: Number((val / 100 * LOCAL.MS).toFixed(1)) } })
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.cycle = (this.shakeOption.cycle / LOCAL.MT) * 100
      this.swing = (this.shakeOption.swing / LOCAL.MS) * 100
    },
    genStr(I) {
      const O = LOCAL.OY
      const T = LOCAL.NW * this.shakeOption.cycle
      let A = LOCAL.NH * this.shakeOption.swing
      // 根据正弦svg 按比例计算 d = M0 50  C 40 10, 60 10, 100 50 C 140 90, 160 90, 200 50
      const str = `M${I * T} ${O} 
            C ${I * T + (40 / 200) * T} ${O - ((A * 4) / 3) * Math.sin((4 / 10) * Math.PI)}, 
            ${I * T + (60 / 200) * T} ${O - ((A * 4) / 3) * Math.sin((6 / 10) * Math.PI)}, 
            ${I * T + T / 2} ${O} 
            C ${I * T + (140 / 200) * T} ${O - ((A * 4) / 3) * Math.sin((14 / 10) * Math.PI)}, 
            ${I * T + (160 / 200) * T} ${O - ((A * 4) / 3) * Math.sin((16 / 10) * Math.PI)}, 
            ${I * T + T} ${O}`
      return str
    },
    show() {
      this.visible = !this.visible
    }
  },
  components: { Slider }
}
</script>
<style lang="less" module>
.shake {
  position: absolute;
  z-index: 1000;
  left: 80px;
  top: 45px;
  width: 352px;
  height: 392px;
  background: #323232;
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0, 0.2, 0.2, 1);

  &.small {
    width: 275px;
    height: 38px;
    padding-right: 12px;
    transition: all 0.15s cubic-bezier(0, 0.2, 0.2, 1) 0.1s;

    img {
      transform: rotate(0deg);
      transition: transform 0.15s cubic-bezier(0, 0.2, 0.2, 1) 0.1s;
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 14px;

  span:last-child {
    margin-left: 16px;
  }

  img {
    width: 12px;
    height: 12px;
    transform: rotate(180deg);
    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
}

.content {
  min-width: 320px;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s;

  &.small {
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
}

.preview {
  position: relative;
  margin-top: 20px;

  svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.slider {
  color: #ffffff;

  > div {
    margin-top: 24px;
    display: flex;
    align-items: center;
    line-height: 16px;
  }

  p {
    width: 198px;
    margin: 0 16px;
  }
}

.footer {
  margin-top: 32px;
  color: rgba(255, 255, 255, 0.6);

  p:last-child {
    padding-left: 24px;
  }
}

.container {
  position: relative;
  border-top: 1px solid #1d1d1d;
  border-right: 1px solid #1d1d1d;
}
.row {
  position: relative;
}

.gray {
  background: #2d2d2d;
  height: 25px;
  border-bottom: 1px solid #1d1d1d;
}

.black {
  height: 25px;
  background: #232323;
}

.fenziCon {
  display: flex;
}
.column {
  position: absolute;
  top: 0px;
  left: 0px;
  background: transparent;
  display: flex;
}

.fenzi {
  background: transparent;
  display: flex;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: #1d1d1d;
  }
}
.fenmu {
  border-left: 1px solid #272727;
  background: transparent;
  width: 20px;
  height: 150px;
}
</style>

<style lang='less' scoped>
/deep/ .el-slider {
  &__runway {
    background: #181818;
    border-radius: 3px;
    height: 3px;
  }
  &__bar {
    background: rgba(255, 255, 255, 0.6);
    height: 3px;
  }
  &__button-wrapper {
    width: 33px;
    height: 33px;
  }
  &__button {
    width: 9px;
    height: 9px;
    background: #d0d0d0;
    border: 2px solid #181818;
  }
}
</style>