<template>
  <view class="page no-tab guide-page">
    <AppTopBar title="养宠注意事项" back />

    <view class="guide-hero">
      <text class="muted">开始养宠前，请认真读完</text>
      <text class="hero-title">让陪伴从充分准备开始</text>
      <text class="hero-desc">从选择宠物、准备用品到饮食、健康和居家安全，提前了解每一项责任。</text>
      <AppIcon class="hero-paw" name="paw" size="84rpx" />
    </view>

    <view class="guide-content">
      <view v-for="(section, index) in guideSections" :key="section.title" class="guide-section">
        <view class="guide-title-row">
          <AppIcon class="guide-icon" :name="section.icon" size="42rpx" />
          <view><text class="number">{{ String(index + 1).padStart(2, '0') }}</text><text class="section-title">{{ section.title }}</text></view>
        </view>
        <text v-for="paragraph in section.body" :key="paragraph" class="paragraph">{{ paragraph }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { guideSections } from '../../common/data.js'
export default { components: { AppTopBar }, data() { return { guideSections } } }
</script>

<style scoped>
.guide-hero {
  position: relative;
  min-height: 230rpx;
  padding: 32rpx;
  overflow: hidden;
  border-radius: 34rpx;
  background: linear-gradient(135deg, #f6d99d, #efc57f);
}
.hero-title { display: block; margin: 14rpx 0 8rpx; width: 75%; font-size: 39rpx; font-weight: 600; }
.hero-desc { display: block; width: 76%; color: #806957; font-size: 22rpx; line-height: 1.65; }
.hero-paw { position: absolute; right: 30rpx; top: 70rpx; font-size: 84rpx; transform: rotate(18deg); }
.guide-content { padding: 6rpx 4rpx; }
.guide-section { padding: 34rpx 10rpx; border-bottom: 1rpx solid var(--line); }
.guide-title-row { margin-bottom: 18rpx; display: grid; grid-template-columns: 58rpx 1fr; align-items: center; gap: 12rpx; }
.guide-title-row > view { display: flex; flex-direction: column; gap: 3rpx; }
.number { color: var(--brand); font-size: 18rpx; font-weight: 700; letter-spacing: 2rpx; }
.paragraph { display: block; margin-top: 12rpx; color: #705e52; font-size: 28rpx; line-height: 1.9; }
</style>
