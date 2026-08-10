<template>
  <view class="page no-tab pet-add-page">
    <AppTopBar title="添加宠物" back center />
    <form class="add-form" @submit="save">
      <button class="avatar-upload" @tap="chooseImage">
        <view class="avatar-frame">
          <image v-if="avatar" :src="avatar" mode="aspectFill" />
          <AppIcon v-else :name="form.type === '猫' ? 'cat' : 'dog'" size="64rpx" />
          <view class="avatar-add"><AppIcon name="plus" size="22rpx" /></view>
        </view>
        <text class="upload-title">{{ avatar ? '更换宠物头像' : '上传宠物头像' }}</text>
        <text class="upload-hint">建议选择清晰的正面照片</text>
      </button>

      <view class="form-list">
        <label><text>宠物昵称</text><view class="field"><input v-model="form.name" placeholder="请输入昵称" /></view></label>
        <label><text>宠物类型</text>
          <button class="field row-between" @tap="typePickerOpen = true">
            <text>{{ form.type }}</text><AppIcon name="chevron-down" size="24rpx" />
          </button>
        </label>
        <label><text>品种</text><view class="field"><input v-model="form.breed" placeholder="请输入或搜索品种" /></view></label>
        <label><text>生日</text>
          <button class="field row-between" @tap="openBirthdayPicker">
            <text>{{ form.birthday }}</text><AppIcon name="calendar" size="26rpx" />
          </button>
        </label>
        <label><text>当前体重</text><view class="field weight-field"><input v-model="form.weight" type="digit" placeholder="0.0" /><text>kg</text></view></label>
      </view>

      <button class="primary-button" form-type="submit" :disabled="saving">{{ saving ? '正在创建' : '创建宠物档案' }}</button>
    </form>

    <AppOptionSheet
      :open="typePickerOpen"
      title="宠物类型"
      eyebrow="选择准备创建的档案类型"
      :options="typeOptions"
      :model-value="form.type"
      @close="typePickerOpen = false"
      @select="selectType"
    />

    <AppWheelSheet
      :open="birthdayPickerOpen"
      title="选择生日"
      :columns="birthdayColumns"
      :value="birthdayPickerValue"
      :suffixes="[' 年', ' 月', ' 日']"
      @close="birthdayPickerOpen = false"
      @change="birthdayPickerChange"
      @confirm="confirmBirthday"
    />
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import AppOptionSheet from '../../components/AppOptionSheet.vue'
import AppWheelSheet from '../../components/AppWheelSheet.vue'
import { createPetProfile } from '../../common/pets.js'

