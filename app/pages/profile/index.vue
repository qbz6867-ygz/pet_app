<template>
  <view class="page profile-page">
    <view class="profile-top-spacer" />

    <button class="profile-plain" @tap="loggedIn ? openInfo() : openLogin()">
      <view class="account-avatar" :class="{ guest: !loggedIn }">
        <image v-if="loggedIn && session.avatar" :src="session.avatar" mode="aspectFill" />
        <text v-else-if="loggedIn">{{ session.avatarText || session.name.slice(0, 1) }}</text>
        <AppIcon v-else name="user" size="52rpx" />
      </view>
      <text class="account-name">{{ loggedIn ? session.name : '登录 / 注册' }}</text>
      <view class="account-link">
        <text>{{ loggedIn ? '查看个人资料' : '登录后同步宠物健康记录' }}</text>
        <AppIcon name="chevron-right" size="20rpx" />
      </view>
      <view class="account-accent" />
    </button>

    <button class="family card" @tap="openFamilyHub">
      <view class="family-entry-icon"><AppIcon name="home" size="32rpx" /></view>
      <view class="family-entry-copy">
        <text class="section-title">家庭组</text>
        <text>{{ familySummary }}</text>
      </view>
      <AppIcon name="chevron-right" size="24rpx" />
    </button>

    <view class="menu-list">
      <button class="menu-row card" @tap="openMessages">
        <view class="menu-icon"><AppIcon name="bell" size="28rpx" /></view><text>消息提醒</text><text class="menu-meta">2 条未读</text><AppIcon name="chevron-right" size="22rpx" />
      </button>
      <button class="menu-row card" @tap="openHelp">
        <view class="menu-icon"><AppIcon name="help" size="28rpx" /></view><text>帮助与反馈</text><text class="menu-meta" /><AppIcon name="chevron-right" size="22rpx" />
      </button>
    </view>

    <text class="version">宠物健康助手 · v1.0.0</text>
    <AppBottomNav active="profile" />
  </view>
</template>

<script>
import AppBottomNav from '../../components/AppBottomNav.vue'
import { ensureAccountFamily, getFamiliesForAccount, joinFamilyFromInvite } from '../../common/family.js'

export default {
  components: { AppBottomNav },
  data() {
    return {
      session: {},
      familyGroups: [],
      pendingInviteCode: '',
      invitePrompted: false
    }
  },
  computed: {
    loggedIn() {
      return Boolean(this.session && this.session.loggedIn)
    },
    familySummary() {
      if (!this.loggedIn) return '登录后创建或加入家庭组'
      return this.familyGroups.length ? `已加入 ${this.familyGroups.length} 个家庭组` : '尚未创建或加入家庭组'
    }
  },
  onLoad(options) {
    const inviteCode = options.inviteFamilyCode || options.joinFamilyCode || ''
    if (inviteCode) {
      this.pendingInviteCode = inviteCode
      uni.setStorageSync('pendingFamilyInviteCode', inviteCode)
    }
  },
  onShow() {
    this.session = uni.getStorageSync('authSession') || {}
    if (!this.loggedIn) {
      this.familyGroups = []
      this.promptInviteLogin()
      return
    }
    ensureAccountFamily(this.session)
    this.refreshFamilies()
    this.handlePendingInvite()
  },
  methods: {
    openInfo() { uni.navigateTo({ url: '/pages/profile/info' }) },
    openLogin() { uni.navigateTo({ url: '/pages/auth/login' }) },
    requireLogin() {
      if (this.loggedIn) return true
      uni.navigateTo({ url: '/pages/auth/login' })
      return false
    },
    openFamilyHub() {
      if (this.requireLogin()) uni.navigateTo({ url: '/pages/profile/family' })
    },
    refreshFamilies() {
      this.familyGroups = getFamiliesForAccount(this.session)
    },
    promptInviteLogin() {
      const code = this.pendingInviteCode || uni.getStorageSync('pendingFamilyInviteCode')
      if (!code || this.invitePrompted) return
      this.invitePrompted = true
      uni.showModal({
        title: '家庭组邀请',
        content: '登录后即可通过邀请加入该家庭组。',
        confirmText: '去登录',
        success: ({ confirm }) => { if (confirm) this.openLogin() }
      })
    },
    handlePendingInvite() {
      const code = this.pendingInviteCode || uni.getStorageSync('pendingFamilyInviteCode')
      if (!code) return
      const result = joinFamilyFromInvite(this.session, code)
      uni.removeStorageSync('pendingFamilyInviteCode')
      this.pendingInviteCode = ''
      if (!result.ok) {
        uni.showToast({ title: result.message, icon: 'none' })
        return
      }
      this.refreshFamilies()
      if (!result.alreadyJoined) uni.showToast({ title: `已加入${result.familyName}`, icon: 'success' })
    },
    openMessages() {
      if (this.requireLogin()) uni.navigateTo({ url: '/pages/messages/index' })
    },
    openHelp() { uni.navigateTo({ url: '/pages/profile/help' }) }
  }
}
</script>

<style scoped>
.profile-top-spacer {
  height: calc(env(safe-area-inset-top) + 184rpx);
}

.profile-plain {
  width: 100%;
  min-height: 304rpx;
  padding: 0 20rpx 34rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.account-avatar {
  width: 116rpx;
  height: 116rpx;
  border: 7rpx solid #f8e4d3;
  border-radius: 50%;
  background: #e4ad87;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5f4435;
  font-size: 48rpx;
  font-weight: 700;
  box-shadow: 0 12rpx 32rpx rgba(107, 73, 50, .08);
}

.account-avatar.guest {
  color: #a17453;
  background: #f5e7d4;
}

.account-avatar image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.account-name {
  margin-top: 22rpx;
  color: var(--ink);
  font-size: 40rpx;
  font-weight: 500;
  line-height: 1.2;
}

.account-link {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: var(--muted);
  font-size: 22rpx;
}

.account-accent {
  width: 44rpx;
  height: 4rpx;
  margin-top: 26rpx;
  border-radius: 999rpx;
  background: #d79a72;
}

.family { width: 100%; min-height: 118rpx; margin-top: 18rpx; padding: 22rpx 24rpx; display: grid; grid-template-columns: 58rpx 1fr 24rpx; align-items: center; gap: 15rpx; text-align: left; }
.family-entry-icon { width: 54rpx; height: 54rpx; color: #a6734d; display: flex; align-items: center; justify-content: center; }
.family-entry-copy { min-width: 0; display: flex; flex-direction: column; gap: 5rpx; }
.family-entry-copy .section-title { font-size: 32rpx; }
.family-entry-copy > text:last-child { color: var(--muted); font-size: 22rpx; }

.menu-list {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.menu-row {
  width: 100%;
  min-height: 90rpx;
  padding: 16rpx 20rpx;
  display: grid;
  grid-template-columns: 56rpx auto 1fr 24rpx;
  align-items: center;
  gap: 14rpx;
  text-align: left;
}

.menu-icon {
  width: 52rpx;
  height: 52rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-dark);
}

.menu-meta {
  color: var(--muted);
  font-size: 20rpx;
  text-align: right;
}

.version {
  display: block;
  margin-top: 38rpx;
  color: #c2b3a8;
  font-size: 18rpx;
  text-align: center;
}
</style>
