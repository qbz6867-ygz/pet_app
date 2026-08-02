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

    <view class="family card" @tap="openFamily">
      <view class="row-between">
        <text class="section-title">家庭组</text>
        <button class="manage-link" @tap.stop="openFamily"><text>管理</text><AppIcon name="chevron-right" size="20rpx" /></button>
      </view>
      <view v-if="loggedIn" class="family-avatars">
        <text v-for="member in ['林','陈','周']" :key="member">{{ member }}</text>
        <view class="add"><AppIcon name="plus" size="24rpx" /></view>
      </view>
      <text v-if="loggedIn" class="family-meta">3 位家庭成员 · 共同照顾 2 只宠物</text>
    </view>

    <view class="menu-list">
      <button class="menu-row card" @tap="openMessages">
        <view class="menu-icon"><AppIcon name="bell" size="28rpx" /></view><text>消息提醒</text><text class="menu-meta">2 条未读</text><AppIcon name="chevron-right" size="22rpx" />
      </button>
      <button class="menu-row card" @tap="openSettings">
        <view class="menu-icon"><AppIcon name="settings" size="28rpx" /></view><text>系统设置</text><text class="menu-meta" /><AppIcon name="chevron-right" size="22rpx" />
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

export default {
  components: { AppBottomNav },
  data() {
    return {
      session: {}
    }
  },
  computed: {
    loggedIn() {
      return Boolean(this.session && this.session.loggedIn)
    }
  },
  onShow() {
    this.session = uni.getStorageSync('authSession') || {}
  },
  methods: {
    openInfo() { uni.navigateTo({ url: '/pages/profile/info' }) },
    openLogin() { uni.navigateTo({ url: '/pages/auth/login' }) },
    requireLogin() {
      if (this.loggedIn) return true
      uni.navigateTo({ url: '/pages/auth/login' })
      return false
    },
    openFamily() {
      if (this.loggedIn) {
        uni.navigateTo({ url: '/pages/profile/family' })
        return
      }
      uni.showModal({
        title: '温馨提示',
        content: '登录后才能使用家庭组功能',
        confirmText: '去登录',
        cancelText: '暂不登录',
        success: ({ confirm }) => {
          if (confirm) this.openLogin()
        }
      })
    },
    openMessages() {
      if (this.requireLogin()) uni.navigateTo({ url: '/pages/messages/index' })
    },
    openSettings() { uni.navigateTo({ url: '/pages/profile/settings' }) },
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
  font-size: 39rpx;
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
  font-size: 21rpx;
}

.account-accent {
  width: 44rpx;
  height: 4rpx;
  margin-top: 26rpx;
  border-radius: 999rpx;
  background: #d79a72;
}

.family {
  margin-top: 18rpx;
  padding: 26rpx;
}

.manage-link {
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  gap: 3rpx;
}

.family-avatars {
  margin: 22rpx 0 14rpx;
  display: flex;
}

.family-avatars > text,
.family-avatars .add {
  width: 58rpx;
  height: 58rpx;
  margin-right: -7rpx;
  border: 4rpx solid #fffaf3;
  border-radius: 50%;
  color: white;
  background: #cf8a61;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21rpx;
}

.family-avatars > text:nth-child(2) { background: #c6a06c; }
.family-avatars > text:nth-child(3) { background: #a98e80; }
.family-avatars .add { color: #9b7656; background: #f5eadb; }

.family-meta {
  color: var(--muted);
  font-size: 21rpx;
}

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
  border: 1rpx solid var(--line);
  border-radius: 17rpx;
  background: #fff6e8;
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
