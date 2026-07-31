<template>
  <view v-if="open" class="popup-mask" @tap="$emit('close')">
    <view class="option-sheet" @tap.stop>
      <view class="sheet-handle" />
      <view class="sheet-head">
        <view>
          <text v-if="eyebrow" class="sheet-eyebrow">{{ eyebrow }}</text>
          <text class="sheet-title">{{ title }}</text>
        </view>
        <button class="sheet-close" aria-label="关闭" @tap="$emit('close')">
          <AppIcon name="close" size="25rpx" />
        </button>
      </view>
      <view class="option-list">
        <button
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          class="option-row"
          :class="{ selected: option.value === modelValue }"
          @tap="$emit('select', option.value)"
        >
          <image v-if="option.image" class="option-image" :src="option.image" mode="aspectFill" />
          <view v-else-if="option.icon" class="option-icon">
            <AppIcon :name="option.icon" size="29rpx" />
          </view>
          <view class="option-copy">
            <text>{{ option.label }}</text>
            <text v-if="option.description">{{ option.description }}</text>
          </view>
          <view class="option-check">
            <AppIcon v-if="option.value === modelValue" name="check-light" size="19rpx" />
          </view>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AppOptionSheet',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    eyebrow: { type: String, default: '请选择' },
    options: { type: Array, default: () => [] },
    modelValue: { type: [String, Number], default: '' }
  },
  emits: ['close', 'select'],
  computed: {
    normalizedOptions() {
      return this.options.map(option => {
        if (typeof option === 'object') return option
        return { label: option, value: option }
      })
    }
  }
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

.option-sheet {
  width: 100%;
  max-height: 72vh;
  padding: 14rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  overflow: hidden;
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
  padding-bottom: 18rpx;
  border-bottom: 1rpx solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet-head > view {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.sheet-eyebrow {
  color: var(--muted);
  font-size: 18rpx;
}

.sheet-title {
  font-size: 28rpx;
  font-weight: 600;
}

.sheet-close {
  width: 50rpx;
  height: 50rpx;
  border-radius: 16rpx;
  background: #f7efe2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-list {
  max-height: 52vh;
  padding-top: 13rpx;
  overflow-y: auto;
}

.option-row {
  width: 100%;
  min-height: 78rpx;
  padding: 11rpx 13rpx;
  border: 1rpx solid transparent;
  border-radius: 20rpx;
  display: grid;
  grid-template-columns: auto 1fr 36rpx;
  align-items: center;
  gap: 13rpx;
  text-align: left;
}

.option-row + .option-row {
  margin-top: 7rpx;
}

.option-row.selected {
  border-color: #e1bc84;
  background: #fbefd6;
}

.option-image,
.option-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 16rpx;
}

.option-image {
  border-radius: 50%;
}

.option-icon {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3rpx;
  font-size: 23rpx;
}

.option-copy text:last-child:not(:first-child) {
  color: var(--muted);
  font-size: 18rpx;
}

.option-check {
  width: 32rpx;
  height: 32rpx;
  border: 1rpx solid #dcc5a8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-row.selected .option-check {
  border-color: #bd8150;
  background: #bd8150;
}
</style>
