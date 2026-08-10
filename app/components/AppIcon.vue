<template>
  <view
    v-if="isCssIcon"
    :class="['app-icon', 'app-css-icon', `app-css-icon-${name}`]"
    :style="{ width: size, height: size }"
  />
  <image
    v-else
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
  },
  computed: {
    isCssIcon() {
      return ['plus', 'minus', 'close', 'check', 'check-light'].includes(this.name)
    }
  }
}
</script>

<style scoped>
.app-icon {
  flex: none;
  display: block;
}

.app-css-icon {
  position: relative;
  color: inherit;
}

.app-css-icon-plus::before,
.app-css-icon-plus::after,
.app-css-icon-minus::before,
.app-css-icon-close::before,
.app-css-icon-close::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 99rpx;
  background: currentColor;
  content: '';
  transform: translate(-50%, -50%);
}

.app-css-icon-plus::before,
.app-css-icon-minus::before {
  width: 68%;
  height: 2rpx;
}

.app-css-icon-plus::after {
  width: 2rpx;
  height: 68%;
}

.app-css-icon-close::before,
.app-css-icon-close::after {
  width: 72%;
  height: 2rpx;
}

.app-css-icon-close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.app-css-icon-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.app-css-icon-check::before,
.app-css-icon-check-light::before {
  position: absolute;
  top: 8%;
  left: 30%;
  width: 32%;
  height: 58%;
  border-right: 2rpx solid currentColor;
  border-bottom: 2rpx solid currentColor;
  content: '';
  transform: rotate(45deg);
}
</style>
