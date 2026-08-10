<template>
  <view class="page no-tab family-page">
    <AppTopBar title="家庭组" back center />

    <view v-for="request in pendingRequests" :key="request.id" class="pending-request">
      <AppIcon name="clock" size="22rpx" />
      <text>已申请加入“{{ request.familyName }}”，等待管理员确认</text>
    </view>

    <view v-if="!families.length" class="empty-family card">
      <view class="empty-family-icon"><AppIcon name="home" size="52rpx" /></view>
      <text class="empty-family-title">还没有家庭组</text>
      <text class="empty-family-copy">收到家庭组邀请后，加入的家庭会显示在这里。</text>
    </view>

    <view v-else class="family-list">
      <view v-for="family in families" :key="family.code" class="family-group-card card">
        <view class="family-head">
          <view class="family-heading">
            <view class="family-name-row">
              <input v-if="managingCode === family.code" v-model="nameDrafts[family.code]" maxlength="16" focus />
              <text v-else class="family-name">{{ family.name }}</text>
            </view>
          </view>
          <view v-if="isAdmin(family)" class="family-head-actions">
            <button
              v-if="managingCode !== family.code"
              class="header-invite"
              open-type="share"
              :data-family-code="family.code"
              :aria-label="`邀请他人加入${family.name}`"
            >邀请</button>
            <button class="edit-family" :class="{ active: managingCode === family.code }" @tap="toggleManage(family)">{{ managingCode === family.code ? '完成' : '编辑' }}</button>
          </view>
        </view>

        <view class="members-section">
          <view class="members-list">
            <view v-for="member in family.members" :key="member.id" class="member-row">
              <text class="member-avatar">{{ member.avatar }}</text>
              <view class="member-copy">
                <view class="member-name-row">
                  <text>{{ member.name }}</text>
                  <text class="member-role">{{ member.role }}</text>
                </view>
              </view>
              <button v-if="managingCode === family.code && isAdmin(family) && member.id !== family.ownerId" class="remove-member" @tap="removeMember(family, member)">删除</button>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { ensureAdminPreviewMembers, getAccountId, getFamiliesForAccount, getMyPendingRequests, removeFamilyMember, renameFamily } from '../../common/family.js'
import { getPetsForFamily } from '../../common/pets.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      session: {},
      families: [],
      pendingRequests: [],
      managingCode: '',
      nameDrafts: {}
    }
  },
  onShow() {
    this.session = uni.getStorageSync('authSession') || {}
    if (!this.session.loggedIn) {
      uni.navigateTo({ url: '/pages/auth/login' })
      return
    }
    ensureAdminPreviewMembers(this.session)
    this.refreshFamilies()
  },
  onShareAppMessage(event) {
    const code = event && event.target && event.target.dataset ? event.target.dataset.familyCode : ''
    const family = this.families.find(item => item.code === code)
    return {
      title: `${family ? family.name : '家庭组'}邀请你共同照顾宠物`,
      path: `/pages/profile/index?inviteFamilyCode=${code}`
    }
  },
  methods: {
    refreshFamilies() {
      this.families = getFamiliesForAccount(this.session).map(family => {
        return {
          ...family,
          pets: getPetsForFamily(family.code)
        }
      })
      this.pendingRequests = getMyPendingRequests(this.session)
    },
    isAdmin(family) {
      return family.ownerId === getAccountId(this.session)
    },
    toggleManage(family) {
      if (this.managingCode === family.code) {
        if (!renameFamily(this.session, family.code, this.nameDrafts[family.code])) {
          uni.showToast({ title: '请输入家庭名称', icon: 'none' })
          return
        }
        this.managingCode = ''
        this.refreshFamilies()
        uni.showToast({ title: '修改已保存', icon: 'success' })
        return
      }
      this.managingCode = family.code
      this.nameDrafts[family.code] = family.name
    },
    removeMember(family, member) {
      uni.showModal({
        title: '删除家庭成员',
        content: `确定将${member.name}从${family.name}中删除吗？`,
        confirmText: '删除',
        confirmColor: '#b45f55',
        success: ({ confirm }) => {
          if (!confirm || !removeFamilyMember(this.session, family.code, member.id)) return
          this.refreshFamilies()
          this.managingCode = family.code
          uni.showToast({ title: '成员已删除', icon: 'success' })
        }
      })
    }
  }
}
</script>

<style scoped>
.family-page { padding-bottom: calc(64rpx + env(safe-area-inset-bottom)); }
.pending-request { margin-top: 15rpx; padding: 14rpx 17rpx; border-radius: 18rpx; color: #98704d; background: #fbf0df; display: flex; align-items: center; gap: 9rpx; font-size: 20rpx; }
.empty-family { min-height: 360rpx; margin-top: 24rpx; padding: 44rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.empty-family-icon { width: 92rpx; height: 92rpx; margin-bottom: 18rpx; border-radius: 50%; color: #a9764d; background: #f7ead4; display: flex; align-items: center; justify-content: center; }
.empty-family-title { font-size: 32rpx; font-weight: 600; }
.empty-family-copy { max-width: 430rpx; margin-top: 10rpx; color: var(--muted); font-size: 22rpx; line-height: 1.6; }
.family-list { margin-top: 24rpx; display: flex; flex-direction: column; gap: 22rpx; }
.family-group-card { padding: 26rpx; }
.family-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14rpx; }
.family-heading { min-width: 0; flex: 1; }
.family-name-row { min-width: 0; display: flex; align-items: center; gap: 6rpx; }
.family-name { min-width: 0; overflow: hidden; font-size: 34rpx; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.family-name-row input { width: 250rpx; height: 50rpx; border-bottom: 1rpx solid #d8b98f; font-size: 30rpx; }
.family-head-actions { flex: none; display: flex; align-items: center; gap: 9rpx; }
.header-invite,
.edit-family { min-width: 76rpx; height: 50rpx; padding: 0 17rpx; border-radius: 999rpx; display: flex; align-items: center; justify-content: center; font-size: 24rpx; line-height: 1; }
.header-invite { color: #8f633f; border: 1rpx solid #e1c8a5; background: #fffaf2; }
.edit-family { color: #8f633f; background: #f7ead7; }
.edit-family.active { color: white; background: #ad7549; }
.members-section { margin-top: 18rpx; padding-top: 8rpx; border-top: 1rpx solid var(--line-soft); }
.members-list { margin-top: 0; }
.member-row { min-height: 82rpx; display: grid; grid-template-columns: 54rpx 1fr auto; align-items: center; gap: 13rpx; }
.member-avatar { width: 50rpx; height: 50rpx; border-radius: 50%; color: white; background: #cd895e; display: flex; align-items: center; justify-content: center; font-size: 22rpx; }
.member-copy { min-width: 0; display: flex; flex-direction: column; gap: 2rpx; }
.member-name-row { min-width: 0; display: flex; align-items: center; gap: 7rpx; }
.member-name-row > text:first-child { min-width: 0; overflow: hidden; font-size: 26rpx; text-overflow: ellipsis; white-space: nowrap; }
.member-role { color: #b18a69; font-size: 20rpx; font-weight: 500; }
.remove-member { min-width: 72rpx; height: 48rpx; padding: 0 14rpx; border-radius: 999rpx; color: #a9564f; background: #f9e7e4; display: flex; align-items: center; justify-content: center; font-size: 24rpx; }
</style>
