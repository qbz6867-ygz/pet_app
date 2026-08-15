<template>
  <image
    class="app-icon"
    :src="iconSource"
    :style="{ width: size, height: size }"
    mode="aspectFit"
  />
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    name: { type: String, required: true },
    size: { type: String, default: '32rpx' }
  },
  computed: {
    iconSource() {
      return `/static/icons/${this.name}.${this.name.startsWith('star-') ? 'svg' : 'png'}`
    }
  }
}
</script>

<style scoped>
.app-icon {
  flex: none;
  display: block;
}

</style>
