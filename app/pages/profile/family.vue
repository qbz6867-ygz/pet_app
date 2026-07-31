<template>
  <view class="page no-tab">
    <AppTopBar title="家庭组" back />

    <view class="card members-card">
      <text class="section-kicker">共同成员</text>
      <text class="section-title">家庭成员</text>
      <view class="members">
        <view v-for="member in members" :key="member.name" class="member-row">
          <text class="member-avatar">{{ member.avatar }}</text>
          <view><text>{{ member.name }}</text><text class="muted">{{ member.note }}</text></view>
          <text class="member-role">{{ member.role }}</text>
        </view>
      </view>
    </view>

    <button class="invite-button" @tap="openInvite">
      <view class="action-icon"><AppIcon name="user-add" size="31rpx" /></view>
      <view><text>邀请新成员</text><text class="muted">搜索手机号或分享家庭邀请码</text></view>
      <AppIcon name="chevron-right" size="22rpx" />
    </button>

    <view class="card family-actions">
      <button @tap="openRequests"><view class="action-icon"><AppIcon name="requests" size="30rpx" /></view><view><text>加入申请</text><text class="muted">查看待处理申请</text></view><AppIcon name="chevron-right" size="22rpx" /></button>
      <button @tap="openPets"><view class="action-icon"><AppIcon name="paw" size="30rpx" /></view><view><text>共同照顾的宠物</text><text class="muted">旺财、糯米</text></view><AppIcon name="chevron-right" size="22rpx" /></button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() {
    return { members: [
      { avatar: '林', name: '林安', note: '今天活跃', role: '管理员' },
      { avatar: '陈', name: '陈晨', note: '10 分钟前活跃', role: '成员' },
      { avatar: '周', name: '周宁', note: '昨天活跃', role: '成员' }
    ] }
  },
  methods: {
    openInvite() { uni.navigateTo({ url: '/pages/profile/invite' }) },
    openRequests() { uni.navigateTo({ url: '/pages/profile/requests' }) },
    openPets() { uni.navigateTo({ url: '/pages/pet/manage' }) }
  }
}
</script>

<style scoped>
.members-card { padding: 26rpx; }
.members { margin-top: 18rpx; }
.member-row { min-height: 88rpx; border-top: 1rpx solid var(--line-soft); display: grid; grid-template-columns: 58rpx 1fr auto; align-items: center; gap: 14rpx; }
.member-avatar { width: 52rpx; height: 52rpx; border-radius: 50%; color: white; background: #cd895e; display: flex; align-items: center; justify-content: center; font-size: 20rpx; }
.member-row > view { display: flex; flex-direction: column; gap: 2rpx; }
.member-row .muted { font-size: 18rpx; }
.member-role { padding: 6rpx 10rpx; border-radius: 999rpx; color: #997048; background: #f7e7c2; font-size: 18rpx; }

.invite-button { width: 100%; min-height: 104rpx; margin: 22rpx 0; padding: 18rpx 20rpx; border: 2rpx dashed #dda86f; border-radius: 26rpx; display: grid; grid-template-columns: 62rpx 1fr 24rpx; align-items: center; gap: 14rpx; text-align: left; }
.invite-button > view { display: flex; flex-direction: column; gap: 4rpx; }
.invite-button .muted { font-size: 19rpx; }
.action-icon { width: 56rpx; height: 56rpx; border-radius: 18rpx; background: var(--gold-soft); display: flex; align-items: center; justify-content: center; }
.family-actions { padding: 4rpx 22rpx; }
.family-actions button { width: 100%; min-height: 98rpx; display: grid; grid-template-columns: 62rpx 1fr 24rpx; align-items: center; gap: 14rpx; text-align: left; }
.family-actions button + button { border-top: 1rpx solid var(--line-soft); }
.family-actions button > view { display: flex; flex-direction: column; gap: 4rpx; }
.family-actions .muted { font-size: 19rpx; }
</style>
