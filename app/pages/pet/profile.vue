<template>
  <view class="page no-tab">
    <AppTopBar title="宠物资料" back />

    <view class="pet-profile-hero">
      <view class="profile-avatar">
        <image v-if="pet.avatar" :src="pet.avatar" mode="aspectFill" />
        <AppIcon v-else :name="pet.icon" size="84rpx" />
      </view>
      <text class="pet-name">{{ pet.name }}</text>
      <text class="muted">{{ pet.type }} · {{ pet.age }}</text>
    </view>

    <view class="card info-card">
      <view class="row-between">
        <view><text class="section-kicker">身份档案</text><text class="section-title">基本资料</text></view>
        <button v-if="pet.canEdit" class="pill" @tap="toggleEditing">{{ editing ? '完成' : '编辑' }}</button>
      </view>
      <view class="info-list">
        <label v-for="item in fields" :key="item.key" class="info-row">
          <view class="info-icon"><AppIcon :name="item.icon" size="28rpx" /></view>
          <view><text class="muted">{{ item.label }}</text><input v-if="editing" v-model="profile[item.key]" /><text v-else>{{ profile[item.key] }}</text></view>
        </label>
      </view>
    </view>

    <button v-if="pet.isOwned" class="danger-button delete-button" @tap="confirmDelete">删除宠物档案</button>

    <AppConfirmDialog
      :open="deleteConfirmOpen"
      title="删除宠物档案"
      message="删除后无法恢复，是否继续？"
      icon="paw"
      confirm-text="确认删除"
      danger
      @close="deleteConfirmOpen = false"
      @confirm="deletePet"
    />
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import AppConfirmDialog from '../../components/AppConfirmDialog.vue'
import { deletePetProfile, getActivePets, updatePetProfile } from '../../common/pets.js'

export default {
  components: { AppTopBar, AppConfirmDialog },
  data() {
    return {
      pet: getActivePets()[0],
      editing: false,
      deleteConfirmOpen: false,
      profile: { name: '旺财', breed: '威尔士柯基犬', gender: '公', birthday: '2024-03-18', weight: '10.8 kg' },
      fields: [
        { key: 'name', label: '昵称', icon: 'user' }, { key: 'breed', label: '品种', icon: 'paw' },
        { key: 'gender', label: '性别', icon: 'gender' }, { key: 'birthday', label: '生日', icon: 'calendar' },
        { key: 'weight', label: '当前体重', icon: 'weight' }
      ]
    }
  },
  onLoad(options) {
    const activePets = getActivePets()
    const index = Math.max(0, activePets.findIndex(item => item.id === Number(options.id || activePets[0].id)))
    this.pet = activePets[index]
    this.profile.name = this.pet.name
    this.profile.breed = this.pet.type
    this.profile.gender = ['女孩', '母'].includes(this.pet.gender)
      ? '母'
      : ['男孩', '公'].includes(this.pet.gender) ? '公' : '未设置'
    this.profile.birthday = this.pet.birthday || this.profile.birthday
    this.profile.weight = `${this.pet.weight} kg`
  },
  methods: {
    toggleEditing() {
      if (!this.pet.canEdit) {
        uni.showToast({ title: '仅家庭组管理员可编辑', icon: 'none' })
        return
      }
      if (this.editing) {
        const updated = updatePetProfile(this.pet.id, {
          name: this.profile.name.trim(),
          type: this.profile.breed.trim(),
          gender: this.profile.gender,
          birthday: this.profile.birthday,
          weight: String(this.profile.weight).replace(/\s*kg$/i, '').trim()
        })
        if (!updated) {
          uni.showToast({ title: '无权修改该宠物资料', icon: 'none' })
          return
        }
        this.pet = getActivePets().find(item => item.id === this.pet.id) || this.pet
        uni.showToast({ title: '宠物资料已保存', icon: 'success' })
      }
      this.editing = !this.editing
    },
    confirmDelete() {
      this.deleteConfirmOpen = true
    },
    deletePet() {
      this.deleteConfirmOpen = false
      const result = deletePetProfile(this.pet.id)
      if (!result.success) {
        uni.showToast({ title: result.reason === 'forbidden' ? '仅档案创建者可删除' : '至少需要保留一只宠物', icon: 'none' })
        return
      }
      uni.showToast({
        title: '宠物档案已删除',
        icon: 'success',
        duration: 1200
      })
      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) uni.navigateBack()
        else uni.reLaunch({ url: '/pages/pet/manage' })
      }, 1200)
    }
  }
}
</script>

<style scoped>
.pet-profile-hero {
  min-height: 300rpx;
  padding: 40rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #f9e7bb, #efcf91);
  display: grid;
  grid-template-columns: 200rpx 1fr;
  grid-template-rows: auto auto;
  align-content: center;
  column-gap: 32rpx;
  text-align: left;
}

.profile-avatar {
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
  grid-row: 1 / 3;
  border: 10rpx solid rgba(255,255,255,.68);
  border-radius: 50%;
  background: #fff2df;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 58rpx;
}

.profile-avatar image {
  width: 100%;
  height: 100%;
}

.pet-name {
  align-self: end;
  margin: 0 0 8rpx;
  font-size: 52rpx;
  font-weight: 600;
}

.pet-profile-hero > .muted {
  align-self: start;
  color: rgba(102,82,71,.72);
  font-size: 22rpx;
}

.info-card {
  margin-top: 28rpx;
  padding: 30rpx;
}

.info-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-row {
  min-height: 82rpx;
  padding: 12rpx 16rpx;
  border-radius: 22rpx;
  background: var(--surface-strong);
  display: grid;
  grid-template-columns: 54rpx 1fr;
  align-items: center;
  gap: 16rpx;
}

.info-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-row view {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.info-row .muted {
  font-size: 20rpx;
}

.info-row input {
  height: 42rpx;
  border-bottom: 1rpx solid #d6b892;
}

.delete-button {
  margin-top: 24rpx;
  width: 100%;
}
</style>
