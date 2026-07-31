<template>
  <view class="page no-tab">
    <AppTopBar title="邀请新成员" back />

    <view class="card phone-card">
      <text class="section-kicker">通过绑定手机号查找</text>
      <text class="section-title">搜索家庭成员</text>
      <text class="intro">输入对方在小程序中绑定的手机号，找到用户后即可发送家庭组邀请。</text>
      <view class="phone-search">
        <input v-model="phone" type="number" maxlength="11" placeholder="请输入 11 位手机号" />
        <button @tap="searchUser">搜索</button>
      </view>
      <view v-if="foundUser" class="found-user">
        <text class="member-avatar">何</text>
        <view><text>何南</text><text class="muted">已绑定该手机号</text></view>
        <button :class="{ sent }" @tap="sendInvite">{{ sent ? '已邀请' : '邀请加入' }}</button>
      </view>
      <text v-if="searched && !foundUser" class="not-found">未找到绑定该手机号的用户</text>
    </view>

    <view class="card code-card">
      <view class="row-between"><view><text class="section-kicker">专属凭证</text><text class="section-title">家庭邀请码</text></view><text class="pill">24 小时有效</text></view>
      <text class="invite-code">PAW-8264</text>
      <button class="primary-button copy-button" @tap="copyCode"><text>{{ copied ? '已复制邀请码' : '复制邀请码' }}</text><AppIcon v-if="copied" name="check-light" size="25rpx" /></button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() { return { phone: '', searched: false, foundUser: false, sent: false, copied: false } },
  methods: {
    searchUser() {
      if (!/^1\d{10}$/.test(this.phone)) return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      this.searched = true
      this.foundUser = this.phone.endsWith('2608') || this.phone.endsWith('1234')
    },
    sendInvite() { this.sent = true; uni.showToast({ title: '邀请已发送', icon: 'success' }) },
    copyCode() {
      uni.setClipboardData({ data: 'PAW-8264', success: () => { this.copied = true } })
    }
  }
}
</script>

<style scoped>
.phone-card, .code-card { padding: 28rpx; }
.intro { display: block; margin-top: 12rpx; color: var(--muted); font-size: 22rpx; line-height: 1.7; }
.phone-search { min-height: 82rpx; margin-top: 22rpx; padding-left: 20rpx; border: 1rpx solid var(--line); border-radius: 22rpx; background: var(--surface-strong); display: grid; grid-template-columns: 1fr 116rpx; align-items: center; overflow: hidden; }
.phone-search input { font-size: 25rpx; }
.phone-search button { height: 100%; color: white; background: #bd7c46; font-size: 24rpx; }
.found-user { margin-top: 18rpx; padding: 16rpx; border-radius: 22rpx; background: #fbf5ec; display: grid; grid-template-columns: 54rpx 1fr auto; align-items: center; gap: 14rpx; }
.member-avatar { width: 52rpx; height: 52rpx; border-radius: 50%; color: white; background: #c98350; display: flex; align-items: center; justify-content: center; }
.found-user > view { display: flex; flex-direction: column; }
.found-user .muted { font-size: 18rpx; }
.found-user button { padding: 10rpx 14rpx; border-radius: 14rpx; color: white; background: #bf7e49; font-size: 20rpx; }
.found-user button.sent { color: var(--green); background: var(--green-soft); }
.not-found { display: block; margin-top: 16rpx; color: #b35d52; font-size: 22rpx; }
.code-card { margin-top: 22rpx; }
.invite-code { display: flex; min-height: 108rpx; margin: 22rpx 0 16rpx; border: 2rpx dashed #d8a36c; border-radius: 22rpx; align-items: center; justify-content: center; color: #78553d; font-size: 42rpx; font-weight: 700; letter-spacing: 8rpx; }
.copy-button { gap: 8rpx; }
</style>
