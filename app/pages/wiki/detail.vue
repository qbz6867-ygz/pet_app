<template>
  <view class="page no-tab">
    <AppTopBar title="品种详情" back center />

    <view class="breed-hero">
      <view class="breed-image">
        <image v-if="breed.image" :src="breed.image" mode="aspectFill" />
        <AppIcon v-else :name="breed.icon" size="78rpx" />
      </view>
      <view class="breed-copy">
        <text class="breed-type">{{ breed.type }}</text>
        <text class="breed-name">{{ breed.name }}</text>
        <text class="breed-summary">{{ breed.summary }}</text>
      </view>
    </view>

    <view class="detail-section traits-section">
      <view class="section-heading"><text class="heading-mark" /><text class="section-heading-text">品种特质</text></view>
      <view class="trait-meta">
        <view><text>原产地</text><text>{{ originCountry }}</text></view>
        <view><text>体型分类</text><text>{{ breed.size }}</text></view>
        <view><text>平均寿命</text><text>{{ breed.age }}</text></view>
      </view>
      <view class="trait-tags"><text v-for="tag in traitTags" :key="tag">{{ tag }}</text></view>
    </view>

    <view class="detail-section ratings-section">
      <view class="section-heading"><text class="heading-mark" /><text class="section-heading-text">品种信息</text></view>
      <view class="ratings-grid">
        <view v-for="rating in ratings" :key="rating.label" class="rating-item">
          <text class="rating-label">{{ rating.label }}</text>
          <view class="rating-stars" :aria-label="`${rating.score} 星`">
            <AppIcon v-for="score in 5" :key="score" :name="score <= rating.score ? 'star-filled' : 'star-empty'" size="24rpx" />
          </view>
        </view>
      </view>
    </view>

    <view class="detail-section trivia-section">
      <view class="section-heading"><text class="heading-mark" /><text class="section-heading-text">{{ breed.name }}小常识</text></view>
      <text v-for="(paragraph, index) in triviaParagraphs" :key="index" class="body-copy trivia-copy">{{ paragraph }}</text>
    </view>

    <view class="detail-section care-section">
      <view class="section-heading"><text class="heading-mark" /><text class="section-heading-text">日常养护</text></view>
      <text class="body-copy">{{ breed.care }}</text>
    </view>

    <view class="detail-section comments-section">
      <view class="row-between">
        <text class="section-title">评论区</text>
        <view class="overall"><text>综合评分</text><text class="overall-score">4.4/5</text></view>
      </view>
      <view v-for="comment in comments.slice(0, 2)" :key="comment.name" class="comment-preview">
        <text class="comment-avatar">{{ comment.avatar }}</text>
        <view>
          <view class="comment-name"><text>{{ comment.name }}</text><text class="comment-date">{{ comment.date }}</text><text class="score">{{ comment.score }}/5</text></view>
          <text class="comment-text">{{ comment.text }}</text>
        </view>
      </view>
      <button class="all-comments" @tap="openComments">查看全部评论</button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { breeds, comments } from '../../common/data.js'

export default {
  components: { AppTopBar },
  data() { return { breed: breeds[0], comments } },
  computed: {
    originCountry() {
      const countryMap = {
        英国威尔士: '英国',
        英国苏格兰: '英国',
        德国与法国: '德国、法国',
        加拿大纽芬兰: '加拿大',
        英国边境地区: '英国',
        西伯利亚地区: '俄罗斯',
        伊朗与英国: '伊朗、英国'
      }
      return countryMap[this.breed.origin] || this.breed.origin || '资料整理中'
    },
    traitTags() {
      if (Array.isArray(this.breed.traits) && this.breed.traits.length) return this.breed.traits
      return (this.breed.trait || '').split(/[、，]/).filter(Boolean)
    },
    triviaParagraphs() {
      if (Array.isArray(this.breed.trivia) && this.breed.trivia.length) return this.breed.trivia
      return [this.breed.intro].filter(Boolean)
    },
    ratings() {
      if (Array.isArray(this.breed.ratings) && this.breed.ratings.length) return this.breed.ratings
      const scoreMap = {
        exercise: { 中低: 2, 中等: 3, 中高: 4, 高: 5 },
        shedding: { 较少: 1, 一般: 3, 较多: 5 },
        appetite: { 较小: 2, 中等: 3, 较好: 4, 较大: 5 },
        odor: { 很轻: 1, 较轻: 2, 中等: 3, 较重: 5 }
      }
      return [
        { label: '运动需求', score: scoreMap.exercise[this.breed.exercise] || 3 },
        { label: '掉毛程度', score: scoreMap.shedding[this.breed.shedding] || 3 },
        { label: '饭量', score: scoreMap.appetite[this.breed.appetite] || 3 },
        { label: '体味', score: scoreMap.odor[this.breed.odor] || 3 },
        { label: '亲人程度', score: /亲人|友善|温顺|粘人/.test(this.breed.trait || '') ? 5 : 3 },
        { label: '训练配合度', score: 4 }
      ]
    }
  },
  onLoad(options) {
    this.breed = breeds.find(item => item.id === Number(options.id || 1)) || breeds[0]
  },
  methods: {
    openComments() { uni.navigateTo({ url: `/pages/wiki/comments?id=${this.breed.id}` }) }
  }
}
</script>

