<template>
  <view class="page records-page">
    <AppTopBar title="健康记录" center>
      <template #left>
        <view class="pet-selector-anchor">
          <button class="pet-chip" :aria-expanded="petPickerOpen" @tap="petPickerOpen = !petPickerOpen">
            <view class="pet-chip-avatar">
              <image v-if="pets[petIndex].avatar" :src="pets[petIndex].avatar" mode="aspectFill" />
              <AppIcon v-else :name="pets[petIndex].icon" size="40rpx" />
            </view>
            <AppIcon class="pet-chip-arrow" name="chevron-down" size="24rpx" />
          </button>

          <button v-if="petPickerOpen" class="pet-popover-mask" aria-label="关闭宠物选择" @tap="petPickerOpen = false" />
          <view v-if="petPickerOpen" class="pet-popover" @tap.stop>
            <button
              v-for="(pet, index) in pets"
              :key="pet.id"
              class="pet-popover-option"
              :class="{ selected: index === petIndex }"
              @tap="selectPet(pet.id)"
            >
              <view class="pet-popover-avatar">
                <image v-if="pet.avatar" :src="pet.avatar" mode="aspectFill" />
                <AppIcon v-else :name="pet.icon" size="38rpx" />
              </view>
              <view class="pet-popover-copy">
                <text class="pet-popover-name">{{ pet.name }}</text>
                <text class="pet-popover-meta">{{ pet.type }}</text>
              </view>
              <text v-if="index === petIndex" class="pet-current">当前</text>
            </button>
          </view>
        </view>
      </template>
    </AppTopBar>

    <view class="pet-date-row">
      <view class="month-row">
        <button aria-label="上一周" @tap="changeWeek(-1)"><AppIcon name="chevron-left" size="30rpx" /></button>
        <view class="month-label">
          <text>{{ monthLabel }}</text>
          <button class="calendar-action" aria-label="选择日期" @tap="calendarOpen = true">
            <AppIcon name="calendar" size="28rpx" />
          </button>
        </view>
        <button aria-label="下一周" @tap="changeWeek(1)"><AppIcon name="chevron-right" size="30rpx" /></button>
      </view>
    </view>

    <view class="date-strip">
      <button v-for="day in days" :key="day.value" :class="{ active: selectedDay === day.value }" @tap="selectedDay = day.value">
        <text>{{ day.week }}</text>
        <text>{{ day.date }}</text>
      </button>
    </view>

    <view class="health-overview">
      <view class="score-block">
        <view class="score-ring">
          <text class="score">{{ currentRecord.score }}</text>
          <text>健康值</text>
        </view>
        <view>
          <text class="section-kicker">今日健康状态</text>
          <text class="status">状态{{ currentRecord.status }}</text>
          <view class="trend"><text>较上周提升 {{ currentRecord.change }} 分</text><AppIcon name="trend-up" size="22rpx" /></view>
        </view>
      </view>

      <view class="trend-heading row-between">
        <view>
          <text class="section-kicker">趋势分析</text>
          <text class="section-title">近 7 日健康值</text>
        </view>
        <text class="pill">平均 {{ averageScore }} 分</text>
      </view>
      <canvas
        canvas-id="trendChart"
        id="trendChart"
        class="trend-chart"
        @touchstart="handleChartTouch"
        @touchmove="handleChartTouch"
      />
    </view>

    <view class="section detail-section card">
      <text class="section-kicker">当日明细</text>
      <text class="section-title">健康记录</text>
      <view class="record-grid">
        <view v-for="item in currentRecord.health" :key="item.label" class="record-item">
          <AppIcon class="record-icon" :name="item.icon" size="30rpx" />
          <text class="muted">{{ item.label }}</text>
          <text class="record-value">{{ item.value }} <text class="record-unit">{{ item.unit }}</text></text>
        </view>
      </view>
    </view>

    <view class="health-advice">
      <view class="advice-icon">
        <AppIcon name="lightbulb" size="34rpx" />
      </view>
      <view class="advice-copy">
        <text class="advice-title">健康建议</text>
        <text class="advice-text">{{ healthAdvice }}</text>
      </view>
    </view>

    <AppWheelSheet
      :open="calendarOpen"
      title="选择记录日期"
      :columns="calendarColumns"
      :value="calendarValue"
      :suffixes="[' 年', ' 月', ' 日']"
      @close="calendarOpen = false"
      @change="calendarValue = $event"
      @confirm="calendarOpen = false"
    />

    <AppBottomNav active="records" />
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import AppBottomNav from '../../components/AppBottomNav.vue'
import AppWheelSheet from '../../components/AppWheelSheet.vue'
import { pets } from '../../common/data.js'

