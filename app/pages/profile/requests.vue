<template>
  <view class="page no-tab">
    <AppTopBar title="加入申请" back />

    <view class="card pending-card">
      <view class="row-between">
        <view><text class="section-kicker">待处理</text><text class="section-title">新的加入申请</text></view>
        <text class="pill">{{ pending.length }} 条</text>
      </view>
      <view v-if="pending.length" class="request-list">
        <view v-for="request in pending" :key="request.name" class="request-row">
          <text class="request-avatar">{{ request.avatar }}</text>
          <view><text>{{ request.name }}</text><text class="muted">{{ request.note }}</text></view>
          <view class="request-actions"><button @tap="reject(request)">拒绝</button><button class="accept" @tap="accept(request)">同意</button></view>
        </view>
      </view>
      <view v-else class="empty">
        <view class="empty-icon"><AppIcon name="user" size="36rpx" /></view>
        <text>暂无待处理申请</text>
        <text class="muted">家人通过邀请码申请加入后，会显示在这里。</text>
      </view>
    </view>

    <view class="card history-card">
      <text class="section-kicker">最近处理</text>
      <text class="section-title">申请记录</text>
      <view class="history-row"><text class="request-avatar">顾</text><view><text>顾乔</text><text class="muted">2026.07.18</text></view><view class="accepted"><AppIcon name="check" size="19rpx" /><text>已同意</text></view></view>
      <view class="history-row"><text class="request-avatar">何</text><view><text>何南</text><text class="muted">2026.07.08</text></view><text class="rejected">已拒绝</text></view>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() { return { pending: [] } },
  methods: {
    accept(request) { this.pending = this.pending.filter(item => item !== request); uni.showToast({ title: '已同意申请', icon: 'success' }) },
    reject(request) { this.pending = this.pending.filter(item => item !== request) }
  }
}
</script>

<style scoped>
.pending-card, .history-card { padding: 26rpx; }
.request-list { margin-top: 20rpx; }
.request-row, .history-row { min-height: 90rpx; border-top: 1rpx solid var(--line-soft); display: grid; grid-template-columns: 56rpx 1fr auto; align-items: center; gap: 14rpx; }
.request-avatar { width: 52rpx; height: 52rpx; border-radius: 50%; color: white; background: #c7834c; display: flex; align-items: center; justify-content: center; }
.request-row > view:nth-child(2), .history-row > view { display: flex; flex-direction: column; }
.request-row .muted, .history-row .muted { font-size: 18rpx; }
.request-actions { display: flex; gap: 8rpx; }
.request-actions button { padding: 8rpx 12rpx; border-radius: 12rpx; background: #f2e8dc; font-size: 19rpx; }
.request-actions .accept { color: white; background: #bf7f4c; }
.empty { min-height: 210rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10rpx; text-align: center; }
.empty-icon { width: 66rpx; height: 66rpx; border-radius: 50%; background: var(--gold-soft); display: flex; align-items: center; justify-content: center; font-size: 34rpx; }
.empty .muted { font-size: 20rpx; }
.history-card { margin-top: 22rpx; }
.history-card .section-title { display: block; margin-bottom: 12rpx; }
.accepted { padding: 7rpx 11rpx; border-radius: 999rpx; color: var(--green); background: var(--green-soft); font-size: 18rpx; display: flex; align-items: center; gap: 4rpx; }
.rejected { padding: 7rpx 11rpx; border-radius: 999rpx; color: #a77d6b; background: #f4e8e1; font-size: 18rpx; }
</style>
