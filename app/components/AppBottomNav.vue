<template>
  <view class="bottom-nav">
    <button
      v-for="item in items"
      :key="item.key"
      class="nav-item"
      :class="{ active: active === item.key }"
      @tap="switchPage(item)"
    >
      <view class="nav-icon"><AppIcon :name="item.icon" size="40rpx" /></view>
      <text>{{ item.label }}</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'AppBottomNav',
  props: {
    active: { type: String, required: true }
  },
  data() {
    return {
      items: [
        { key: 'wiki', label: '百科', icon: 'book', url: '/pages/wiki/index' },
        { key: 'profile', label: '我的', icon: 'user', url: '/pages/profile/index' }
      ]
    }
  },
  methods: {
    switchPage(item) {
      if (item.key === this.active) return
      uni.reLaunch({ url: item.url })
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 140rpx;
  padding: 16rpx 18rpx calc(12rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--line);
  background: #ffffff;
  box-shadow: 0 -8rpx 24rpx rgba(91, 67, 48, 0.075);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.nav-item {
  min-height: 94rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
  color: #8f7d70;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1;
}

.nav-icon {
  width: 62rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item.active {
  color: #a87345;
  font-weight: 700;
}
</style>
