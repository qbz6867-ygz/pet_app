<template>
  <view class="page no-tab guide-page">
    <AppTopBar title="养宠注意事项" back center />

    <view class="guide-hero">
      <view class="hero-label"><text>科学养宠</text></view>
      <text class="hero-title">让陪伴从充分准备开始</text>
      <text class="hero-desc">从选择宠物、准备用品到饮食、健康和居家安全，提前了解每一项责任。</text>
      <view class="hero-rule" />
    </view>

    <view class="guide-content">
      <view
        v-for="(section, index) in guideSections"
        :key="section.title"
        class="guide-section"
        :class="{
          'has-image': section.image,
          'feature-primary': index === 0,
          'feature-offset': index === 2,
          'feature-health': index === 6
        }"
      >
        <view class="section-lead">
          <image
            v-if="section.image"
            class="guide-section-image"
            :src="section.image"
            mode="widthFix"
            :aria-label="`${section.title}配图`"
          />
          <view class="section-editorial-copy">
            <view class="guide-title-block">
              <view class="guide-meta">
                <AppIcon class="guide-icon" :name="section.icon" size="36rpx" />
                <text class="number">{{ String(index + 1).padStart(2, '0') }}</text>
              </view>
              <text class="section-title">{{ section.title }}</text>
            </view>
            <view v-if="index === 0 || index === 6" class="section-copy inline-copy">
              <text
                v-for="paragraph in (index === 0 ? section.body.slice(0, 1) : section.body)"
                :key="paragraph"
                class="paragraph"
              >{{ paragraph }}</text>
            </view>
          </view>
        </view>
        <view v-if="index !== 6" class="section-copy">
          <text
            v-for="paragraph in (index === 0 ? section.body.slice(1) : section.body)"
            :key="paragraph"
            class="paragraph"
          >{{ paragraph }}</text>
        </view>
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
  padding: 44rpx 16rpx 38rpx;
  border-bottom: 1rpx solid var(--line);
}
.hero-label { margin-bottom: 12rpx; color: var(--brand); font-size: 22rpx; font-weight: 600; letter-spacing: 4rpx; }
.hero-title { display: block; max-width: 560rpx; font-size: 40rpx; font-weight: 600; line-height: 1.35; }
.hero-desc { display: block; margin-top: 14rpx; max-width: 620rpx; color: #806957; font-size: 24rpx; line-height: 1.75; }
.hero-rule { width: 56rpx; height: 5rpx; margin-top: 24rpx; border-radius: 5rpx; background: var(--brand); }
.guide-content { padding: 0 4rpx 4rpx; }
.guide-section { padding: 42rpx 10rpx; border-bottom: 1rpx solid var(--line); }
.guide-section.has-image { padding-top: 32rpx; padding-bottom: 34rpx; }
.section-lead { display: block; }
.guide-title-block { display: flex; flex-direction: column; margin-bottom: 22rpx; }
.guide-meta { display: flex; align-items: center; gap: 10rpx; margin-bottom: 8rpx; }
.guide-icon { color: var(--brand); }
.number { color: var(--brand); font-size: 20rpx; font-weight: 700; letter-spacing: 2rpx; }
.section-title { font-size: 32rpx; font-weight: 600; line-height: 1.4; }
.guide-section-image { display: block; width: 100%; height: auto; border-radius: 22rpx; }
.has-image .section-lead { display: grid; align-items: end; gap: 22rpx; margin-bottom: 24rpx; }
.has-image .guide-title-block { margin-bottom: 0; }
.section-editorial-copy { min-width: 0; }
.feature-primary .section-lead { grid-template-columns: minmax(0, .86fr) minmax(0, 1.35fr); align-items: start; }
.feature-primary .guide-section-image { grid-column: 1; grid-row: 1; border-radius: 12rpx 28rpx 28rpx 12rpx; }
.feature-primary .section-editorial-copy { grid-column: 2; grid-row: 1; padding-top: 18rpx; }
.feature-offset .section-lead { grid-template-columns: minmax(0, .78fr) minmax(0, 1.65fr); align-items: center; }
.feature-offset .section-editorial-copy { grid-column: 1; grid-row: 1; padding: 0 0 12rpx 6rpx; }
.feature-offset .guide-section-image { grid-column: 2; grid-row: 1; border-radius: 12rpx 28rpx 12rpx 28rpx; }
.feature-health .section-lead { grid-template-columns: minmax(0, .82fr) minmax(0, 1.28fr); align-items: start; }
.feature-health .guide-section-image { grid-column: 1; grid-row: 1; border-radius: 160rpx 160rpx 18rpx 18rpx; }
.feature-health .section-editorial-copy { grid-column: 2; grid-row: 1; padding-top: 20rpx; }
.section-copy { width: 100%; }
.inline-copy { margin-top: 20rpx; }
.inline-copy .paragraph { line-height: 1.78; }
.paragraph { display: block; margin-top: 0; color: #705e52; font-size: 28rpx; line-height: 1.9; text-align: justify; text-indent: 2em; }
.paragraph + .paragraph { margin-top: 14rpx; }
</style>
