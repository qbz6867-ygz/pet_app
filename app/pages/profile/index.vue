<template>
  <view class="page profile-page">
    <button class="account-entry" @tap="openAccount">
      <view class="account-avatar" :class="{ guest: !loggedIn }">
        <image v-if="loggedIn && session.avatar" :src="session.avatar" mode="aspectFill" />
        <text v-else-if="loggedIn">{{ session.avatarText || session.name.slice(0, 1) }}</text>
        <AppIcon v-else name="user" size="52rpx" />
      </view>
      <text class="account-name">{{ loggedIn ? session.name : '微信登录中' }}</text>
      <view class="account-link">
        <text>{{ loggedIn ? '查看和修改个人资料' : '正在获取微信授权' }}</text>
        <AppIcon name="chevron-right" size="20rpx" />
      </view>
      <view class="account-accent" />
    </button>

    <view class="menu-list">
      <button class="menu-row card" @tap="openHelp">
        <view class="menu-icon"><AppIcon name="help" size="28rpx" /></view>
        <text>帮助与反馈</text>
        <text class="menu-meta" />
        <AppIcon name="chevron-right" size="22rpx" />
      </button>
    </view>

    <text class="version">宠物百科 · v1.0.0</text>
    <AppBottomNav active="profile" />
  </view>
</template>

<script>
import AppBottomNav from '../../components/AppBottomNav.vue'
import { ensureWechatSession } from '../../common/auth.js'

export default {
  components: { AppBottomNav },
  data() {
    return { session: {} }
  },
  computed: {
    loggedIn() {
      return Boolean(this.session && this.session.loggedIn)
    }
  },
  onShow() {
    this.loadWechatSession()
  },
  methods: {
    async loadWechatSession() {
      try {
        this.session = await ensureWechatSession()
      } catch (error) {
        this.session = {}
        uni.showToast({ title: '微信登录失败，请稍后重试', icon: 'none' })
      }
    },
    async openAccount() {
      if (!this.loggedIn) await this.loadWechatSession()
      if (this.loggedIn) uni.navigateTo({ url: '/pages/profile/info' })
    },
    openHelp() {
      uni.navigateTo({ url: '/pages/profile/help' })
    }
  }
}
</script>

<style scoped>
.profile-page { padding-top: calc(env(safe-area-inset-top) + 96rpx); }
.account-entry {
  width: 100%;
  min-height: 330rpx;
  padding: 30rpx 20rpx 38rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.account-avatar {
  width: 116rpx;
  height: 116rpx;
  overflow: hidden;
  border: 7rpx solid #f8e4d3;
  border-radius: 50%;
  color: #5f4435;
  background: #e4ad87;
  box-shadow: 0 12rpx 32rpx rgba(107, 73, 50, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 700;
}

.account-avatar.guest { color: #a17453; background: #f5e7d4; }
.account-avatar image { width: 100%; height: 100%; }
.account-name { margin-top: 22rpx; color: var(--ink); font-size: 40rpx; font-weight: 500; line-height: 1.2; }
.account-link { margin-top: 16rpx; display: flex; align-items: center; justify-content: center; gap: 4rpx; color: var(--muted); font-size: 22rpx; }
.account-accent { width: 44rpx; height: 4rpx; margin-top: 26rpx; border-radius: 999rpx; background: #d79a72; }

.menu-list { margin-top: 24rpx; display: flex; flex-direction: column; gap: 14rpx; }
.menu-row { width: 100%; min-height: 90rpx; padding: 16rpx 20rpx; display: grid; grid-template-columns: 56rpx auto 1fr 24rpx; align-items: center; gap: 14rpx; text-align: left; font-size: 28rpx; }
.menu-icon { width: 52rpx; height: 52rpx; color: var(--brand-dark); display: flex; align-items: center; justify-content: center; }
.menu-meta { color: var(--muted); font-size: 20rpx; text-align: right; }
.version { display: block; margin-top: 38rpx; color: #c2b3a8; font-size: 18rpx; text-align: center; }
</style>
