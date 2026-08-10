<template>
  <view class="page home-page">
    <view class="home-top" :style="navigationStyle">
      <view class="home-brand">
        <text class="brand">宠迹管家</text>
      </view>
      <view class="home-nav-actions">
        <view class="home-action-capsule">
          <button class="round-action" aria-label="宠物管理" @tap="openPetManage">
            <AppIcon name="paw" size="30rpx" />
          </button>
          <view class="action-divider" />
          <button class="brand-message" aria-label="消息提醒" @tap="openMessages">
            <AppIcon name="bell" size="30rpx" />
            <text class="dot" />
          </button>
        </view>
      </view>
      <view class="home-top-spacer" />
    </view>

    <view class="pet-carousel">
      <swiper
        class="pet-swiper"
        :current="petSwiperIndex"
        :duration="petSwiperDuration"
        easing-function="easeOutCubic"
        @change="onPetChange"
        @animationfinish="onPetAnimationFinish"
      >
        <swiper-item v-for="(pet, index) in petSlides" :key="`${pet.id}-${index}`">
          <view class="pet-slide">
            <view
              class="pet-hero"
              :class="{ peach: pet.id === 2 }"
              role="button"
              :aria-label="`查看${pet.name}的宠物信息`"
              @tap="openPetProfile(pet.id)"
            >
              <view class="pet-avatar">
                <image v-if="pet.avatar" :src="pet.avatar" mode="aspectFill" />
                <AppIcon v-else :name="pet.icon" size="90rpx" />
              </view>
              <view class="pet-copy">
                <text class="pet-kicker">{{ pet.sourceLabel }}</text>
                <text class="pet-name">{{ pet.name }}</text>
                <text class="pet-meta">{{ pet.type }} · {{ pet.age }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="swiper-dots">
        <text v-for="(_, index) in pets" :key="index" :class="{ active: index === petIndex }" />
      </view>
    </view>

    <view class="checkin card">
      <button class="checkin-head" @tap="checkinOpen = !checkinOpen">
        <view>
          <view class="checkin-kicker-row">
            <text class="section-kicker">今日健康打卡</text>
            <text class="checkin-pet-name">{{ currentCheckinPet.name }}</text>
          </view>
          <text class="checkin-title">{{ checkinTitle }}</text>
        </view>
        <view class="collapse"><AppIcon :name="checkinOpen ? 'chevron-up' : 'chevron-down'" size="24rpx" /></view>
      </button>

      <view v-if="checkinOpen" class="health-list">
        <view v-for="item in healthRows" :key="item.key" class="health-row">
          <view class="health-label">
            <view class="health-icon"><AppIcon :name="item.icon" size="27rpx" /></view>
            <text>{{ item.label }}</text>
          </view>

          <view v-if="canEditCheckin && item.mode === 'input'" class="health-control">
            <view class="health-value">
              <input v-model="health[item.key]" type="digit" :aria-label="`${item.label}数值`" />
              <text class="health-inner-suffix health-unit-suffix">{{ item.unit }}</text>
            </view>
          </view>

          <button
            v-else-if="canEditCheckin"
            class="health-picker"
            :aria-label="`选择${item.label}`"
            @tap="openChoicePicker(item)"
          >
            <view class="health-control">
              <view class="health-value choice">
                <text>{{ health[item.key] }}</text>
                <AppIcon class="health-inner-suffix health-inner-arrow" name="chevron-down" size="20rpx" />
              </view>
            </view>
          </button>

          <view v-else class="health-control health-control-static">
            <view class="health-value health-value-static">
              <text>{{ health[item.key] }}</text>
              <text v-if="item.mode === 'input'" class="health-inline-unit">{{ item.unit }}</text>
            </view>
          </view>
        </view>
        <view class="checkin-actions" :class="{ multiple: pets.length > 1 }">
          <button class="primary-button checkin-button" @tap="completeCheckin">
            <text>{{ checkinButtonLabel }}</text>
          </button>
          <button v-if="pets.length > 1" class="next-pet-button" @tap="showNextCheckinPet">
            <text>{{ nextCheckinPetName }}</text>
            <view class="next-pet-arrow">
              <AppIcon name="back" size="34rpx" />
            </view>
          </button>
        </view>
      </view>
    </view>

    <view class="section tasks-section">
      <view class="row-between">
        <view>
          <text class="section-kicker">今日安排</text>
          <text class="section-title">宠物任务</text>
        </view>
        <text class="pill">{{ doneCount }}/{{ taskList.length }} 已完成</text>
      </view>

      <view class="task-list">
        <view
          v-for="task in taskList"
          :id="`task-item-${task.id}`"
          :key="task.renderKey"
          class="task-item card"
          :class="{ completed: task.done }"
          :style="taskMotionStyle(task.id)"
        >
          <view class="task-main" role="button" :aria-label="`编辑任务：${task.title}`" @tap="openTaskEditor(task.id)">
            <text class="task-time">{{ task.time }}</text>
            <view class="task-copy">
              <view class="task-title-row">
                <text class="task-title">{{ task.title }}</text>
                <text class="task-pet-tag">{{ taskPetLabel(task) }}</text>
              </view>
              <text class="muted">{{ task.note }}</text>
            </view>
          </view>
          <button class="task-check-area" :aria-label="task.done ? '取消完成' : '标记完成'" @tap.stop="toggleTask(task.id)">
            <view class="task-check" :class="{ done: task.done }">
              <AppIcon v-if="task.done" name="task-check-clean" size="25rpx" />
            </view>
          </button>
        </view>
      </view>

      <button class="add-task" @tap="openCreateTask"><AppIcon name="task-plus-clean" size="27rpx" /><text>新增宠物任务</text></button>
    </view>

    <AppBottomNav active="home" />

    <AppOptionSheet
      :open="choicePicker.open"
      :title="choicePicker.label"
      eyebrow="选择记录状态"
      :options="choicePicker.options"
      :model-value="health[choicePicker.key]"
      @close="closeChoicePicker"
      @select="selectHealthChoice"
    />
  </view>
</template>

<script>
import AppBottomNav from '../../components/AppBottomNav.vue'
import AppOptionSheet from '../../components/AppOptionSheet.vue'
import { tasks } from '../../common/data.js'
import { getNavigationStyle } from '../../common/navigation.js'
import { getActivePets } from '../../common/pets.js'

const taskMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

const sortTaskItems = (items) => [...items].sort((left, right) => {
  if (left.done !== right.done) return left.done ? 1 : -1
  return taskMinutes(left.time) - taskMinutes(right.time)
})

export default {
  components: { AppBottomNav, AppOptionSheet },
  data() {
    const activePets = getActivePets()
    return {
      navigationStyle: getNavigationStyle(),
      pets: activePets,
      petIndex: 0,
      petSwiperIndex: activePets.length > 1 ? 1 : 0,
      petSwiperDuration: 420,
      isWrappingPet: false,
      checkinPetIndex: 0,
      checkinOpen: true,
      completedPetIds: [],
      editingPetIds: [],
      choicePicker: {
        open: false,
        key: '',
        label: '',
        options: []
      },
      taskOffsets: {},
      taskTransitionEnabled: false,
      taskReorderLocked: false,
      taskList: sortTaskItems(tasks.map(item => ({
        ...item,
        renderKey: `${item.id}-${item.done ? 'done' : 'pending'}`
      }))),
      healthByPet: Object.fromEntries(activePets.map(pet => [
        pet.id,
        {
          food: '正常',
          water: '正常',
          walk: '60',
          stool: '未排便',
          weight: pet.weight,
          spirit: '正常'
        }
      ]))
    }
  },
  computed: {
    petSlides() {
      if (this.pets.length < 2) return this.pets
      return [this.pets[this.pets.length - 1], ...this.pets, this.pets[0]]
    },
    currentPet() {
      return this.pets[this.petIndex]
    },
    currentCheckinPet() {
      return this.pets[this.checkinPetIndex]
    },
    nextCheckinPetName() {
      if (this.pets.length < 2) return ''
      const nextIndex = (this.checkinPetIndex + 1) % this.pets.length
      const nextPet = this.pets[nextIndex]
      return nextPet ? nextPet.name : ''
    },
    health() {
      return this.healthByPet[this.currentCheckinPet.id]
    },
    completed() {
      return this.completedPetIds.includes(this.currentCheckinPet.id)
    },
    editing() {
      return this.editingPetIds.includes(this.currentCheckinPet.id)
    },
    canEditCheckin() {
      return !this.completed || this.editing
    },
    checkinButtonLabel() {
      if (!this.completed) return '提交'
      return this.editing ? '保存修改' : '修改'
    },
    allCheckinsCompleted() {
      return this.pets.length > 0 && this.completedPetIds.length === this.pets.length
    },
    checkinTitle() {
      if (this.allCheckinsCompleted) return '所有伙伴今日均已完成'
      return this.completed ? '今天记录得很棒！' : '还差一步，完成今日记录'
    },
    doneCount() {
      return this.taskList.filter(item => item.done).length
    },
    healthRows() {
      return [
        { key: 'food', label: '食量', icon: 'meal', mode: 'choice', options: ['正常', '少', '多', '拒食'] },
        { key: 'water', label: '饮水', icon: 'water', mode: 'choice', options: ['正常', '少', '多', '未饮水'] },
        { key: 'walk', label: '遛弯', icon: 'paw', mode: 'input', unit: '分钟' },
        { key: 'stool', label: '排便', icon: 'stool', mode: 'choice', options: ['正常', '便秘', '腹泻', '未排便'] },
        { key: 'weight', label: '体重', icon: 'weight', mode: 'input', unit: 'kg' },
        { key: 'spirit', label: '精神', icon: 'mood', mode: 'choice', options: ['正常', '活跃', '低迷', '暴躁'] }
      ]
    }
  },
  onShow() {
    this.navigationStyle = getNavigationStyle()
    const activePets = getActivePets()
    this.pets = activePets
    this.petIndex = Math.min(this.petIndex, activePets.length - 1)
    this.petSwiperIndex = activePets.length > 1 ? this.petIndex + 1 : this.petIndex
    this.petSwiperDuration = 420
    this.isWrappingPet = false
    this.checkinPetIndex = Math.min(this.checkinPetIndex, activePets.length - 1)
    const activePetIds = activePets.map(pet => pet.id)
    this.completedPetIds = this.completedPetIds.filter(id => activePetIds.includes(id))
    this.editingPetIds = this.editingPetIds.filter(id => activePetIds.includes(id))
    activePets.forEach(pet => {
      if (this.healthByPet[pet.id]) return
      this.healthByPet[pet.id] = {
        food: '正常', water: '正常', walk: '60', stool: '未排便', weight: pet.weight, spirit: '正常'
      }
    })
    const savedTasks = uni.getStorageSync('petTasks')
    if (Array.isArray(savedTasks) && savedTasks.length) {
      this.taskList = sortTaskItems(savedTasks.map(item => ({
        ...item,
        renderKey: `${item.id}-${item.done ? 'done' : 'pending'}`
      })))
    }
  },
  onResize() {
    this.navigationStyle = getNavigationStyle()
  },
  methods: {
    taskPetLabel(task) {
      const fallbackId = this.pets[0] ? this.pets[0].id : null
      const petIds = Array.isArray(task.petIds) && task.petIds.length
        ? task.petIds
        : fallbackId === null ? [] : [fallbackId]
      const names = petIds
        .map(id => this.pets.find(pet => Number(pet.id) === Number(id)))
        .filter(Boolean)
        .map(pet => pet.name)
      return names.length ? names.join('、') : '未指定'
    },
    onPetChange(event) {
      const visualIndex = event.detail.current
      let nextIndex = visualIndex

      if (this.pets.length > 1) {
        if (visualIndex === 0) nextIndex = this.pets.length - 1
        else if (visualIndex === this.pets.length + 1) nextIndex = 0
        else nextIndex = visualIndex - 1
      }

      this.petSwiperIndex = visualIndex
      this.petIndex = nextIndex
      this.checkinPetIndex = nextIndex
      this.isWrappingPet = this.pets.length > 1 && (visualIndex === 0 || visualIndex === this.pets.length + 1)
      this.closeChoicePicker()
    },
    onPetAnimationFinish(event) {
      if (this.pets.length < 2) return

      const visualIndex = event.detail.current
      let resetIndex = null
      if (visualIndex === 0) resetIndex = this.pets.length
      if (visualIndex === this.pets.length + 1) resetIndex = 1
      if (resetIndex === null) return

      this.petSwiperDuration = 0
      this.$nextTick(() => {
        this.petSwiperIndex = resetIndex
        this.$nextTick(() => {
          this.isWrappingPet = false
          this.petSwiperDuration = 420
        })
      })
    },
    openChoicePicker(item) {
      this.choicePicker = {
        open: true,
        key: item.key,
        label: item.label,
        options: item.options
      }
    },
    closeChoicePicker() {
      this.choicePicker.open = false
    },
    selectHealthChoice(option) {
      this.health[this.choicePicker.key] = option
      this.closeChoicePicker()
    },
    completeCheckin() {
      if (!this.completed) {
        this.completedPetIds = [...this.completedPetIds, this.currentCheckinPet.id]
        uni.showToast({ title: '今日打卡已提交', icon: 'success' })
        return
      }

      if (this.editing) {
        this.editingPetIds = this.editingPetIds.filter(id => id !== this.currentCheckinPet.id)
        this.closeChoicePicker()
        uni.showToast({ title: '修改已保存', icon: 'success' })
        return
      }

      this.editingPetIds = [...this.editingPetIds, this.currentCheckinPet.id]
    },
    showNextCheckinPet() {
      if (this.pets.length < 2 || this.isWrappingPet) return
      const nextIndex = (this.checkinPetIndex + 1) % this.pets.length
      this.checkinPetIndex = nextIndex
      this.petIndex = nextIndex
      this.closeChoicePicker()

      if (nextIndex === 0) {
        this.petSwiperDuration = 420
        this.isWrappingPet = true
        this.petSwiperIndex = this.pets.length + 1
        return
      }

      this.petSwiperIndex = nextIndex + 1
    },
    toggleTask(id) {
      if (this.taskReorderLocked) return
      this.taskReorderLocked = true

      this.measureTaskPositions((beforePositions) => {
        this.updateTaskState(id)
        this.$nextTick(() => {
          this.measureTaskPositions((afterPositions) => {
            const offsets = {}
            Object.keys(afterPositions).forEach((taskId) => {
              offsets[taskId] = (beforePositions[taskId] ?? afterPositions[taskId]) - afterPositions[taskId]
            })

            this.taskTransitionEnabled = false
            this.taskOffsets = offsets

            setTimeout(() => {
              this.taskTransitionEnabled = true
              this.taskOffsets = Object.fromEntries(
                Object.keys(afterPositions).map(taskId => [taskId, 0])
              )

              setTimeout(() => {
                this.taskOffsets = {}
                this.taskTransitionEnabled = false
                this.taskReorderLocked = false
              }, 380)
            }, 30)
          })
        })
      })
    },
    updateTaskState(id) {
      const updatedTasks = this.taskList.map(item => {
        if (item.id !== id) return item
        const done = !item.done
        return {
          ...item,
          done,
          renderKey: `${item.id}-${done ? 'done' : 'pending'}`
        }
      })
      this.taskList = sortTaskItems(updatedTasks)
      this.persistTasks()
    },
    persistTasks() {
      const storedTasks = this.taskList.map(({ renderKey, ...item }) => item)
      uni.setStorageSync('petTasks', storedTasks)
    },
    measureTaskPositions(callback) {
      uni.createSelectorQuery()
        .in(this)
        .selectAll('.task-item')
        .boundingClientRect((rects) => {
          const positions = {}
          ;(rects || []).forEach((rect) => {
            const taskId = String(rect.id || '').replace('task-item-', '')
            if (taskId) positions[taskId] = rect.top
          })
          callback(positions)
        })
        .exec()
    },
    taskMotionStyle(id) {
      const offset = this.taskOffsets[id] || 0
      return {
        transform: `translate3d(0, ${offset}px, 0)`,
        transition: this.taskTransitionEnabled
          ? 'transform 350ms cubic-bezier(.22, .8, .3, 1)'
          : 'none',
        zIndex: offset ? 2 : 1
      }
    },
    openCreateTask() {
      uni.navigateTo({ url: '/pages/task/create' })
    },
    openTaskEditor(id) {
      uni.navigateTo({ url: `/pages/task/create?id=${id}` })
    },
    openPetManage() {
      uni.navigateTo({ url: '/pages/pet/manage' })
    },
    openPetProfile(id) {
      uni.navigateTo({ url: `/pages/pet/profile?id=${id}` })
    },
    openMessages() {
      uni.navigateTo({ url: '/pages/messages/index' })
    }
  }
}
</script>

<style scoped>
.home-page {
  padding-top: 0;
}

.home-top {
  position: -webkit-sticky;
  position: sticky;
  z-index: 40;
  top: 0;
  min-height: 112rpx;
  margin: 0 -40rpx 24rpx;
  padding: calc(env(safe-area-inset-top) + 102rpx) 40rpx 20rpx;
  box-sizing: border-box;
  background: var(--paper);
  box-shadow: 0 10rpx 24rpx rgba(91, 67, 48, .045);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) var(--menu-side-width, 156rpx);
  grid-auto-rows: var(--menu-button-height, 66rpx);
  column-gap: 14rpx;
  align-items: center;
}

