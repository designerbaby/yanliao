<template>
  <transition name="speedy">
    <div :class="[$style.SpeedyDialog, isExceedHeader ? $style.isFloat : '']"
         :style="{ height: `${stageHeight + 25}px`}"
         v-show="visible">
      <div :class="$style.top">
        <div :class="$style.title">快捷键列表</div>
        <img src="@/assets/audioEditor/close.png"
             @click.stop="show">
      </div>
      <ul :class="$style.ul">
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/batch.png"
                 alt="">
            <span>批量选择</span>
          </div>
          <div :class="$style.word">
            <p>Shift</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/play.png"
                 alt="">
            <span>播放</span>
          </div>
          <div :class="$style.word">
            <p>空格键</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/delete.png"
                 alt="">
            <span>删除</span>
          </div>
          <div :class="$style.word">
            <p>Delete</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/draw.png"
                 alt="">
            <span>撤回</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>Z</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/copy.png"
                 alt="">
            <span>复制</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>C</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/paste.png"
                 alt="">
            <span>粘贴</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>V</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/all.png"
                 alt="">
            <span>全选</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>A</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/lyric.png"
                 alt="">
            <span>歌词</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>L</p>
          </div>
        </li>
        <li>
          <div :class="$style.txt">
            <img src="@/assets/speedy/all-lyric.png"
                 alt="">
            <span>全部歌词</span>
          </div>
          <div :class="$style.word">
            <p>Ctrl</p>
            <span>+</span>
            <p>Shift</p>
            <span>+</span>
            <p>L</p>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SideState } from '@/common/utils/const'

export default {
  name: 'SpeedyDialog',
  data() {
    return {
    }
  },
  computed: {
    ...mapState('const', ['isExceedHeader', 'sideMode']),
    ...mapGetters('const', ['stageHeight']),
    visible() {
      return this.sideMode === SideState.Speedy
    }
  },
  methods: {
    show() {
      this.$store.dispatch('const/changeState', { sideMode: this.visible ? SideState.None : SideState.Speedy })
    }
  }
}
</script>

<style lang="less" module>
.SpeedyDialog {
  color: #fff;
  width: 316px;
  top: 78px;
  background: #323232;
  box-shadow: -8px 0 8px -8px rgb(0, 0, 0, 0.3);
  position: absolute;
  right: 0;
  transition: right 0.2s linear;
  z-index: 2001; // 编辑拍号的层级
  &.isFloat {
    position: fixed;
  }
}

.top {
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  img {
    width: 24px;
    height: 24px;
    margin: 0 24px 0 0;
    cursor: pointer;
  }
}

.title {
  font-size: 16px;
  margin: 0 0 0 24px;
}

.ul {
  padding: 8px 28px 8px 24px;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: rgba(255,255,255,0.80);
    height: 44px;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.04);
  }
}

.txt {
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
}

.word {
  display: flex;
  align-items: center;
  font-size: 12px;

  p {
    padding: 4px 7px;
    background: rgba(255,255,255,0.07);
    border-radius: 4px;
    border-radius: 4px;
    margin-left: 6px;

    &:first-child {
      margin-left: 0;
    }
  }

  span {
    margin-left: 6px;
  }
}
</style>
<style scoped>
.speedy-enter-active, .speedy-leave-active {
  right: 0;
}
.speedy-enter, .speedy-leave-active {
  right: -316px;
}
</style>
