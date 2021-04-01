<template>
  <div :class="$style.modal" @click.stop="close">
    <transition name="modal">
      <div :class="$style.wrap">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'modal',
  data () {
    return {
    }
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" module>

.modal {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background: rgba(#000, 0.5);
}

.wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  bottom: 0;
  z-index: 1001;
  background-color: transparent;
}

</style>