export default {
  components: { AppTopBar, AppOptionSheet, AppWheelSheet },
  data() {
    return {
      avatar: '',
      saving: false,
      typePickerOpen: false,
      birthdayPickerOpen: false,
      birthdayPickerValue: [26, 0, 0],
      typeOptions: [
        { label: '狗', value: '狗', icon: 'dog', description: '创建犬类宠物档案' },
        { label: '猫', value: '猫', icon: 'cat', description: '创建猫类宠物档案' }
      ],
      form: { name: '', type: '狗', breed: '', birthday: '2026-01-01', weight: '' }
    }
  },
  computed: {
    birthdayColumns() {
      const year = 2000 + Number(this.birthdayPickerValue[0] || 0)
      const month = Number(this.birthdayPickerValue[1] || 0) + 1
      const dayCount = new Date(year, month, 0).getDate()
      return [
        Array.from({ length: 27 }, (_, index) => 2000 + index),
        Array.from({ length: 12 }, (_, index) => index + 1),
        Array.from({ length: dayCount }, (_, index) => index + 1)
      ]
    }
  },
  methods: {
    selectType(value) {
      this.form.type = value
      this.typePickerOpen = false
    },
    openBirthdayPicker() {
      const [year, month, day] = this.form.birthday.split('-').map(Number)
      this.birthdayPickerValue = [year - 2000, month - 1, day - 1]
      this.birthdayPickerOpen = true
    },
    birthdayPickerChange(value) {
      const year = 2000 + Number(value[0])
      const month = Number(value[1]) + 1
      const maxDayIndex = new Date(year, month, 0).getDate() - 1
      this.birthdayPickerValue = [value[0], value[1], Math.min(value[2], maxDayIndex)]
    },
    confirmBirthday() {
      const [yearIndex, monthIndex, dayIndex] = this.birthdayPickerValue
      const year = this.birthdayColumns[0][yearIndex]
      const month = String(this.birthdayColumns[1][monthIndex]).padStart(2, '0')
      const day = String(this.birthdayColumns[2][dayIndex]).padStart(2, '0')
      this.form.birthday = `${year}-${month}-${day}`
      this.birthdayPickerOpen = false
    },
    chooseImage() {
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: result => { this.avatar = result.tempFiles[0].tempFilePath }
      })
    },
    save() {
      if (!this.form.name.trim()) return uni.showToast({ title: '请填写宠物昵称', icon: 'none' })
      if (this.saving) return
      this.saving = true

      const finishCreate = (avatarPath = '') => {
        createPetProfile({
          name: this.form.name.trim(),
          type: this.form.breed.trim() || (this.form.type === '猫' ? '猫' : '犬'),
          age: this.calculateAge(this.form.birthday),
          icon: this.form.type === '猫' ? 'cat' : 'dog',
          avatar: avatarPath,
          gender: '未设置',
          birthday: this.form.birthday,
          weight: this.form.weight || '0.0'
        })
        uni.showToast({ title: '档案已创建', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 700)
      }

      if (!this.avatar) {
        finishCreate()
        return
      }

      uni.saveFile({
        tempFilePath: this.avatar,
        success: result => finishCreate(result.savedFilePath),
        fail: () => finishCreate(this.avatar)
      })
    },
    calculateAge(birthday) {
      const birthDate = new Date(`${birthday}T00:00:00`)
      const today = new Date()
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth()
      if (today.getDate() < birthDate.getDate()) months -= 1
      months = Math.max(0, months)
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return years ? `${years}岁 ${remainingMonths}个月` : `${remainingMonths}个月`
    }
  }
}
</script>

<style scoped>
.pet-add-page {
  padding-left: 32rpx;
  padding-right: 32rpx;
}

.add-form {
  display: flex;
  flex-direction: column;
  padding-bottom: calc(34rpx + env(safe-area-inset-bottom));
}

.form-list {
  margin-top: 38rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.form-list label {
  display: flex;
  flex-direction: column;
  gap: 13rpx;
  color: #655247;
  font-size: 24rpx;
  font-weight: 500;
}

.avatar-upload {
  width: 100%;
  margin: 30rpx auto 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6d5545;
  background: transparent;
}

.avatar-frame {
  width: 166rpx;
  height: 166rpx;
  position: relative;
  border: 7rpx solid #f2dfc5;
  border-radius: 50%;
  color: #b28359;
  background: linear-gradient(145deg, #fff8ec, #f8e6c9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14rpx 32rpx rgba(111,76,45,.09);
}

.avatar-frame image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-add {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: -6rpx;
  bottom: 2rpx;
  border: 4rpx solid white;
  border-radius: 50%;
  color: white;
  background: #b27a49;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 14rpx rgba(95,61,34,.15);
}

.upload-title {
  margin-top: 18rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.upload-hint {
  margin-top: 5rpx;
  color: #a79587;
  font-size: 20rpx;
  font-weight: 400;
}

.form-list .field {
  min-height: 94rpx;
  padding-left: 24rpx;
  padding-right: 24rpx;
  border-radius: 25rpx;
}

.weight-field input { flex: 1; }
.add-form .primary-button {
  width: 100%;
  min-height: 88rpx;
  margin-top: 38rpx;
}

.add-form .primary-button[disabled] {
  color: #ad9f92;
  background: #e9e0d5;
  box-shadow: none;
}
</style>
