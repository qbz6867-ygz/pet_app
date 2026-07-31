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
import { messages } from '../../common/messages.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      messages: messages.map(item => ({ ...item }))
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
  border: 1rpx solid #eadcc7;
  border-radius: 26rpx;
  background: var(--gold-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-copy { min-width: 0; display: flex; flex-direction: column; gap: 8rpx; padding-right: 12rpx; }
.message-title { font-size: 22rpx; font-weight: 600; }
.message-time { flex-shrink: 0; color: var(--muted); font-size: 16rpx; }
.message-body { color: #7d6b5e; font-size: 18rpx; line-height: 1.55; }
.message-category { color: var(--brand-dark); font-size: 16rpx; }
.unread-dot { position: absolute; top: 26rpx; right: 16rpx; width: 12rpx; height: 12rpx; border-radius: 50%; background: #e8a17f; }
.message-arrow { position: absolute; right: 18rpx; bottom: 22rpx; color: var(--muted); }
</style>
