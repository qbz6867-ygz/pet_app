<template>
  <view class="page no-tab">
    <AppTopBar title="家庭码" back />

    <view class="card code-card">
      <view class="code-info">
        <view><text class="section-kicker">专属凭证</text><text class="section-title">家庭码</text></view>
        <text class="pill">长期有效</text>
      </view>
      <view class="code-row">
        <text class="invite-code">{{ familyCode }}</text>
        <button class="copy-button" @tap="copyCode">
          <text>{{ copied ? '已复制' : '复制' }}</text>
          <AppIcon v-if="copied" name="check-light" size="21rpx" />
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() { return { copied: false, familyCode: '' } },
  onLoad(options) { this.familyCode = options.code || '' },
  methods: {
    copyCode() {
      uni.setClipboardData({ data: this.familyCode, success: () => { this.copied = true } })
    }
  }
}
</script>

<style scoped>
.code-card { padding: 22rpx 24rpx; }
.code-info { display: flex; align-items: center; justify-content: space-between; }
.code-info > view { display: flex; flex-direction: column; gap: 3rpx; }
.code-row { min-height: 78rpx; margin-top: 16rpx; padding: 0 10rpx 0 20rpx; border: 1rpx solid #ead7ba; border-radius: 20rpx; background: #fbf5e9; display: flex; align-items: center; justify-content: space-between; }
.invite-code { color: #76523a; font-size: 36rpx; font-weight: 650; letter-spacing: 7rpx; }
.copy-button { min-width: 100rpx; height: 56rpx; padding: 0 16rpx; border-radius: 16rpx; color: white; background: #b77a49; display: flex; align-items: center; justify-content: center; gap: 6rpx; font-size: 22rpx; }
</style>
