<template>
  <view v-if="open" class="dialog-mask" @tap="$emit('close')">
    <view class="dialog-card" @tap.stop>
      <view class="dialog-icon">
        <AppIcon :name="icon" size="36rpx" />
      </view>
      <text class="dialog-title">{{ title }}</text>
      <text class="dialog-message">{{ message }}</text>
      <view class="dialog-actions">
        <button @tap="$emit('close')">{{ cancelText }}</button>
        <button :class="{ danger }" @tap="$emit('confirm')">{{ confirmText }}</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AppConfirmDialog',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    message: { type: String, required: true },
    icon: { type: String, default: 'help' },
    cancelText: { type: String, default: '取消' },
    confirmText: { type: String, default: '确定' },
    danger: { type: Boolean, default: false }
  },
  emits: ['close', 'confirm']
}
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  z-index: 90;
  inset: 0;
  padding: 40rpx;
  background: rgba(74, 59, 48, .36);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-card {
  width: 100%;
  max-width: 590rpx;
  padding: 34rpx 30rpx 26rpx;
  border: 1rpx solid rgba(215, 185, 143, .45);
  border-radius: 34rpx;
  background: #fffdf9;
  box-shadow: 0 24rpx 70rpx rgba(67, 50, 37, .2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dialog-icon {
  width: 66rpx;
  height: 66rpx;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title {
  margin-top: 18rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.dialog-message {
  margin-top: 10rpx;
  color: var(--muted);
  font-size: 22rpx;
  line-height: 1.65;
}

.dialog-actions {
  width: 100%;
  margin-top: 28rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.dialog-actions button {
  height: 66rpx;
  border: 1rpx solid #e5d4bd;
  border-radius: 18rpx;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-actions button:last-child {
  border-color: #ddbd87;
  background: #ebcc91;
  font-weight: 600;
}

.dialog-actions button.danger {
  border-color: #efc2ba;
  color: #b45c50;
  background: #fff3ef;
}
</style>
