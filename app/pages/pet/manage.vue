<template>
  <view class="page no-tab">
    <AppTopBar title="宠物管理" back />

    <view class="pet-list">
      <button v-for="pet in pets" :key="pet.id" class="pet-manage-item" :class="{ peach: pet.id === 2 }" @tap="openPet(pet.id)">
        <view class="pet-avatar">
          <image v-if="pet.avatar" :src="pet.avatar" mode="aspectFill" />
          <AppIcon v-else :name="pet.icon" size="62rpx" />
        </view>
        <view>
          <text class="pet-source">{{ pet.sourceLabel }}</text>
          <text class="pet-name">{{ pet.name }}</text>
          <text class="muted">{{ pet.type }} · {{ pet.age }}</text>
        </view>
        <AppIcon class="arrow" name="chevron-right" size="30rpx" />
      </button>
    </view>

    <button class="add-pet card" @tap="openAdd">
      <view class="add-icon"><AppIcon name="plus" size="34rpx" /></view>
      <text>添加宠物</text>
      <text class="muted">创建新的宠物档案</text>
    </button>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { getActivePets, getPetsForFamily } from '../../common/pets.js'

export default {
  components: { AppTopBar },
  data() { return { familyCode: '', pets: getActivePets() } },
  onLoad(options) { this.familyCode = options.familyCode || '' },
  onShow() {
    this.pets = this.familyCode ? getPetsForFamily(this.familyCode) : getActivePets()
  },
  methods: {
    openPet(id) { uni.navigateTo({ url: `/pages/pet/profile?id=${id}` }) },
    openAdd() { uni.navigateTo({ url: '/pages/pet/add' }) }
  }
}
</script>

<style scoped>
.pet-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.pet-manage-item {
  width: 100%;
  min-height: 216rpx;
  padding: 30rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #f9e7bb, #efcf91);
  display: grid;
  grid-template-columns: 144rpx 1fr 36rpx;
  align-items: center;
  gap: 20rpx;
  text-align: left;
}

.pet-manage-item.peach {
  background: linear-gradient(135deg, #f6dfc9, #eabf9f);
}

.pet-avatar {
  width: 140rpx;
  height: 140rpx;
  overflow: hidden;
  border: 8rpx solid rgba(255,255,255,.72);
  border-radius: 50%;
  background: #fff5e7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 58rpx;
}

.pet-avatar image { width: 100%; height: 100%; }
.pet-manage-item > view:nth-child(2) { display: flex; flex-direction: column; gap: 5rpx; }
.pet-name { font-size: 40rpx; font-weight: 600; }
.pet-source { align-self: flex-start; max-width: 320rpx; overflow: hidden; padding: 5rpx 11rpx; border: 1rpx solid #ead2ae; border-radius: 999rpx; color: #95663f; background: #f7e7c2; font-size: 20rpx; font-weight: 500; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
.pet-manage-item .muted { color: rgba(102,82,71,.7); font-size: 18rpx; }
.arrow { font-size: 48rpx; }

.add-pet {
  width: 100%;
  min-height: 240rpx;
  margin-top: 20rpx;
  border: 3rpx dashed #d8b985;
  border-radius: 40rpx;
  background: #fffcf6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
}

.add-icon {
  width: 62rpx;
  height: 62rpx;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-dark);
  font-size: 40rpx;
}

.add-pet .muted { font-size: 22rpx; }
</style>
