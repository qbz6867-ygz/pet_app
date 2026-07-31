<template>
  <view class="topbar" :class="{ centered: center }">
    <slot name="left">
      <button v-if="back" class="topbar-action" aria-label="返回" @tap="goBack">
        <AppIcon name="back" size="34rpx" />
      </button>
      <view v-else class="topbar-space" />
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
export default {
  name: 'AppTopBar',
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    back: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    actionIcon: { type: String, default: '' },
    actionLabel: { type: String, default: '' },
    badge: { type: [String, Number], default: '' }
  },
  emits: ['action'],
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
  min-height: 188rpx;
  padding-top: calc(env(safe-area-inset-top) + 88rpx);
  display: grid;
  grid-template-columns: 72rpx 1fr 72rpx;
  align-items: center;
}

.topbar-copy {
  min-width: 0;
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
  height: 64rpx;
  border: 1rpx solid var(--line);
  border-radius: 20rpx;
  background: #fffaf3;
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
  font-size: 17rpx;
  line-height: 30rpx;
}
</style>
