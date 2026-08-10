<template>
  <view class="page no-tab">
    <AppTopBar title="消息提醒" back />

    <view class="message-list">
      <button v-for="message in messages" :key="message.id" class="message-item card" @tap="openMessage(message)">
        <view class="message-icon"><AppIcon :name="message.icon" size="29rpx" /></view>
        <view class="message-copy">
          <view class="row-between">
            <text class="message-title">{{ message.title }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
          <text class="message-body">{{ message.body }}</text>
          <text class="message-category">{{ message.category }}</text>
        </view>
        <AppIcon class="message-arrow" name="chevron-right" size="22rpx" />
        <text v-if="message.unread" class="unread-dot" />
      </button>
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
      messages: getMessages()
    }
  },
  methods: {
    openMessage(message) {
      message.unread = false
      uni.navigateTo({ url: `/pages/messages/detail?id=${message.id}` })
    }
  }
}
</script>

<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.message-item {
  position: relative;
  width: 100%;
  padding: 26rpx;
  display: grid;
  grid-template-columns: 84rpx 1fr;
  gap: 22rpx;
  text-align: left;
}

.message-icon {
  width: 84rpx;
  height: 84rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-copy { min-width: 0; display: flex; flex-direction: column; gap: 10rpx; padding-right: 12rpx; }
.message-title { font-size: 32rpx; font-weight: 600; line-height: 1.35; }
.message-time { flex-shrink: 0; margin-left: 12rpx; color: var(--muted); font-size: 24rpx; line-height: 1.4; }
.message-body { color: #7d6b5e; font-size: 28rpx; line-height: 1.6; }
.message-category { color: var(--brand-dark); font-size: 24rpx; line-height: 1.4; }
.unread-dot { position: absolute; top: 26rpx; right: 16rpx; width: 12rpx; height: 12rpx; border-radius: 50%; background: #e8a17f; }
.message-arrow { position: absolute; right: 18rpx; bottom: 22rpx; color: var(--muted); }
</style>
