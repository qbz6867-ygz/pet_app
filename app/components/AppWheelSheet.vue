<template>
  <view v-if="open" class="popup-mask" @tap="$emit('close')">
    <view class="wheel-sheet" @tap.stop>
      <view class="sheet-handle" />
      <view class="sheet-head">
        <button @tap="$emit('close')">取消</button>
        <view>
          <text v-if="eyebrow" class="sheet-eyebrow">{{ eyebrow }}</text>
          <text class="sheet-title">{{ title }}</text>
        </view>
        <button class="confirm" @tap="$emit('confirm')">确定</button>
      </view>
      <picker-view
        class="wheel-picker"
        indicator-style="height: 52px; border-top: 1px solid #eadcc8; border-bottom: 1px solid #eadcc8;"
        :value="value"
        @change="$emit('change', $event.detail.value)"
      >
        <picker-view-column v-for="(column, columnIndex) in columns" :key="columnIndex">
          <view v-for="item in column" :key="String(item)">
            {{ item }}{{ suffixes[columnIndex] || '' }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AppWheelSheet',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    eyebrow: { type: String, default: '滑动选择' },
    columns: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    suffixes: { type: Array, default: () => [] }
  },
  emits: ['close', 'change', 'confirm']
}
</script>

<style scoped>
.popup-mask {
  position: fixed;
  z-index: 80;
  inset: 0;
  padding: 24rpx;
  background: rgba(74, 59, 48, .34);
  display: flex;
  align-items: flex-end;
}

.wheel-sheet {
  width: 100%;
  padding: 14rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  border: 1rpx solid rgba(215, 185, 143, .45);
  border-radius: 36rpx;
  background: #fffdf9;
  box-shadow: 0 24rpx 70rpx rgba(67, 50, 37, .18);
}

.sheet-handle {
  width: 54rpx;
  height: 6rpx;
  margin: 0 auto 17rpx;
  border-radius: 999rpx;
  background: #e7d9c8;
}

.sheet-head {
  min-height: 72rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid var(--line-soft);
  display: grid;
  grid-template-columns: 100rpx 1fr 100rpx;
  align-items: center;
  text-align: center;
}

.sheet-head > view {
  display: flex;
  flex-direction: column;
  gap: 3rpx;
}

.sheet-head > button:first-child {
  color: var(--muted);
  text-align: left;
}

.sheet-head .confirm {
  color: var(--brand-dark);
  font-weight: 600;
  text-align: right;
}

.sheet-eyebrow {
  color: var(--muted);
  font-size: 18rpx;
}

.sheet-title {
  font-size: 32rpx;
  font-weight: 600;
}

.wheel-picker {
  height: 360rpx;
  margin-top: 10rpx;
}

.wheel-picker view {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #745d4d;
  font-size: 28rpx;
}
</style>