<style scoped>
.breed-hero {
  padding: 24rpx 4rpx 40rpx;
  border-bottom: 1rpx solid var(--line);
  display: grid;
  grid-template-columns: 304rpx minmax(0, 1fr);
  align-items: center;
  gap: 34rpx;
}

.breed-image {
  position: relative;
  width: 304rpx;
  height: 364rpx;
  overflow: hidden;
  border-radius: 26rpx;
  background: #f8ecd6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breed-image image {
  width: 100%;
  height: 100%;
}

.breed-type {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  color: #99683f;
  background: #f8e7c6;
  font-size: 22rpx;
}

.breed-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 14rpx;
}

.breed-name {
  color: #5c4334;
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1.22;
}

.breed-summary {
  display: block;
  margin-top: 8rpx;
  color: #756155;
  font-size: 24rpx;
  line-height: 1.72;
  text-indent: 2em;
  text-align: justify;
}

.detail-section {
  padding: 34rpx 4rpx 38rpx;
  border-bottom: 1rpx solid var(--line);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 28rpx;
}

.heading-mark {
  width: 7rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: #dda052;
}

.section-heading-text {
  color: #554137;
  font-size: 32rpx;
  font-weight: 650;
}

.ratings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rating-item {
  min-height: 92rpx;
  padding: 22rpx 18rpx;
  border-bottom: 1rpx solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10rpx;
}

.rating-item:nth-child(odd) {
  padding-left: 0;
  border-right: 1rpx solid var(--line);
}

.rating-item:nth-child(even) { padding-right: 0; }
.rating-item:nth-last-child(-n + 2) { border-bottom: 0; }
.rating-label { color: #6f5a4e; font-size: 24rpx; white-space: nowrap; }
.rating-stars { display: flex; align-items: center; gap: 3rpx; }

.care-section .section-title,
.comments-section .section-title {
  display: block;
  font-size: 40rpx;
  font-weight: 600;
}

.body-copy { display: block; margin-top: 18rpx; color: #756155; font-size: 28rpx; line-height: 1.8; }
.trivia-copy,
.care-section .body-copy { text-indent: 2em; text-align: justify; }
.trait-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.trait-meta>view { padding: 4rpx 22rpx; border-right: 1rpx solid var(--line); display: flex; flex-direction: column; gap: 10rpx; }
.trait-meta>view:first-child { padding-left: 0; }
.trait-meta>view:last-child { padding-right: 0; border-right: 0; }
.trait-meta text:first-child { color: var(--muted); font-size: 22rpx; }
.trait-meta text:last-child { color: #5f4a3e; font-size: 28rpx; font-weight: 600; }
.trait-tags { margin-top: 28rpx; display: flex; flex-wrap: wrap; gap: 12rpx; }
.trait-tags text { min-height: 48rpx; padding: 0 18rpx; border: 1rpx solid #ead7c3; border-radius: 999rpx; color: #8f5f3b; background: #fffaf4; display: inline-flex; align-items: center; font-size: 22rpx; }
.trivia-copy { margin-top: 0; }
.trivia-copy + .trivia-copy { margin-top: 22rpx; }
.overall { display: flex; flex-direction: column; align-items: flex-end; color: var(--muted); font-size: 18rpx; }
.overall-score { color: var(--brand-dark); font-size: 28rpx; font-weight: 700; }
.comments-section { border-bottom: 0; }
.comments-section .row-between { align-items: flex-end; }
.comments-section .section-heading { margin-bottom: 10rpx; }
.comment-preview { padding: 26rpx 0; border-bottom: 1rpx solid var(--line); display: grid; grid-template-columns: 54rpx 1fr; gap: 14rpx; }
.comment-avatar { width: 50rpx; height: 50rpx; border-radius: 50%; color: white; background: #c8864f; display: flex; align-items: center; justify-content: center; }
.comment-name { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; font-weight: 600; }
.comment-date { color: var(--muted); font-size: 18rpx; font-weight: 400; }
.score { margin-left: auto; color: var(--brand); font-size: 20rpx; }
.comment-text { display: block; margin-top: 6rpx; color: var(--muted); font-size: 26rpx; line-height: 1.55; }
.all-comments { width: 100%; min-height: 72rpx; margin-top: 18rpx; color: var(--brand-dark); font-size: 28rpx; font-weight: 600; }
</style>
