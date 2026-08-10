<template>
  <view class="page no-tab task-page">
    <AppTopBar :title="pageTitle" back center />

    <form class="task-form" @submit="saveTask">
      <label class="form-row">
        <text>任务名称</text>
        <view class="field"><input v-model="form.name" name="name" placeholder="请输入任务名称" placeholder-class="task-placeholder" /></view>
      </label>

      <view class="form-row">
        <text>任务时间</text>
        <button class="field select-field" @tap="timePickerOpen = true">
          <text>{{ form.time }}</text><AppIcon name="clock" size="26rpx" />
        </button>
      </view>

      <view class="form-row">
        <text>重复</text>
        <view class="repeat-field">
          <button class="field select-field" @tap="repeatPickerOpen = true">
            <text>{{ form.repeat }}</text><AppIcon name="chevron-down" size="24rpx" />
          </button>
        </view>
      </view>

      <view v-if="form.repeat === '自定义'" class="custom-repeat-panel">
        <view class="custom-repeat-head">
          <text class="custom-repeat-title">自定义提醒周期</text>
          <button class="custom-repeat-scope" @tap="repeatScopePickerOpen = true">
            <text>{{ form.repeatScope }}</text>
            <AppIcon name="chevron-down" size="20rpx" />
          </button>
        </view>
        <view class="weekday-options">
          <button
            v-for="day in weekDays"
            :key="day.value"
            class="weekday-option"
            :class="{ selected: form.weekDays.includes(day.value) }"
            :aria-label="`${form.weekDays.includes(day.value) ? '取消' : '选择'}星期${day.full}`"
            @tap="toggleWeekDay(day.value)"
          >
            {{ day.label }}
          </button>
        </view>
      </view>

      <view class="form-row pets-row">
        <text>选择宠物</text>
        <view class="pet-options">
          <button v-for="pet in pets" :key="pet.id" class="pet-option" :class="{ selected: form.petIds.includes(pet.id) }" @tap="togglePet(pet.id)">
            <view class="radio"><AppIcon v-if="form.petIds.includes(pet.id)" name="check-light" size="20rpx" /></view>
            <image v-if="pet.avatar" class="pet-face" :src="pet.avatar" mode="aspectFill" />
            <AppIcon v-else class="pet-face" :name="pet.icon" size="34rpx" />
            <view class="pet-option-copy"><text>{{ pet.name }}</text><text>{{ pet.sourceLabel }}</text></view>
          </button>
        </view>
      </view>

      <label class="form-row note-row">
        <text>备注</text>
        <view class="field note-field">
          <textarea v-model="form.note" name="note" placeholder="补充任务内容（选填）" placeholder-class="task-placeholder" maxlength="120" />
        </view>
      </label>

      <button class="primary-button save-button" form-type="submit" :disabled="!canSave">{{ saveButtonText }}</button>
    </form>

    <AppOptionSheet
      :open="repeatPickerOpen"
      title="重复周期"
      eyebrow="选择任务执行频率"
      :options="repeatOptions"
      :model-value="form.repeat"
      @close="repeatPickerOpen = false"
      @select="selectRepeat"
    />

    <AppOptionSheet
      :open="repeatScopePickerOpen"
      title="重复范围"
      eyebrow="选择自定义周期的执行方式"
      :options="repeatScopeOptions"
      :model-value="form.repeatScope"
      @close="repeatScopePickerOpen = false"
      @select="selectRepeatScope"
    />

    <AppWheelSheet
      :open="timePickerOpen"
      title="选择时间"
      :columns="[hours, minutes]"
      :value="[draftHour, draftMinute]"
      :suffixes="[' 时', ' 分']"
      @close="timePickerOpen = false"
      @change="timeChange"
      @confirm="confirmTime"
    />
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import AppOptionSheet from '../../components/AppOptionSheet.vue'
import AppWheelSheet from '../../components/AppWheelSheet.vue'
import { tasks } from '../../common/data.js'
import { getActivePets } from '../../common/pets.js'

