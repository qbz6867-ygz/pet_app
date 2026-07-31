<template>
  <image
    class="app-icon"
    :src="`/static/icons/${name}.png`"
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
  }
}
</script>

<style scoped>
.app-icon {
  flex: none;
  display: block;
}
</style>