export default {
  components: { AppTopBar, AppBottomNav, AppWheelSheet },
  data() {
    return {
      pets,
      petIndex: 0,
      petPickerOpen: false,
      weekStart: '2026-07-27',
      selectedDay: '2026-07-27',
      calendarOpen: false,
      calendarValue: [2, 6, 26],
      chartMetrics: null,
      activeChartIndex: null,
      records: [
        {
          score: 92, status: '优秀', change: 4, chart: [74, 82, 79, 91, 87, 85, 92],
          health: [
            { label: '食量', value: '80', unit: 'g', icon: 'meal' }, { label: '饮水', value: '520', unit: 'ml', icon: 'water' },
            { label: '遛弯', value: '48', unit: '分钟', icon: 'paw' }, { label: '排便', value: '正常', unit: '', icon: 'stool' },
            { label: '体重', value: '10.8', unit: 'kg', icon: 'weight' }, { label: '精神', value: '活跃', unit: '', icon: 'mood' }
          ]
        },
        {
          score: 86, status: '良好', change: 1, chart: [80, 83, 85, 82, 88, 84, 86],
          health: [
            { label: '食量', value: '65', unit: 'g', icon: 'meal' }, { label: '饮水', value: '310', unit: 'ml', icon: 'water' },
            { label: '活动', value: '28', unit: '分钟', icon: 'paw' }, { label: '排便', value: '正常', unit: '', icon: 'stool' },
            { label: '体重', value: '4.6', unit: 'kg', icon: 'weight' }, { label: '精神', value: '正常', unit: '', icon: 'mood' }
          ]
        }
      ]
    }
  },
  computed: {
    days() {
      const weekNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const start = this.parseDate(this.weekStart)
      return weekNames.map((week, index) => {
        const current = new Date(start)
        current.setDate(start.getDate() + index)
        return {
          week,
          date: String(current.getDate()),
          value: this.formatDate(current)
        }
      })
    },
    monthLabel() {
      const start = this.parseDate(this.weekStart)
      return `${start.getFullYear()} 年 ${start.getMonth() + 1} 月`
    },
    calendarColumns() {
      return [
        [2024, 2025, 2026, 2027],
        Array.from({ length: 12 }, (_, index) => index + 1),
        Array.from({ length: 31 }, (_, index) => index + 1)
      ]
    },
    currentRecord() { return this.records[this.petIndex] },
    averageScore() {
      return Math.round(this.currentRecord.chart.reduce((sum, value) => sum + value, 0) / this.currentRecord.chart.length)
    },
    healthAdvice() {
      const health = Object.fromEntries(this.currentRecord.health.map(item => [item.icon, item.value]))
      const pet = this.pets[this.petIndex]
      const advice = []
      const water = Number(health.water)
      const activity = Number(health.paw)

      if (Number.isFinite(water)) {
        if (water >= 450) advice.push('今天饮水充足')
        else if (water >= 250) advice.push('今天饮水状态较稳定')
        else advice.push('今天饮水偏少，建议少量多次补水')
      }

      if (Number.isFinite(activity)) {
        if (activity >= 40) advice.push('运动量良好')
        else if (activity >= 25) advice.push('活动量适中')
        else advice.push('活动量偏少，可适当增加轻松互动')
      }

      if (health.stool && health.stool !== '正常') {
        advice.push(`排便状态为${health.stool}，请继续观察`)
      } else if (health.mood === '低迷') {
        advice.push('精神状态偏低，建议减少剧烈活动并持续观察')
      }

      const followUp = pet.type.includes('猫')
        ? '建议继续保持规律喂养，并安排一段轻松互动。'
        : '建议晚间散步后轻柔梳毛，帮助放松。'
      return `${pet.name}${advice.join('，')}。${followUp}`
    }
  },
  watch: {
    petIndex() {
      this.activeChartIndex = null
      this.$nextTick(this.drawChart)
    },
    weekStart() {
      this.activeChartIndex = null
      this.$nextTick(this.drawChart)
    }
  },
  onReady() {
    this.drawChart()
  },
  methods: {
    parseDate(value) {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day)
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    changeWeek(offset) {
      const nextStart = this.parseDate(this.weekStart)
      nextStart.setDate(nextStart.getDate() + offset * 7)
      this.weekStart = this.formatDate(nextStart)

      const nextSelected = this.parseDate(this.selectedDay)
      nextSelected.setDate(nextSelected.getDate() + offset * 7)
      this.selectedDay = this.formatDate(nextSelected)
    },
    selectPet(id) {
      const index = this.pets.findIndex(item => item.id === id)
      if (index >= 0) this.petIndex = index
      this.petPickerOpen = false
    },
    drawChart() {
      this.$nextTick(() => {
        uni.createSelectorQuery()
          .in(this)
          .select('#trendChart')
          .boundingClientRect(rect => {
            if (rect) this.renderTrendChart(rect.width, rect.height, rect.left)
          })
          .exec()
      })
    },
    handleChartTouch(event) {
      if (!this.chartMetrics || !event.touches || !event.touches.length) return
      const touch = event.touches[0]
      const touchX = Number.isFinite(touch.x)
        ? touch.x
        : touch.clientX - this.chartMetrics.left
      const nearestIndex = this.chartMetrics.points.reduce((nearest, point, index, points) => (
        Math.abs(point.x - touchX) < Math.abs(points[nearest].x - touchX) ? index : nearest
      ), 0)
      if (nearestIndex === this.activeChartIndex) return
      this.activeChartIndex = nearestIndex
      this.renderTrendChart(this.chartMetrics.width, this.chartMetrics.height, this.chartMetrics.left)
    },
    renderTrendChart(width, height, canvasLeft = 0) {
      const values = this.currentRecord.chart
      const ctx = uni.createCanvasContext('trendChart', this)
      const labels = this.days.map(item => item.date)
      const paddingLeft = 40
      const paddingRight = 16
      const top = 24
      const bottom = height - 34
      const min = Math.max(0, Math.floor((Math.min(...values) - 6) / 10) * 10)
      const max = Math.min(100, Math.ceil((Math.max(...values) + 6) / 10) * 10)
      const range = Math.max(10, max - min)
      const plotWidth = width - paddingLeft - paddingRight

      const points = values.map((value, index) => ({
        x: paddingLeft + index * (plotWidth / (values.length - 1)),
        y: bottom - ((value - min) / range) * (bottom - top)
      }))

      this.chartMetrics = { width, height, points, left: canvasLeft }

      ctx.setFontSize(9)
      ctx.setTextBaseline('middle')
      ;[0, 1, 2, 3].forEach(index => {
        const ratio = index / 3
        const y = top + ratio * (bottom - top)
        const axisValue = Math.round(max - ratio * range)
        ctx.setStrokeStyle('#eee5d9')
        ctx.setLineWidth(1)
        ctx.beginPath()
        ctx.moveTo(paddingLeft, y)
        ctx.lineTo(width - paddingRight, y)
        ctx.stroke()

        ctx.setFillStyle('#aa9788')
        ctx.setTextAlign('right')
        ctx.fillText(String(axisValue), paddingLeft - 9, y)
      })

      const traceCurve = () => {
        ctx.moveTo(points[0].x, points[0].y)
        for (let index = 0; index < points.length - 1; index += 1) {
          const before = points[Math.max(0, index - 1)]
          const current = points[index]
          const next = points[index + 1]
          const after = points[Math.min(points.length - 1, index + 2)]
          const control1X = current.x + (next.x - before.x) / 6
          const control1Y = current.y + (next.y - before.y) / 6
          const control2X = next.x - (after.x - current.x) / 6
          const control2Y = next.y - (after.y - current.y) / 6
          ctx.bezierCurveTo(control1X, control1Y, control2X, control2Y, next.x, next.y)
        }
      }

      const areaGradient = ctx.createLinearGradient(0, top, 0, bottom)
      areaGradient.addColorStop(0, 'rgba(204, 139, 77, 0.28)')
      areaGradient.addColorStop(1, 'rgba(204, 139, 77, 0.025)')
      ctx.beginPath()
      traceCurve()
      ctx.lineTo(points[points.length - 1].x, bottom)
      ctx.lineTo(points[0].x, bottom)
      ctx.closePath()
      ctx.setFillStyle(areaGradient)
      ctx.fill()

      ctx.beginPath()
      traceCurve()
      ctx.setStrokeStyle('#c98242')
      ctx.setLineWidth(3)
      ctx.setLineCap('round')
      ctx.setLineJoin('round')
      ctx.stroke()

      points.forEach((point, index) => {
        const isActive = index === this.activeChartIndex
        const isLatest = this.activeChartIndex === null && index === points.length - 1
        const emphasized = isActive || isLatest
        if (emphasized) {
          ctx.beginPath()
          ctx.setFillStyle('rgba(201, 130, 66, 0.16)')
          ctx.arc(point.x, point.y, 10, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.beginPath()
        ctx.setFillStyle(emphasized ? '#c98242' : '#fffdf9')
        ctx.setStrokeStyle('#c98242')
        ctx.setLineWidth(2)
        ctx.arc(point.x, point.y, emphasized ? 5 : 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })

      ctx.setFillStyle('#a38e7e')
      ctx.setFontSize(9)
      ctx.setTextAlign('center')
      ctx.setTextBaseline('top')
      points.forEach((point, index) => {
        ctx.fillText(labels[index], point.x, bottom + 12)
      })

      if (this.activeChartIndex !== null) {
        const point = points[this.activeChartIndex]
        const tooltipWidth = 68
        const tooltipHeight = 27
        const tooltipX = Math.max(
          paddingLeft,
          Math.min(width - paddingRight - tooltipWidth, point.x - tooltipWidth / 2)
        )
        const tooltipY = Math.max(2, point.y - 40)

        ctx.setStrokeStyle('rgba(201, 130, 66, .35)')
        ctx.setLineWidth(1)
        if (ctx.setLineDash) ctx.setLineDash([3, 3], 0)
        ctx.beginPath()
        ctx.moveTo(point.x, top)
        ctx.lineTo(point.x, bottom)
        ctx.stroke()
        if (ctx.setLineDash) ctx.setLineDash([], 0)

        ctx.setFillStyle('rgba(102, 75, 57, .94)')
        ctx.beginPath()
        ctx.rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
        ctx.fill()
        ctx.setFillStyle('#fffaf3')
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(`健康值 ${values[this.activeChartIndex]}`, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2)
      }
      ctx.draw()
    }
  }
}
</script>

<style scoped>
.pet-date-row {
  display: flex;
  flex-direction: column;
  padding-top: 16rpx;
}

.pet-selector-anchor {
  position: relative;
  z-index: 42;
  width: max-content;
}

.pet-chip {
  width: max-content;
  min-height: 82rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.pet-chip-avatar {
  width: 78rpx;
  height: 78rpx;
  overflow: hidden;
  border: 5rpx solid #f3e4ca;
  border-radius: 50%;
  background: #f8ebcd;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5rpx 14rpx rgba(91, 67, 48, .08);
}

.pet-chip-avatar image {
  width: 100%;
  height: 100%;
}

.pet-chip-arrow {
  color: var(--brand-dark);
  transition: transform .2s ease;
}

.pet-chip[aria-expanded="true"] .pet-chip-arrow {
  transform: rotate(180deg);
}

.pet-popover-mask {
  position: fixed;
  z-index: 40;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
}

.pet-popover {
  position: absolute;
  z-index: 41;
  top: 92rpx;
  left: 0;
  width: 500rpx;
  max-width: calc(100vw - 56rpx);
  padding: 14rpx;
  border: 1rpx solid #eadcc9;
  border-radius: 28rpx;
  background: #fffdf9;
  box-shadow: 0 18rpx 42rpx rgba(84, 60, 42, .16);
}

.pet-popover::before {
  position: absolute;
  top: -10rpx;
  left: 34rpx;
  width: 20rpx;
  height: 20rpx;
  border-top: 1rpx solid #eadcc9;
  border-left: 1rpx solid #eadcc9;
  background: #fffdf9;
  content: '';
  transform: rotate(45deg);
}

.pet-popover-option {
  width: 100%;
  min-height: 104rpx;
  padding: 13rpx 16rpx;
  border-radius: 22rpx;
  display: grid;
  grid-template-columns: 72rpx 1fr auto;
  align-items: center;
  gap: 14rpx;
  color: var(--ink);
  text-align: left;
}

.pet-popover-option + .pet-popover-option {
  margin-top: 6rpx;
}

.pet-popover-option.selected {
  background: #fbf1dc;
}

.pet-popover-avatar {
  width: 66rpx;
  height: 66rpx;
  overflow: hidden;
  border-radius: 50%;
  background: #f7e8c9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-popover-avatar image {
  width: 100%;
  height: 100%;
}

.pet-popover-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.pet-popover-name {
  font-size: 25rpx;
  font-weight: 600;
}

.pet-popover-meta {
  overflow: hidden;
  color: var(--muted);
  font-size: 19rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pet-current {
  padding: 7rpx 12rpx;
  border-radius: 999rpx;
  color: #9a6a42;
  background: #f3dfb8;
  font-size: 18rpx;
}

.calendar-action {
  width: 52rpx;
  height: 52rpx;
  border: 0;
  border-radius: 50%;
  background: #f8ecd8;
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-row {
  display: grid;
  grid-template-columns: 70rpx 1fr 70rpx;
  align-items: center;
  font-weight: 600;
}

.month-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22rpx;
}

.month-row button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-strip {
  min-height: 104rpx;
  margin-top: 24rpx;
  padding: 12rpx;
  border-radius: 28rpx;
  background: #fffaf3;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.date-strip button {
  min-width: 0;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7rpx;
  color: var(--muted);
  font-size: 20rpx;
}

.date-strip button text:last-child {
  color: var(--ink);
  font-size: 25rpx;
  font-weight: 600;
}

.date-strip button.active {
  background: var(--gold);
}

.health-overview {
  margin-top: 30rpx;
  padding: 0 6rpx 26rpx;
  border-bottom: 1rpx solid var(--line);
}

.score-block {
  min-height: 190rpx;
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.score-ring {
  width: 146rpx;
  height: 146rpx;
  border: 13rpx solid #c49a67;
  border-right-color: #eadfcf;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-20deg);
}

.score-ring text {
  transform: rotate(20deg);
  font-size: 18rpx;
}

.score-ring .score {
  font-size: 48rpx;
  font-weight: 700;
}

.status {
  display: block;
  margin: 5rpx 0 12rpx;
  color: #ad6d3e;
  font-size: 42rpx;
}

.trend {
  display: inline-flex;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  color: var(--green);
  background: var(--green-soft);
  font-size: 21rpx;
  align-items: center;
  gap: 6rpx;
}

.trend-heading {
  margin-top: 10rpx;
}

.trend-chart {
  width: 100%;
  height: 300rpx;
  margin-top: 18rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #fffdf9 0%, #fffaf3 100%);
}

.detail-section {
  padding: 24rpx;
}

.record-grid {
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.record-item {
  min-height: 128rpx;
  padding: 14rpx 6rpx;
  border-radius: 22rpx;
  background: #fbf5ec;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  font-size: 20rpx;
}

.record-value {
  font-size: 24rpx;
  font-weight: 600;
}

.record-unit {
  font-size: 17rpx;
  font-weight: 400;
}

.health-advice {
  margin-top: 24rpx;
  padding: 24rpx 26rpx;
  border: 1rpx solid rgba(220, 183, 114, .2);
  border-radius: 28rpx;
  background: linear-gradient(135deg, #fbefcf, #f7e6bc);
  display: grid;
  grid-template-columns: 54rpx 1fr;
  align-items: start;
  gap: 15rpx;
}

.advice-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, .68);
  display: flex;
  align-items: center;
  justify-content: center;
}

.advice-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7rpx;
}

.advice-title {
  color: var(--ink);
  font-size: 23rpx;
  font-weight: 500;
}

.advice-text {
  color: #80634f;
  font-size: 21rpx;
  font-weight: 400;
  line-height: 1.65;
}

.sheet-mask {
  position: fixed;
  z-index: 50;
  inset: 0;
  background: rgba(67, 53, 43, .32);
  display: flex;
  align-items: flex-end;
}

.calendar-sheet {
  width: 100%;
  padding: 30rpx 30rpx calc(34rpx + env(safe-area-inset-bottom));
  border-radius: 36rpx 36rpx 0 0;
  background: var(--paper);
}

.calendar-sheet button {
  color: var(--brand);
}

.date-picker {
  height: 360rpx;
  margin-top: 20rpx;
}

.date-picker view {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
