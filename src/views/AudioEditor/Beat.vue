<template>
  <div :class="[$style.beat,  { [$style.fixed]: isExceedHeader }]" @click="toShowBeat">
    {{ beatForm.fenzi }}/{{ beatForm.fenmu }}
  </div>
</template>

<script>
export default {
  name: 'Beat',
  computed: {
    beatForm() {
      return this.$store.state.beatForm
    },
    isExceedHeader() {
      return this.$store.state.isExceedHeader
    }
  },
  data() {
    return {}
  },
  methods: {
    toShowBeat() {
      this.$emit('showBeat')
    }
  }
}
</script>

<style lang="less" module>
.beat {
  position: absolute;
  color: #fff;
  font-size: 13px;
  width: 50px;
  height: 25px;
  line-height: 25px;
  text-align: center;
}
.fixed {
 position: fixed; 
 z-index: 100;
 top: 78px;
 background-color: #373736;
}
</style>
