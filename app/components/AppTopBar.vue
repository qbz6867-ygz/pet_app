<template>
  <view class="topbar" :class="{ centered: center, 'flush-left': flushLeft }" :style="navigationStyle">
    <slot name="left">
      <button v-if="back" class="topbar-action" aria-label="返回" @tap="goBack">
        <AppIcon name="back" size="34rpx" />
      </button>
      <view v-else class="topbar-space" :class="{ collapsed: flushLeft }" />
    </slot>
    <view class="topbar-copy">
      <text v-if="eyebrow" class="topbar-eyebrow">{{ eyebrow }}</text>
      <text class="topbar-title">{{ title }}</text>
    </view>
    <button v-if="actionIcon" class="topbar-action" :aria-label="actionLabel" @tap="$emit('action')">
      <AppIcon :name="actionIcon" size="32rpx" />
      <text v-if="badge" class="topbar-badge">{{ badge }}</text>
    </button>
    <view v-else class="topbar-space" />
  </view>
</template>

<script>
import { getNavigationStyle } from '../common/navigation.js'

export default {
  name: 'AppTopBar',
  data() {
    return {
      navigationStyle: getNavigationStyle()
    }
  },
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    back: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    flushLeft: { type: Boolean, default: false },
    actionIcon: { type: String, default: '' },
    actionLabel: { type: String, default: '' },
    badge: { type: [String, Number], default: '' }
  },
  emits: ['action'],
  mounted() {
    if (typeof uni.onWindowResize !== 'function') return
    this.navigationResizeHandler = () => {
      this.navigationStyle = getNavigationStyle()
    }
    uni.onWindowResize(this.navigationResizeHandler)
  },
  beforeUnmount() {
    if (this.navigationResizeHandler && typeof uni.offWindowResize === 'function') {
      uni.offWindowResize(this.navigationResizeHandler)
    }
  },
  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) uni.navigateBack()
      else uni.reLaunch({ url: '/pages/home/index' })
    }
  }
}
</script>

<style scoped>
.topbar {
  position: -webkit-sticky;
  position: sticky;
  z-index: 40;
  top: 0;
  min-height: 188rpx;
  margin: 0 -40rpx 24rpx;
  padding: calc(env(safe-area-inset-top) + 102rpx) 40rpx 20rpx;
  box-sizing: border-box;
  background: var(--paper);
  box-shadow: 0 10rpx 24rpx rgba(91, 67, 48, .045);
  display: grid;
  grid-template-columns: var(--menu-side-width, 72rpx) minmax(0, 1fr) var(--menu-side-width, 72rpx);
  grid-auto-rows: var(--menu-button-height, 64rpx);
  align-items: center;
}

.topbar-copy {
  min-width: 0;
}

.topbar.flush-left {
  grid-template-columns: 0 minmax(0, 1fr) var(--menu-side-width, 72rpx);
}

.topbar-space.collapsed {
  width: 0;
}

.topbar.centered .topbar-copy {
  text-align: center;
}

.topbar-eyebrow {
  display: block;
  margin-bottom: 2rpx;
  color: #c3764c;
  font-size: 18rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
}

.topbar-title {
  display: block;
  overflow: hidden;
  color: var(--ink);
  font-size: 36rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-action {
  position: relative;
  width: 64rpx;
  height: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-dark);
  font-size: 36rpx;
  line-height: 1;
}

.topbar-space {
  width: 64rpx;
}

.topbar-badge {
  position: absolute;
  top: -8rpx;
  right: -6rpx;
  min-width: 30rpx;
  height: 30rpx;
  padding: 0 7rpx;
  border: 4rpx solid var(--paper);
  border-radius: 999rpx;
  color: white;
  background: #d47755;
  font-size: 18rpx;
  line-height: 30rpx;
}
</style>
