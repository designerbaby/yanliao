<template>
  <div :class="$style.list" 
    :style="{
      left: `${left}px`,
      top: `${top}px`
    }">
    <img src="@/assets/audioEditor/arrow-black.png">
    <div :class="[$style.edit, $style.delete]" @click.stop="toDeletePitch">删除</div>
    <div :class="$style.edit" @click.stop="editLyric(index)">编辑歌词</div>
    <div :class="[$style.edit, $style.delete]" @click.stop="editLyric(-1)">批量编辑歌词</div>
  </div>
</template>

<script>
export default {
  name: 'BeatList',
  props: {
    index: Number
  },
  data() {
    return {
      left: 0,
      top: 0
    }
  },
  methods: {
    setPosition(left, top) {
      this.left = left
      this.top = top
    },
    toDeletePitch() {
      this.$emit('deletePitch', this.index)
    },
    editLyric(index) {
      this.$emit('editLyric', index)
    }
  }
}
</script>

<style lang="less" module>
.list {
  width: 104px;
  background: #151517;
  box-shadow: -4px 4px 10px 0 rgba(0,0,0, 0.30);
  border-radius: 8px;
  position: absolute;
  // top: 38px;
  // right: -80px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  z-index: 20; // 右键编辑菜单的层级
  img {
    width: 14px;
    height: 8px;
    position: absolute;
    left: 6px;
    top: -8px;
  }
}
.edit {
  height: 44px;
  line-height: 44px;
  margin: 8px 0 0 0;
  &:hover {
    background: #1C1C1E;
    border-radius: 8px;
  }
  &:active {
    background: #0E0E0F;
    border-radius: 8px;
  }
}

.delete {
  margin: 0 0 8px 0;
}
</style>
