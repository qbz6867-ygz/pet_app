<template>
  <view class="auth-page">
    <view class="decor decor-top" aria-hidden="true" />
    <view class="decor decor-side" aria-hidden="true" />

    <view class="login-topbar" :style="navigationStyle">
      <button class="back-button" aria-label="返回" @tap="goBack">
        <AppIcon name="back" size="30rpx" />
      </button>
    </view>

    <view class="login-hero">
      <text class="hero-kicker">宠迹管家</text>
      <text class="hero-title">陪它健康地长大</text>
      <text class="hero-desc">记录日常状态，也珍藏每一天的陪伴</text>
      <view class="hero-features">
        <text>健康记录</text>
        <view class="feature-dot" />
        <text>任务提醒</text>
        <view class="feature-dot" />
        <text>成长陪伴</text>
      </view>
      <image class="hero-logo" src="/static/brand/app-icon.png" mode="aspectFit" />
    </view>

    <view class="login-bottom">
      <view class="login-actions">
        <button class="quick-login" @tap="wechatLogin">
          <text>一键登录</text>
        </button>
        <button class="phone-login" @tap="openPhoneLogin">
          <text>手机号登录/注册</text>
        </button>
      </view>

      <button class="agreement" @tap="agreementAccepted = !agreementAccepted">
        <view class="agreement-check" :class="{ checked: agreementAccepted }">
          <AppIcon v-if="agreementAccepted" name="check-light" size="20rpx" />
        </view>
        <text>我已阅读并同意</text>
        <text class="agreement-link">《用户协议》</text>
        <text>和</text>
        <text class="agreement-link">《隐私政策》</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getNavigationStyle } from '../../common/navigation.js'
import { ensureAccountFamily } from '../../common/family.js'

export default {
  data() {
    return {
      navigationStyle: getNavigationStyle(),
      agreementAccepted: false
    }
  },
  onShow() {
    this.navigationStyle = getNavigationStyle()
  },
  onResize() {
    this.navigationStyle = getNavigationStyle()
  },
  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) uni.navigateBack()
      else uni.reLaunch({ url: '/pages/profile/index' })
    },
    requireAgreement() {
      if (this.agreementAccepted) return true
      uni.showToast({ title: '请先同意用户协议和隐私政策', icon: 'none' })
      return false
    },
    wechatLogin() {
      if (!this.requireAgreement()) return
      uni.getUserProfile({
        desc: '用于完善账号昵称和头像',
        success: ({ userInfo }) => {
          uni.showLoading({ title: '登录中' })
          uni.login({
            provider: 'weixin',
            success: () => {
              uni.hideLoading()
              const name = userInfo.nickName || '微信用户'
              this.finishLogin({
                name,
                phone: '',
                avatar: userInfo.avatarUrl || '',
                avatarText: name.slice(0, 1),
                loginType: 'wechat'
              })
            },
            fail: () => {
              uni.hideLoading()
              uni.showToast({ title: '微信登录失败，请稍后重试', icon: 'none' })
            }
          })
        },
        fail: () => {
          uni.showToast({ title: '需要授权微信账号后登录', icon: 'none' })
        }
      })
    },
    openPhoneLogin() {
      if (!this.requireAgreement()) return
      uni.navigateTo({ url: '/pages/auth/register' })
    },
    finishLogin(profile) {
      const session = {
        loggedIn: true,
        ...profile,
        accountId: profile.accountId || profile.openId || profile.openid || `wechat:${Date.now()}`,
        loginAt: Date.now()
      }
      uni.setStorageSync('authSession', session)
      ensureAccountFamily(session)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => uni.reLaunch({ url: '/pages/profile/index' }), 500)
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 0 44rpx calc(30rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 90% 7%, rgba(240, 207, 154, .34), transparent 28%),
    linear-gradient(180deg, #fffbf4 0%, #fffefd 50%, #ffffff 100%);
}
.login-topbar { position: -webkit-sticky; position: sticky; z-index: 40; top: 0; min-height: calc(env(safe-area-inset-top) + 156rpx); margin: 0 -44rpx; padding: calc(env(safe-area-inset-top) + 88rpx) 44rpx 20rpx; box-sizing: border-box; background: rgba(255,251,245,.96); display: flex; align-items: center; }
.decor { position: absolute; pointer-events: none; }
.decor-top { width: 310rpx; height: 310rpx; top: 118rpx; right: -165rpx; border: 44rpx solid rgba(218,174,110,.08); border-radius: 50%; }
.decor-side { width: 180rpx; height: 180rpx; top: 48%; left: -132rpx; border-radius: 50%; background: rgba(245,226,191,.22); }
.back-button { width: 68rpx; height: var(--menu-button-height, 68rpx); position: relative; z-index: 1; border: 1rpx solid #e7d7c0; border-radius: 22rpx; color: #9a704d; background: rgba(255,251,245,.9); display: flex; align-items: center; justify-content: center; box-shadow: 0 8rpx 24rpx rgba(112,76,43,.05); }
.login-hero { margin-top: 108rpx; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
.hero-logo { width: 184rpx; height: 184rpx; margin-top: 30rpx; border-radius: 44rpx; }
.hero-kicker { color: #bb8251; font-size: 20rpx; letter-spacing: 7rpx; }
.hero-title { margin-top: 25rpx; color: #594538; font-size: 48rpx; font-weight: 500; letter-spacing: 2rpx; }
.hero-desc { margin-top: 16rpx; color: #9c8a7c; font-size: 22rpx; font-weight: 300; }
.hero-features { margin-top: 38rpx; padding: 15rpx 25rpx; border: 1rpx solid rgba(225,204,174,.7); border-radius: 999rpx; color: #9b7c63; background: rgba(255,252,247,.72); display: flex; align-items: center; gap: 15rpx; font-size: 18rpx; }
.feature-dot { width: 5rpx; height: 5rpx; border-radius: 50%; background: #d0a779; }
.login-bottom { width: 100%; margin-top: auto; position: relative; z-index: 1; }
.login-actions { width: 100%; display: flex; flex-direction: column; gap: 18rpx; }
.quick-login,
.phone-login { width: 100%; height: 92rpx; border-radius: 27rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; font-weight: 500; letter-spacing: 1rpx; }
.quick-login { color: white; background: linear-gradient(135deg, #679b70, #568b62); box-shadow: 0 14rpx 30rpx rgba(81,137,94,.18); }
.phone-login { color: #73543e; border: 1rpx solid #dfc49f; background: rgba(255,252,247,.9); box-shadow: 0 10rpx 25rpx rgba(105,75,48,.04); }
.agreement { width: 100%; margin: 24rpx 0 5vh; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; color: #a39385; font-size: 18rpx; line-height: 1.8; }
.agreement-check { width: 30rpx; height: 30rpx; margin-right: 9rpx; border: 1rpx solid #d9c5a8; border-radius: 10rpx; background: rgba(255,255,255,.9); display: flex; align-items: center; justify-content: center; }
.agreement-check.checked { color: white; border-color: #b98a58; background: #b98a58; }
.agreement-link { color: #9b6c46; }
</style>
