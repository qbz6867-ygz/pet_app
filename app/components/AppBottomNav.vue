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
    <view class="safe-bottom" />
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
        { key: 'home', label: '首页', icon: 'home', url: '/pages/home/index' },
        { key: 'records', label: '记录', icon: 'records', url: '/pages/records/index' },
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
  left: 28rpx;
  right: 28rpx;
  bottom: 24rpx;
  min-height: 140rpx;
  padding: 16rpx 18rpx 12rpx;
  border: 1rpx solid var(--line);
  border-radius: 46rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(91, 67, 48, 0.11);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  border-radius: 17rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item.active {
  color: #a87345;
  font-weight: 700;
}

.nav-item.active .nav-icon {
  background: #f7e3b8;
}
</style>
