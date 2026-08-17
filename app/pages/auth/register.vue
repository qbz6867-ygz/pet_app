<template>
  <view class="page no-tab register-page">
    <AppTopBar title="手机号登录/注册" eyebrow="验证手机号即可继续" back />

    <view class="register-card card">
      <view class="register-heading">
        <text class="section-kicker">手机验证码</text>
        <text class="section-title">登录或创建账号</text>
        <text class="register-desc">未注册的手机号验证成功后，将自动创建账号。</text>
      </view>

      <view class="form-list">
        <label class="form-item">
          <text>手机号码</text>
          <view class="field">
            <AppIcon name="phone" size="27rpx" />
            <input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号码" />
          </view>
        </label>

        <label class="form-item">
          <text>验证码</text>
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

      </view>

      <button class="agreement" @tap="agreementAccepted = !agreementAccepted">
        <view class="agreement-check" :class="{ checked: agreementAccepted }">
          <AppIcon v-if="agreementAccepted" name="check-light" size="20rpx" />
        </view>
        <text>同意《用户协议》和《隐私政策》</text>
      </button>

      <button class="primary-button register-submit" :class="{ disabled: !canSubmit }" @tap="submit">
        登录/注册
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
      agreementAccepted: false,
      countdown: 0,
      timer: null
    }
  },
  computed: {
    canSubmit() {
      return /^1\d{10}$/.test(this.phone)
        && this.code.length >= 4
        && this.agreementAccepted
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
    submit() {
      if (!this.canSubmit) {
        const message = !this.agreementAccepted
          ? '请先同意用户协议和隐私政策'
          : '请填写正确的手机号和验证码'
        uni.showToast({ title: message, icon: 'none' })
        return
      }
      const name = `用户${this.phone.slice(-4)}`
      const session = {
        loggedIn: true,
        accountId: `phone:${this.phone}`,
        name,
        phone: this.phone,
        avatarText: name.slice(0, 1),
        loginType: 'phone',
        loginAt: Date.now()
      }
      uni.setStorageSync('authSession', session)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => uni.reLaunch({ url: '/pages/profile/index' }), 500)
    }
  }
}
</script>

<style scoped>
.register-page { padding-left: 44rpx; padding-right: 44rpx; }
.register-card { padding: 30rpx; }
.register-heading { padding-bottom: 25rpx; border-bottom: 1rpx solid var(--line-soft); }
.register-heading .section-title { display: block; }
.register-desc { display: block; margin-top: 10rpx; color: var(--muted); font-size: 20rpx; line-height: 1.6; }
.form-list { margin-top: 22rpx; display: flex; flex-direction: column; gap: 20rpx; }
.form-item > text { display: block; margin: 0 0 9rpx 8rpx; color: #756154; font-size: 22rpx; }
.form-item .field { gap: 13rpx; color: #a8764f; }
.form-item .field input { min-width: 0; flex: 1; }
.code-row { display: grid; grid-template-columns: 1fr 174rpx; gap: 12rpx; }
.code-button { height: 88rpx; border: 1rpx solid #e2cba9; border-radius: 26rpx; color: #936640; background: #fff8ec; font-size: 20rpx; }
.disabled { color: #b5a99f; background: #eee6da; box-shadow: none; }
.agreement { width: 100%; margin-top: 24rpx; display: flex; align-items: center; color: #9b8778; font-size: 20rpx; }
.agreement-check { width: 30rpx; height: 30rpx; margin-right: 9rpx; border: 1rpx solid #d9c5a8; border-radius: 9rpx; display: flex; align-items: center; justify-content: center; }
.agreement-check.checked { color: white; border-color: #b98a58; background: #b98a58; }
.register-submit { width: 100%; margin-top: 24rpx; }
</style>
