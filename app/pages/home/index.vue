<template>
  <view class="page home-page">
    <view class="home-top">
      <view class="brand-group">
        <text class="brand">爪娃</text>
        <button class="brand-message" aria-label="消息提醒" @tap="openMessages">
          <AppIcon name="bell" size="28rpx" />
          <text class="dot" />
        </button>
      </view>
    </view>

    <view class="pet-carousel">
      <swiper class="pet-swiper" :current="petIndex" circular @change="onPetChange">
        <swiper-item v-for="pet in pets" :key="pet.id">
          <view class="pet-hero" :class="{ peach: pet.id === 2 }">
            <view class="home-actions">
              <button class="round-action" aria-label="宠物管理" @tap="openPetManage"><AppIcon name="paw" size="32rpx" /></button>
            </view>
            <button
              class="pet-avatar"
              :aria-label="`查看${pet.name}的宠物资料`"
              @tap.stop="openPetProfile(pet.id)"
            >
              <image v-if="pet.avatar" :src="pet.avatar" mode="aspectFill" />
              <AppIcon v-else :name="pet.icon" size="90rpx" />
            </button>
            <view class="pet-copy">
              <text class="pet-kicker">我的伙伴</text>
              <text class="pet-name">{{ pet.name }}</text>
              <text class="pet-meta">{{ pet.type }} · {{ pet.age }}</text>
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
            <text class="checkin-pet-name">{{ currentPet.name }}</text>
          </view>
          <text class="checkin-title">{{ checkinTitle }}</text>
        </view>
        <view class="done-pill" :class="{ completed }">
          <text>{{ completed ? '已完成' : '待完成' }}</text>
          <AppIcon v-if="completed" name="check" size="20rpx" />
        </view>
        <view class="collapse"><AppIcon :name="checkinOpen ? 'chevron-up' : 'chevron-down'" size="24rpx" /></view>
      </button>

      <view v-if="checkinOpen" class="health-list">
        <view v-for="item in healthRows" :key="item.key" class="health-row">
          <view class="health-label">
            <view class="health-icon"><AppIcon :name="item.icon" size="27rpx" /></view>
            <text>{{ item.label }}</text>
          </view>

          <view v-if="item.mode === 'input'" class="health-control">
            <view class="health-value">
              <input v-model="health[item.key]" type="digit" :aria-label="`${item.label}数值`" />
            </view>
            <text class="health-suffix">{{ item.unit }}</text>
          </view>

          <button
            v-else
            class="health-picker"
            :aria-label="`选择${item.label}`"
            @tap="openChoicePicker(item)"
          >
            <view class="health-control">
              <view class="health-value choice">
                <text>{{ health[item.key] }}</text>
              </view>
              <AppIcon class="health-suffix" name="chevron-down" size="22rpx" />
            </view>
          </button>
        </view>
        <button class="primary-button checkin-button" @tap="completeCheckin">
          <text>{{ completed ? '保存修改' : '完成今日打卡' }}</text>
          <AppIcon v-if="completed" name="check-light" size="26rpx" />
        </button>
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
        <button
          v-for="task in taskList"
          :id="`task-item-${task.id}`"
          :key="task.renderKey"
          class="task-item card"
          :class="{ completed: task.done }"
          :style="taskMotionStyle(task.id)"
          @tap="toggleTask(task.id)"
        >
          <text class="task-time">{{ task.time }}</text>
          <view class="task-copy">
            <text>{{ task.title }}</text>
            <text class="muted">{{ task.note }}</text>
          </view>
          <view class="task-check" :class="{ done: task.done }">
            <AppIcon v-if="task.done" name="check-light" size="25rpx" />
          </view>
        </button>
      </view>

      <button class="add-task" @tap="openCreateTask"><AppIcon name="plus" size="27rpx" /><text>新增宠物任务</text></button>
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
import { pets, tasks } from '../../common/data.js'

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
    return {
      pets,
      petIndex: 0,
      checkinOpen: true,
      completedPetIds: [],
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
      settings: { food: 'status', water: 'status', walk: 'minute' },
      healthByPet: Object.fromEntries(pets.map(pet => [
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
    currentPet() {
      return this.pets[this.petIndex]
    },
    health() {
      return this.healthByPet[this.currentPet.id]
    },
    completed() {
      return this.completedPetIds.includes(this.currentPet.id)
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
        this.settings.food === 'g'
          ? { key: 'food', label: '食量', icon: 'meal', mode: 'input', unit: 'g' }
          : { key: 'food', label: '食量', icon: 'meal', mode: 'choice', options: ['正常', '少', '多', '拒食'] },
        this.settings.water === 'ml'
          ? { key: 'water', label: '饮水', icon: 'water', mode: 'input', unit: 'ml' }
          : { key: 'water', label: '饮水', icon: 'water', mode: 'choice', options: ['正常', '少', '多', '未饮水'] },
        { key: 'walk', label: '遛弯', icon: 'paw', mode: 'input', unit: this.settings.walk === 'km' ? '公里' : '分钟' },
        { key: 'stool', label: '排便', icon: 'stool', mode: 'choice', options: ['正常', '便秘', '腹泻', '未排便'] },
        { key: 'weight', label: '体重', icon: 'weight', mode: 'input', unit: 'kg' },
        { key: 'spirit', label: '精神', icon: 'mood', mode: 'choice', options: ['正常', '活跃', '低迷', '暴躁'] }
      ]
    }
  },
  onShow() {
    this.settings = uni.getStorageSync('healthSettings') || this.settings
  },
  methods: {
    onPetChange(event) {
      this.petIndex = event.detail.current
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
      if (this.completed) {
        uni.showToast({ title: '修改已保存', icon: 'success' })
        return
      }

      const currentPet = this.pets[this.petIndex]
      this.completedPetIds = [...this.completedPetIds, currentPet.id]
      const nextIndex = this.findNextIncompletePet(this.petIndex)

      if (nextIndex >= 0) {
        this.petIndex = nextIndex
        this.checkinOpen = true
        uni.showToast({ title: `已切换到${this.pets[nextIndex].name}`, icon: 'success' })
      } else {
        this.checkinOpen = false
        uni.showToast({ title: '今日打卡全部完成', icon: 'success' })
      }
    },
    findNextIncompletePet(currentIndex) {
      for (let step = 1; step <= this.pets.length; step += 1) {
        const index = (currentIndex + step) % this.pets.length
        if (!this.completedPetIds.includes(this.pets[index].id)) return index
      }
      return -1
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
  padding-top: 72rpx;
}

.home-top {
  min-height: 112rpx;
  padding-top: calc(env(safe-area-inset-top) + 16rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.brand {
  color: #c7784f;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
}

.brand-message {
  position: relative;
  width: 54rpx;
  height: 54rpx;
  padding: 0;
  border: 1rpx solid #eadfce;
  border-radius: 18rpx;
  color: #a6734d;
  background: #fffaf2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-actions {
  position: absolute;
  z-index: 3;
  top: 18rpx;
  right: 18rpx;
  display: flex;
  gap: 14rpx;
}

.round-action {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  border: 1rpx solid var(--line);
  border-radius: 20rpx;
  background: rgba(255,255,255,.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 29rpx;
}

.dot {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 12rpx;
  height: 12rpx;
  border: 3rpx solid white;
  border-radius: 50%;
  background: #d76f53;
}

.pet-swiper {
  height: 292rpx;
}

.pet-carousel {
  position: relative;
  height: 292rpx;
}

.pet-hero {
  position: relative;
  height: 286rpx;
  padding: 34rpx 38rpx;
  overflow: hidden;
  border: 2rpx solid #ead6b8;
  border-radius: 42rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
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
  color: #9b8879;
  font-size: 23rpx;
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
  grid-template-columns: 1fr auto 28rpx;
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

.done-pill {
  padding: 8rpx 14rpx;
  border: 1rpx solid var(--line);
  border-radius: 12rpx;
  color: var(--muted);
  font-size: 19rpx;
  display: flex;
  align-items: center;
  gap: 5rpx;
}

.done-pill.completed {
  color: var(--green);
  border-color: #9ac7a8;
  background: var(--green-soft);
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
  border: 1rpx solid var(--line);
  border-radius: 17rpx;
  background: #fffdfa;
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
  display: grid;
  grid-template-columns: 170rpx 44rpx;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.health-value {
  width: 170rpx;
  min-height: 56rpx;
  padding: 0 12rpx;
  border: 1rpx solid var(--line);
  border-radius: 15rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #645043;
  font-size: 25rpx;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.health-value input {
  width: 100%;
  color: #645043;
  font-size: 25rpx;
  font-weight: 600;
  text-align: center;
}

.health-value.choice {
  justify-content: center;
}

.health-suffix {
  width: 44rpx;
  color: #907a6a;
  font-size: 22rpx;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
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
  font-size: 23rpx;
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
  font-size: 27rpx;
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
  margin-top: 2rpx;
  gap: 8rpx;
}

.tasks-section {
  margin-top: 36rpx;
  padding: 0 4rpx 34rpx;
}

.tasks-section .section-kicker {
  margin-bottom: 8rpx;
  font-size: 25rpx;
}

.tasks-section .section-title {
  font-size: 46rpx;
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
  padding: 22rpx 26rpx;
  border-radius: 30rpx;
  background: #fffdfa;
  display: grid;
  grid-template-columns: 102rpx 1fr 58rpx;
  align-items: center;
  text-align: left;
  will-change: transform;
}

.task-time {
  color: #604b3d;
  font-size: 27rpx;
  font-weight: 700;
}

.task-copy {
  display: flex;
  flex-direction: column;
  gap: 7rpx;
  font-size: 30rpx;
}

.task-copy .muted {
  font-size: 23rpx;
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

.task-item.completed .task-copy > text:first-child {
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
