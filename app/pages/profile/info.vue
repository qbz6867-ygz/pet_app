<template>
  <view class="page no-tab">
    <AppTopBar title="个人信息" back />

    <button
      class="info-avatar"
      open-type="chooseAvatar"
      aria-label="修改头像"
      @chooseavatar="onChooseAvatar"
    >
      <image v-if="profile.avatar" :src="profile.avatar" mode="aspectFill" />
      <text v-else>{{ profile.name.slice(0, 1) }}</text>
      <view class="avatar-edit"><AppIcon name="plus" size="20rpx" /></view>
    </button>
    <view class="card info-card">
      <view class="row-between">
        <view><text class="section-kicker">账号信息</text><text class="section-title">基本资料</text></view>
        <button class="pill" @tap="toggleEdit">{{ editing ? '完成' : '编辑' }}</button>
      </view>
      <view class="info-list">
        <label v-for="field in fields" :key="field.key" class="info-row">
          <view class="icon"><AppIcon :name="field.icon" size="28rpx" /></view>
          <view>
            <text class="muted">{{ field.label }}</text>
            <input v-if="editing && field.editable" v-model="profile[field.key]" />
            <text v-else>{{ profile[field.key] }}</text>
          </view>
        </label>
      </view>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { ensureWechatSession } from '../../common/auth.js'
export default {
  components: { AppTopBar },
  data() {
    return {
      editing: false,
      profile: { name: '微信用户', account: '微信授权登录', avatar: '' },
      fields: [
        { key: 'name', label: '昵称', icon: 'user', editable: true },
        { key: 'account', label: '登录方式', icon: 'user', editable: false }
      ]
    }
  },
  onLoad() {
    this.loadWechatProfile()
  },
  methods: {
    async loadWechatProfile() {
      try {
        const session = await ensureWechatSession()
        this.profile.name = session.name || this.profile.name
        this.profile.avatar = session.avatar || ''
      } catch (error) {
        uni.showToast({ title: '微信登录失败，请稍后重试', icon: 'none' })
        setTimeout(() => uni.navigateBack(), 450)
      }
    },
    onChooseAvatar(event) {
      const tempFilePath = event.detail && event.detail.avatarUrl
      if (!tempFilePath) return

      uni.saveFile({
        tempFilePath,
        success: ({ savedFilePath }) => this.saveAvatar(savedFilePath),
        fail: () => this.saveAvatar(tempFilePath)
      })
    },
    saveAvatar(avatar) {
      this.profile.avatar = avatar
      const session = uni.getStorageSync('authSession') || {}
      uni.setStorageSync('authSession', { ...session, avatar })
      uni.showToast({ title: '头像已更新', icon: 'success' })
    },
    toggleEdit() {
      if (this.editing) {
        const session = uni.getStorageSync('authSession') || {}
        uni.setStorageSync('authSession', {
          ...session,
          name: this.profile.name,
          avatarText: this.profile.name.slice(0, 1)
        })
        uni.showToast({ title: '资料已保存', icon: 'success' })
      }
      this.editing = !this.editing
    }
  }
}
</script>

<style scoped>
.info-avatar {
  width: 130rpx; height: 130rpx; margin: 12rpx auto 26rpx; padding: 0; position: relative; overflow: visible;
  border: 8rpx solid #efc2a6; border-radius: 50%; color: #704630; background: #e7a078;
  display: flex; align-items: center; justify-content: center; font-size: 48rpx; font-weight: 600;
}
.info-avatar image { width: 100%; height: 100%; border-radius: 50%; }
.avatar-edit {
  width: 38rpx; height: 38rpx; position: absolute; right: -8rpx; bottom: -4rpx; z-index: 2;
  border: 4rpx solid white; border-radius: 50%; color: white; background: #b98051;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 5rpx 14rpx rgba(102,67,42,.16);
}
.info-card { padding: 26rpx; }
.info-list { margin-top: 20rpx; display: flex; flex-direction: column; gap: 12rpx; }
.info-row { min-height: 84rpx; padding: 12rpx 16rpx; border-radius: 22rpx; background: var(--surface-strong); display: grid; grid-template-columns: 56rpx 1fr; align-items: center; gap: 14rpx; }
.icon { width: 50rpx; height: 50rpx; border-radius: 0; background: transparent; display: flex; align-items: center; justify-content: center; }
.info-row > view { display: flex; flex-direction: column; gap: 3rpx; }
.info-row .muted { font-size: 18rpx; }
.info-row input { height: 42rpx; border-bottom: 1rpx solid #d3ad80; }
</style>