export default {
  components: { AppTopBar, AppOptionSheet, AppWheelSheet },
  data() {
    const activePets = getActivePets()
    return {
      pets: activePets,
      taskId: null,
      repeatOptions: ['仅一次', '每天', '每周', '每月', '自定义'],
      repeatScopeOptions: ['仅本周', '每周重复'],
      weekDays: [
        { label: '日', full: '日', value: 0 },
        { label: '一', full: '一', value: 1 },
        { label: '二', full: '二', value: 2 },
        { label: '三', full: '三', value: 3 },
        { label: '四', full: '四', value: 4 },
        { label: '五', full: '五', value: 5 },
        { label: '六', full: '六', value: 6 }
      ],
      hours: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
      minutes: Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')),
      timePickerOpen: false,
      repeatPickerOpen: false,
      repeatScopePickerOpen: false,
      draftHour: 8,
      draftMinute: 0,
      form: { name: '', time: '08:00', repeat: '仅一次', repeatScope: '每周重复', weekDays: [], petIds: [activePets[0].id], note: '' }
    }
  },
  computed: {
    pageTitle() {
      return this.taskId === null ? '新增任务' : '编辑任务'
    },
    saveButtonText() {
      return this.taskId === null ? '创建任务' : '保存修改'
    },
    canSave() {
      const repeatReady = this.form.repeat !== '自定义' || this.form.weekDays.length
      return this.form.name.trim() && this.form.petIds.length && repeatReady
    }
  },
  onLoad(options) {
    if (options.id === undefined) return
    const taskId = Number(options.id)
    if (!Number.isFinite(taskId)) return

    const savedTasks = uni.getStorageSync('petTasks')
    const sourceTasks = Array.isArray(savedTasks) && savedTasks.length ? savedTasks : tasks
    const task = sourceTasks.find(item => Number(item.id) === taskId)
    if (!task) return

    this.taskId = taskId
    const activePetIds = this.pets.map(pet => pet.id)
    const taskPetIds = Array.isArray(task.petIds) ? task.petIds.filter(id => activePetIds.includes(id)) : []
    this.form = {
      name: task.title,
      time: task.time,
      repeat: task.repeat || '仅一次',
      repeatScope: task.repeatScope || '每周重复',
      weekDays: Array.isArray(task.weekDays) ? [...task.weekDays] : [],
      petIds: taskPetIds.length ? taskPetIds : [this.pets[0].id],
      note: task.note || ''
    }
    const [hour, minute] = task.time.split(':').map(Number)
    this.draftHour = hour
    this.draftMinute = minute
  },
  methods: {
    selectRepeat(value) {
      this.form.repeat = value
      this.repeatPickerOpen = false
    },
    selectRepeatScope(value) {
      this.form.repeatScope = value
      this.repeatScopePickerOpen = false
    },
    toggleWeekDay(value) {
      this.form.weekDays = this.form.weekDays.includes(value)
        ? this.form.weekDays.filter(item => item !== value)
        : [...this.form.weekDays, value].sort((a, b) => a - b)
    },
    togglePet(id) {
      this.form.petIds = this.form.petIds.includes(id)
        ? this.form.petIds.filter(item => item !== id)
        : [...this.form.petIds, id]
    },
    timeChange(value) {
      this.draftHour = Number(value[0])
      this.draftMinute = Number(value[1])
    },
    confirmTime() {
      this.form.time = `${this.hours[this.draftHour]}:${this.minutes[this.draftMinute]}`
      this.timePickerOpen = false
    },
    saveTask() {
      if (!this.canSave) return

      const savedTasks = uni.getStorageSync('petTasks')
      const sourceTasks = Array.isArray(savedTasks) && savedTasks.length
        ? savedTasks
        : tasks.map(item => ({ ...item }))
      const existingTask = this.taskId === null
        ? null
        : sourceTasks.find(item => Number(item.id) === this.taskId)
      const taskId = this.taskId === null ? Date.now() : this.taskId
      const taskData = {
        ...(existingTask || {}),
        id: taskId,
        title: this.form.name.trim(),
        time: this.form.time,
        note: this.form.note.trim(),
        repeat: this.form.repeat,
        repeatScope: this.form.repeatScope,
        weekDays: [...this.form.weekDays],
        petIds: [...this.form.petIds],
        done: existingTask ? Boolean(existingTask.done) : false
      }
      const updatedTasks = this.taskId === null
        ? [...sourceTasks, taskData]
        : sourceTasks.map(item => Number(item.id) === this.taskId ? taskData : item)

      uni.setStorageSync('petTasks', updatedTasks)
      uni.showToast({ title: this.taskId === null ? '任务已创建' : '修改已保存', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 500)
    }
  }
}
</script>

<style scoped>
.task-form {
  padding-top: 46rpx;
}

.form-row {
  margin-bottom: 24rpx;
  display: grid;
  grid-template-columns: 126rpx 1fr;
  align-items: center;
  gap: 18rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.select-field {
  width: 100%;
  justify-content: space-between;
  text-align: left;
}

.repeat-field {
  width: 100%;
}

.custom-repeat-panel {
  margin: -4rpx 0 28rpx 144rpx;
  padding: 22rpx 20rpx 18rpx;
  border: 1rpx solid var(--line);
  border-radius: 24rpx;
  background: var(--surface-strong);
  box-shadow: 0 8rpx 24rpx rgba(91, 67, 48, .05);
}

.custom-repeat-head {
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-repeat-title {
  color: var(--ink);
  font-size: 24rpx;
  font-weight: 600;
}

.custom-repeat-scope {
  min-height: 48rpx;
  padding: 0 14rpx;
  border: 1rpx solid #ead8c2;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: #9a6a42;
  background: #fffaf3;
  font-size: 20rpx;
  font-weight: 500;
}

.weekday-options {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.weekday-option {
  min-width: 0;
  height: 58rpx;
  padding: 0;
  border: 1rpx solid #ead8c2;
  border-radius: 18rpx;
  color: #806a59;
  background: #fffaf3;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 58rpx;
  text-align: center;
}

.weekday-option.selected {
  border-color: #d39a5f;
  color: #ffffff;
  background: #bd8251;
  box-shadow: 0 5rpx 12rpx rgba(174, 112, 61, .18);
}

.pets-row {
  align-items: flex-start;
}

.pet-options {
  padding: 12rpx;
  border: 1rpx solid var(--line);
  border-radius: 24rpx;
  background: var(--surface-strong);
}

.pet-option {
  width: 100%;
  min-height: 88rpx;
  padding: 13rpx 14rpx;
  border-radius: 20rpx;
  display: grid;
  grid-template-columns: 46rpx 58rpx 1fr;
  align-items: center;
  gap: 12rpx;
  text-align: left;
}

.pet-option-copy { min-width: 0; display: flex; flex-direction: column; gap: 3rpx; }
.pet-option-copy text:first-child { font-size: 24rpx; }
.pet-option-copy text:last-child { overflow: hidden; color: var(--muted); font-size: 18rpx; text-overflow: ellipsis; white-space: nowrap; }

.pet-option.selected {
  border: 1rpx solid #dba86e;
  background: #fffaf2;
}

.radio {
  width: 38rpx;
  height: 38rpx;
  border: 1rpx solid #d7b994;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20rpx;
}

.pet-option.selected .radio {
  background: #be8150;
}

.pet-face {
  width: 54rpx;
  height: 54rpx;
  overflow: hidden;
  border: 2rpx solid #ffffff;
  border-radius: 50%;
  background: #f7e7c2;
  box-shadow: 0 3rpx 8rpx rgba(91, 67, 48, .1);
}

.note-row {
  align-items: flex-start;
}

.note-row > text {
  padding-top: 20rpx;
}

.note-field {
  height: 190rpx;
  padding-top: 20rpx;
  align-items: flex-start;
}

.note-field textarea {
  height: 150rpx;
  font-weight: 400;
}

.task-placeholder {
  color: #9b918a;
  font-size: 28rpx;
  font-weight: 400;
}

.save-button {
  position: fixed;
  left: 34rpx;
  right: 34rpx;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.save-button[disabled] {
  color: #a99d92;
  background: #e9e0d5;
  box-shadow: none;
}

.picker-mask {
  position: fixed;
  z-index: 50;
  inset: 0;
  background: rgba(71, 54, 42, .34);
  display: flex;
  align-items: flex-end;
}

.time-sheet {
  width: 100%;
  padding: 26rpx 30rpx calc(34rpx + env(safe-area-inset-bottom));
  border-radius: 36rpx 36rpx 0 0;
  background: #fffaf3;
}

.time-sheet-head {
  height: 64rpx;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  font-weight: 600;
  text-align: center;
}

.time-sheet-head button:first-child {
  text-align: left;
}

.time-sheet-head .confirm {
  color: var(--brand);
  text-align: right;
}

.time-picker {
  height: 390rpx;
  margin-top: 10rpx;
}

.time-picker view {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6a5547;
  font-size: 36rpx;
}
</style>
