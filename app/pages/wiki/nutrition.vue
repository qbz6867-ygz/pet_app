<template>
  <view class="page no-tab nutrition-page">
    <view class="nutrition-topbar" :style="navigationStyle">
      <button class="topbar-back" aria-label="返回" @tap="goBack">
        <AppIcon name="back" size="34rpx" />
      </button>
      <text class="topbar-title">{{ guide.title }}</text>
      <view class="topbar-space" />
    </view>

    <view class="nutrition-hero">
      <image :src="guide.image" mode="aspectFill" />
      <view class="hero-shade" />
      <view class="hero-copy">
        <text class="hero-label">{{ guide.label }}</text>
        <text class="hero-title">{{ guide.title }}</text>
        <text class="hero-summary">{{ guide.summary }}</text>
      </view>
    </view>

    <view class="nutrition-list">
      <view v-for="(section, index) in guide.sections" :key="section.title" class="nutrition-section">
        <view class="section-number">{{ String(index + 1).padStart(2, '0') }}</view>
        <view class="section-content">
          <view class="section-heading">
            <AppIcon :name="section.icon" size="34rpx" />
            <text>{{ section.title }}</text>
          </view>
          <text class="section-body">{{ section.body }}</text>
        </view>
      </view>
    </view>

    <view class="nutrition-note">
      <AppIcon name="shield" size="30rpx" />
      <text>本指南适用于健康宠物的日常营养管理。处方饮食、疾病恢复、怀孕哺乳或自制饮食，请遵循宠物医生的个体化建议。</text>
    </view>

    <text class="source-note">资料依据：WSAVA 全球营养指南、Merck Veterinary Manual、Cornell Feline Health Center。</text>
  </view>
</template>

<script>
import { nutritionGuides } from '../../common/data.js'
import { getNavigationStyle } from '../../common/navigation.js'

export default {
  data() {
    return { type: 'dog', navigationStyle: getNavigationStyle() }
  },
  computed: {
    guide() {
      return nutritionGuides[this.type] || nutritionGuides.dog
    }
  },
  onLoad(options) {
    this.type = options.type === 'cat' ? 'cat' : 'dog'
  },
  onShow() {
    this.navigationStyle = getNavigationStyle()
  },
  onResize() {
    this.navigationStyle = getNavigationStyle()
  },
  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) uni.navigateBack()
      else uni.reLaunch({ url: '/pages/wiki/index' })
    }
  }
}
</script>

<style scoped>
.nutrition-topbar {
  position: -webkit-sticky;
  position: sticky;
  z-index: 40;
  top: 0;
  min-height: 188rpx;
  margin: 0 -40rpx 24rpx;
  padding: calc(env(safe-area-inset-top) + 102rpx) 40rpx 20rpx;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 10rpx 24rpx rgba(91, 67, 48, 0.045);
  display: grid;
  grid-template-columns: var(--menu-side-width, 72rpx) minmax(0, 1fr) var(--menu-side-width, 72rpx);
  grid-auto-rows: var(--menu-button-height, 64rpx);
  align-items: center;
}

.topbar-back {
  width: 64rpx;
  height: 100%;
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-title {
  display: block;
  overflow: hidden;
  color: var(--ink);
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-space { width: 64rpx; }

.nutrition-hero {
  position: relative;
  height: 390rpx;
  overflow: hidden;
  border-radius: 34rpx;
  background: #f7ecdd;
}

.nutrition-hero image { width: 100%; height: 100%; }
.hero-shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(57, 39, 28, 0.78) 0%, rgba(57, 39, 28, 0.12) 70%); }
.hero-copy { position: absolute; right: 28rpx; bottom: 28rpx; left: 28rpx; display: flex; flex-direction: column; align-items: flex-start; }
.hero-label { min-height: 44rpx; padding: 0 16rpx; border-radius: 999rpx; color: #7d5637; background: #f8e7c6; display: inline-flex; align-items: center; font-size: 22rpx; }
.hero-title { margin-top: 14rpx; color: #ffffff; font-size: 40rpx; font-weight: 700; }
.hero-summary { margin-top: 10rpx; color: rgba(255, 255, 255, 0.9); font-size: 24rpx; line-height: 1.65; }

.nutrition-list { margin-top: 22rpx; }
.nutrition-section { padding: 32rpx 4rpx; border-bottom: 1rpx solid var(--line); display: grid; grid-template-columns: 58rpx minmax(0, 1fr); gap: 14rpx; }
.section-number { padding-top: 5rpx; color: var(--brand); font-size: 20rpx; font-weight: 700; letter-spacing: 1rpx; }
.section-heading { color: #604b3e; display: flex; align-items: center; gap: 12rpx; }
.section-heading text { font-size: 32rpx; font-weight: 600; }
.section-body { display: block; margin-top: 14rpx; color: #756155; font-size: 28rpx; line-height: 1.85; text-align: justify; text-indent: 2em; }

.nutrition-note { margin-top: 30rpx; padding: 24rpx; border: 1rpx solid #ead8c3; border-radius: 26rpx; color: #7c624f; background: #fff9f1; display: grid; grid-template-columns: 38rpx 1fr; gap: 12rpx; align-items: flex-start; }
.nutrition-note text { font-size: 24rpx; line-height: 1.7; }
.source-note { display: block; margin: 24rpx 10rpx 0; color: var(--muted); font-size: 20rpx; line-height: 1.6; }
</style>
