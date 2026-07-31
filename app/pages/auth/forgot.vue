<template>
  <view class="page no-tab forgot-page">
    <AppTopBar title="重设密码" eyebrow="账号安全" back />

    <view class="reset-hero">
      <view class="reset-icon"><AppIcon name="shield" size="48rpx" /></view>
      <text class="section-title">找回你的账号</text>
      <text>验证注册手机号后，可以重新设置登录密码。</text>
    </view>

    <view class="card reset-card">
      <label class="form-item">
        <text>手机号码</text>
        <view class="field">
          <AppIcon name="phone" size="27rpx" />
          <input v-model="phone" type="number" maxlength="11" placeholder="请输入注册手机号" />
        </view>
      </label>

      <label class="form-item">
        <text>短信验证码</text>
        <view class="code-row">
          <view class="field">
            <AppIcon name="shield" size="27rpx" />
            <input v-model="code" type="number" maxlength="6" placeholder="请输入验证码" />
          </view>
          <button class="code-button" :class="{ disabled: countdown > 0 }" @tap="sendCode">
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>
      </label>

      <label class="form-item">
        <text>新密码</text>
        <view class="field">
          <AppIcon name="shield" size="27rpx" />
          <input v-model="password" password maxlength="20" placeholder="请输入6–20位新密码" />
        </view>
      </label>

      <label class="form-item">
        <text>确认新密码</text>
        <view class="field">
          <AppIcon name="check" size="27rpx" />
          <input v-model="confirmPassword" password maxlength="20" placeholder="请再次输入新密码" />
        </view>
      </label>

      <button class="primary-button reset-submit" :class="{ disabled: !canSubmit }" @tap="resetPassword">
        确认重设
      </button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'

export default {
  components: { AppTopBar },
  data() {
    return {
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
      countdown: 0,
      timer: null
    }
  },
  computed: {
    canSubmit() {
      return /^1\d{10}$/.test(this.phone)
        && this.code.length >= 4
        && this.password.length >= 6
        && this.password === this.confirmPassword
    }
  },
  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    sendCode() {
      if (this.countdown > 0) return
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
        return
      }
      this.countdown = 60
      uni.showToast({ title: '验证码已发送', icon: 'none' })
      this.timer = setInterval(() => {
        this.countdown -= 1
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    resetPassword() {
      if (!this.canSubmit) {
        const message = this.password !== this.confirmPassword
          ? '两次输入的密码不一致'
          : '请完整填写重设信息'
        uni.showToast({ title: message, icon: 'none' })
        return
      }
      uni.showToast({ title: '密码重设成功', icon: 'success' })
      setTimeout(() => uni.redirectTo({ url: '/pages/auth/login' }), 500)
    }
  }
}
</script>

<style scoped>
.forgot-page { padding-left: 44rpx; padding-right: 44rpx; }
.reset-hero { padding: 8rpx 20rpx 30rpx; display: flex; flex-direction: column; align-items: center; text-align: center; }
.reset-icon { width: 88rpx; height: 88rpx; margin-bottom: 18rpx; border-radius: 29rpx; color: #9b6c46; background: #f6e5c3; display: flex; align-items: center; justify-content: center; }
.reset-hero > text:last-child { margin-top: 9rpx; color: var(--muted); font-size: 20rpx; line-height: 1.6; }
.reset-card { padding: 30rpx; }
.form-item { display: block; margin-top: 20rpx; }
.form-item:first-child { margin-top: 0; }
.form-item > text { display: block; margin: 0 0 9rpx 8rpx; color: #756154; font-size: 21rpx; }
.form-item .field { gap: 13rpx; color: #a8764f; }
.form-item .field input { min-width: 0; flex: 1; }
.code-row { display: grid; grid-template-columns: 1fr 174rpx; gap: 12rpx; }
.code-button { height: 88rpx; border: 1rpx solid #e2cba9; border-radius: 26rpx; color: #936640; background: #fff8ec; font-size: 20rpx; }
.reset-submit { width: 100%; margin-top: 28rpx; }
.disabled { color: #b5a99f; background: #eee6da; box-shadow: none; }
</style>
