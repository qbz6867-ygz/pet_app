<template>
  <view class="page no-tab message-detail-page">
    <AppTopBar title="消息详情" back />

    <view v-if="message" class="message-content">
      <view class="message-meta">
        <view class="message-icon"><AppIcon :name="message.icon" size="42rpx" /></view>
        <view class="meta-copy">
          <text class="message-category">{{ message.category }}</text>
          <text class="message-time">{{ message.fullTime }}</text>
        </view>
      </view>

      <text class="message-title">{{ message.title }}</text>
      <text class="message-body">{{ message.body }}</text>
    </view>

    <view v-else class="empty-state">
      <AppIcon name="bell" size="64rpx" />
      <text>未找到这条消息</text>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { getMessages } from '../../common/messages.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      message: null
    }
  },
  onLoad(options) {
    this.message = getMessages().find(item => item.id === Number(options.id)) || null
  }
}
</script>

<style scoped>
.message-content {
  padding: 20rpx 4rpx 0;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.message-icon {
  width: 76rpx;
  height: 76rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-copy {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.message-category {
  color: var(--brand-dark);
  font-size: 22rpx;
  font-weight: 500;
}

.message-time {
  color: var(--muted);
  font-size: 18rpx;
}

.message-title {
  display: block;
  margin-top: 30rpx;
  color: var(--ink);
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.4;
}

.message-body {
  display: block;
  margin-top: 20rpx;
  padding-top: 22rpx;
  border-top: 1rpx solid var(--line);
  color: #715e51;
  font-size: 28rpx;
  line-height: 1.8;
}

.empty-state {
  min-height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  color: var(--muted);
}
</style>