.home-brand {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
}

.home-nav-actions {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.brand {
  color: #8f5f3e;
  font-size: 36rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.home-action-capsule {
  height: 64rpx;
  padding: 0 8rpx;
  border: 1rpx solid #e4caa8;
  border-radius: 24rpx;
  background: #fff8eb;
  box-shadow: 0 6rpx 16rpx rgba(116, 79, 48, .07);
  display: flex;
  align-items: center;
}

.action-divider {
  width: 1rpx;
  height: 28rpx;
  background: #e5cfb2;
}

.brand-message {
  position: relative;
  width: 60rpx;
  height: 62rpx;
  padding: 0;
  border: 0;
  border-radius: 18rpx;
  color: #a6734d;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-message:active,
.round-action:active {
  background: #f8ead4;
  opacity: .78;
}

.round-action {
  position: relative;
  width: 60rpx;
  min-width: 60rpx;
  height: 62rpx;
  padding: 0;
  border: 0;
  border-radius: 18rpx;
  color: #a6734d;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-message::after,
.round-action::after {
  border: 0;
}

.dot {
  position: absolute;
  top: 8rpx;
  right: 9rpx;
  width: 10rpx;
  height: 10rpx;
  border: 2rpx solid #fff8eb;
  border-radius: 50%;
  background: #d76f53;
}

.pet-swiper {
  height: 292rpx;
}

.pet-carousel {
  position: relative;
  height: 292rpx;
  margin-right: -40rpx;
  margin-left: -40rpx;
  overflow: hidden;
}

.pet-slide {
  height: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.pet-hero {
  position: relative;
  width: 100%;
  height: 286rpx;
  padding: 34rpx 38rpx;
  box-sizing: border-box;
  overflow: hidden;
  border: 2rpx solid #ead6b8;
  border-radius: 42rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
}

.pet-hero:active {
  opacity: .88;
}

.pet-hero::before {
  content: "";
  position: absolute;
  left: -82rpx;
  top: -102rpx;
  width: 280rpx;
  height: 400rpx;
  border-radius: 50%;
  background: #f7e9ca;
  transform: rotate(11deg);
}

.pet-hero::after {
  content: "";
  position: absolute;
  right: -78rpx;
  bottom: -114rpx;
  width: 212rpx;
  height: 212rpx;
  border: 34rpx solid #fbf0d8;
  border-radius: 50%;
}

.pet-hero.peach {
  background: #fffaf7;
}

.pet-hero.peach::before {
  background: #f5ded1;
}

.pet-avatar {
  position: relative;
  z-index: 2;
  width: 174rpx;
  height: 174rpx;
  overflow: hidden;
  border: 9rpx solid #fff;
  border-radius: 50%;
  background: #fff2df;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 26rpx rgba(108, 77, 51, .08);
}

.pet-avatar image {
  width: 100%;
  height: 100%;
}

.pet-copy {
  position: relative;
  z-index: 2;
  margin-left: 34rpx;
  display: flex;
  flex-direction: column;
}

.pet-kicker {
  max-width: 330rpx;
  align-self: flex-start;
  overflow: hidden;
  padding: 5rpx 11rpx;
  border: 1rpx solid #ead2ae;
  border-radius: 999rpx;
  color: #95663f;
  background: #f7e7c2;
  font-size: 20rpx;
  font-weight: 500;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-name {
  margin: 7rpx 0 9rpx;
  color: #594236;
  font-size: 52rpx;
  font-weight: 600;
  line-height: 1.05;
}

.pet-meta {
  color: #978577;
  font-size: 24rpx;
}

.swiper-dots {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  bottom: 16rpx;
  height: 18rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rpx;
}

.swiper-dots text {
  width: 10rpx;
  height: 10rpx;
  border-radius: 99rpx;
  background: #d7c2a9;
}

.swiper-dots text.active {
  width: 30rpx;
  background: #89684f;
}

.checkin {
  margin-top: 24rpx;
  padding: 20rpx 22rpx 22rpx;
}

.checkin-head {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 28rpx;
  align-items: center;
  text-align: left;
}

.checkin-title {
  display: block;
  margin-top: 5rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.checkin-kicker-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.checkin-pet-name {
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  color: #9a6a42;
  background: #f7e7c2;
  font-size: 18rpx;
  font-weight: 500;
}

.collapse {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
}

.health-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.health-row {
  min-height: 78rpx;
  padding: 10rpx 18rpx;
  border-radius: 22rpx;
  background: #fbf5ec;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.health-label {
  display: flex;
  align-items: center;
  gap: 18rpx;
  color: #7d6a5d;
}

.health-icon {
  width: 52rpx;
  height: 52rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.health-picker {
  width: 226rpx;
  flex-shrink: 0;
}

.health-control {
  width: 226rpx;
  display: block;
  flex-shrink: 0;
}

.health-value {
  position: relative;
  width: 170rpx;
  margin-left: auto;
  min-height: 56rpx;
  padding: 0 8rpx;
  box-sizing: border-box;
  border: 1rpx solid var(--line);
  border-radius: 15rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #645043;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.health-value input {
  flex: 0 0 calc(100% - 52rpx);
  width: calc(100% - 52rpx);
  margin-right: 52rpx;
  color: #645043;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
}

.health-inner-suffix {
  position: absolute;
  right: 14rpx;
  top: 50%;
  width: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #907a6a;
  font-size: 18rpx;
  font-weight: 400;
  line-height: 1;
  transform: translateY(-50%);
  pointer-events: none;
}

.health-inner-arrow {
  right: 14rpx;
}

.health-unit-suffix {
  right: 10rpx;
  width: 48rpx;
  font-size: 22rpx;
}

.health-value.choice {
  justify-content: flex-start;
}

.health-value.choice > text:first-child {
  flex: 0 0 calc(100% - 40rpx);
  width: calc(100% - 40rpx);
  margin-right: 40rpx;
  text-align: center;
}

.health-value-static {
  border-color: transparent;
  background: transparent;
  gap: 5rpx;
  justify-content: flex-end;
  padding-right: 14rpx;
  text-align: right;
}

.health-inline-unit {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.choice-mask {
  position: fixed;
  z-index: 60;
  inset: 0;
  padding: 24rpx;
  background: rgba(73, 56, 44, .38);
  display: flex;
  align-items: flex-end;
}

.choice-sheet {
  width: 100%;
  padding: 14rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  border: 1rpx solid #eadcc7;
  border-radius: 38rpx;
  background: #fffdf9;
  box-shadow: 0 -18rpx 52rpx rgba(91, 67, 48, .16);
}

.choice-sheet-handle {
  width: 66rpx;
  height: 7rpx;
  margin: 0 auto 20rpx;
  border-radius: 99rpx;
  background: #dbc9b7;
}

.choice-sheet-head {
  min-height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.choice-sheet-title {
  display: block;
  color: var(--ink);
  font-size: 32rpx;
  font-weight: 600;
}

.choice-cancel {
  min-width: 82rpx;
  height: 58rpx;
  border: 1rpx solid var(--line);
  border-radius: 18rpx;
  color: var(--brand-dark);
  background: #fbf6ed;
  font-size: 24rpx;
}

.choice-options {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.choice-option {
  width: 100%;
  min-height: 78rpx;
  padding: 0 20rpx 0 24rpx;
  border: 1rpx solid transparent;
  border-radius: 22rpx;
  color: #756155;
  background: #fbf6ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  text-align: left;
}

.choice-option.active {
  border-color: #d9b989;
  color: var(--brand-dark);
  background: #f7e7c2;
  font-weight: 600;
}

.choice-check {
  width: 38rpx;
  height: 38rpx;
  border: 1rpx solid #dfcfbc;
  border-radius: 50%;
  color: white;
  background: #fffdf9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choice-option.active .choice-check {
  border-color: var(--brand-dark);
  background: var(--brand-dark);
}

.checkin-button {
  width: 100%;
  gap: 8rpx;
}

.checkin-actions {
  margin-top: 2rpx;
}

.checkin-actions.multiple {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12rpx;
}

.next-pet-button {
  min-height: 78rpx;
  border: 1rpx solid #d9b78d;
  border-radius: 24rpx;
  color: #92613f;
  background: #fffaf2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.next-pet-button > text {
  line-height: 1;
}

.next-pet-arrow {
  width: 34rpx;
  height: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(2rpx) rotate(180deg);
}

.tasks-section {
  margin-top: 36rpx;
  padding: 0 4rpx 34rpx;
}

.tasks-section .section-kicker {
  margin-bottom: 8rpx;
  font-size: 24rpx;
}

.tasks-section .section-title {
  font-size: 48rpx;
  line-height: 1.15;
}

.tasks-section .pill {
  min-height: 58rpx;
  padding: 0 22rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.task-list {
  margin-top: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.task-item {
  position: relative;
  width: 100%;
  min-height: 118rpx;
  padding: 0;
  overflow: hidden;
  border-radius: 30rpx;
  background: #fffdfa;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92rpx;
  align-items: center;
  text-align: left;
  will-change: transform;
}

.task-main {
  min-width: 0;
  min-height: 118rpx;
  padding: 22rpx 0 22rpx 26rpx;
  display: grid;
  grid-template-columns: 102rpx minmax(0, 1fr);
  align-items: center;
  text-align: left;
}

.task-check-area {
  width: 100%;
  height: auto;
  min-height: 118rpx;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-time {
  color: #604b3d;
  font-size: 28rpx;
  font-weight: 700;
}

.task-copy {
  display: flex;
  flex-direction: column;
  gap: 7rpx;
  font-size: 32rpx;
}

.task-title-row {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.task-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-pet-tag {
  max-width: 190rpx;
  flex: none;
  overflow: hidden;
  padding: 5rpx 11rpx;
  border: 1rpx solid #ead2ae;
  border-radius: 999rpx;
  color: #95663f;
  background: #f7e7c2;
  font-size: 20rpx;
  font-weight: 500;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-copy .muted {
  font-size: 24rpx;
}

.task-check {
  width: 52rpx;
  height: 52rpx;
  border: 2rpx solid #eadfce;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .2s ease, background-color .2s ease, transform .2s ease;
}

.task-check.done {
  color: white;
  border-color: #bfa58e;
  background: #bfa58e;
  transform: scale(1.04);
}

.task-item.completed .task-time,
.task-item.completed .task-copy {
  color: #9e958e;
  transition: color .2s ease;
}

.task-item:not(.completed) .task-time {
  color: #604b3d;
}

.task-item:not(.completed) .task-copy {
  color: var(--ink);
}

.task-check:not(.done) {
  border-color: #eadfce;
  background: transparent;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.add-task {
  width: 100%;
  min-height: 100rpx;
  margin-top: 20rpx;
  border: 2rpx dashed #dba96f;
  border-radius: 28rpx;
  color: var(--brand-dark);
  background: #fffdf9;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
</style>
