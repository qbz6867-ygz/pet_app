<template>
  <view class="page no-tab">
    <AppTopBar title="系统设置" back />

    <view class="card settings-card">
      <view class="settings-heading">
        <text class="section-kicker">健康记录</text>
        <text class="section-title">打卡记录方式</text>
      </view>

      <view v-for="group in groups" :key="group.key" class="setting-group">
        <view class="setting-label">
          <view class="setting-icon"><AppIcon :name="group.icon" size="34rpx" /></view>
          <view class="setting-copy">
            <text class="setting-name">{{ group.label }}</text>
            <text class="muted">{{ group.desc }}</text>
          </view>
        </view>
        <view class="segmented">
          <button
            v-for="option in group.options"
            :key="option.value"
            :class="{ active: settings[group.key] === option.value }"
            @tap="selectUnit(group.key, option.value)"
          >
            {{ option.label }}
          </button>
        </view>
      </view>

      <text class="settings-tip">切换后，首页健康打卡将按所选方式填写。</text>
    </view>

    <view class="card other-settings">
      <button><text>消息通知</text><switch checked color="#bd7d45" /></button>
      <button><text>仅在 Wi-Fi 下加载图片</text><switch color="#bd7d45" /></button>
      <button><text>清理缓存</text><view class="cache-meta"><text class="muted">18.6 MB</text><AppIcon name="chevron-right" size="21rpx" /></view></button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() {
    return {
      settings: { food: 'status', water: 'status', walk: 'minute' },
      groups: [
        { key: 'food', label: '食量', icon: 'meal', desc: '精确克数或大概状态', options: [{ label: 'g', value: 'g' }, { label: '状态', value: 'status' }] },
        { key: 'water', label: '饮水', icon: 'water', desc: '精确毫升或大概状态', options: [{ label: 'ml', value: 'ml' }, { label: '状态', value: 'status' }] },
        { key: 'walk', label: '遛弯', icon: 'paw', desc: '按时长或距离记录', options: [{ label: '分钟', value: 'minute' }, { label: '公里', value: 'km' }] }
      ]
    }
  },
  onLoad() {
    this.settings = uni.getStorageSync('healthSettings') || this.settings
  },
  methods: {
    selectUnit(key, value) {
      this.settings[key] = value
      uni.setStorageSync('healthSettings', this.settings)
    }
  }
}
</script>

<style scoped>
.settings-card {
  padding: 42rpx 28rpx 24rpx;
  border-color: #eadfce;
  border-radius: 34rpx;
}

.settings-heading {
  padding: 0 2rpx 24rpx;
  border-bottom: 1rpx solid var(--line-soft);
}

.settings-heading .section-kicker {
  margin-bottom: 12rpx;
  font-size: 20rpx;
}

.settings-heading .section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 500;
}

.setting-group {
  min-height: 102rpx;
  padding: 18rpx 12rpx;
  border-bottom: 1rpx solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.setting-label {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.setting-icon {
  width: 64rpx;
  height: 64rpx;
  flex: 0 0 64rpx;
  border: 1rpx solid #e7d6bd;
  border-radius: 20rpx;
  background: #fffaf1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.setting-name {
  color: #5f4b3e;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.2;
}

.setting-label .muted {
  font-size: 19rpx;
  line-height: 1.35;
  white-space: nowrap;
}

.segmented {
  width: 180rpx;
  min-height: 62rpx;
  padding: 6rpx;
  border: 1rpx solid #e6d8c4;
  border-radius: 22rpx;
  background: #f6efe4;
  display: flex;
  flex: 0 0 180rpx;
}

.segmented button {
  min-width: 0;
  flex: 1;
  border-radius: 16rpx;
  color: #987d68;
  font-size: 20rpx;
  font-weight: 500;
  line-height: 50rpx;
  text-align: center;
}

.segmented button.active {
  color: #805332;
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(101, 73, 48, 0.09);
  font-weight: 600;
}

.settings-tip {
  display: block;
  padding: 18rpx 12rpx 2rpx;
  color: var(--muted);
  font-size: 19rpx;
  line-height: 1.5;
}

.other-settings { margin-top: 22rpx; padding: 4rpx 22rpx; }
.other-settings button { width: 100%; min-height: 90rpx; border-bottom: 1rpx solid var(--line-soft); display: flex; align-items: center; justify-content: space-between; text-align: left; }
.other-settings button:last-child { border-bottom: 0; }
.cache-meta { display: flex; align-items: center; gap: 3rpx; }
</style>
