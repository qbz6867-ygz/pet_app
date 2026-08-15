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

    <view class="card ratings-card">
      <text class="section-kicker">品种信息</text>
      <view class="ratings-grid">
        <view v-for="rating in ratings" :key="rating.label" class="rating-item">
          <text class="rating-label">{{ rating.label }}</text>
          <view class="rating-stars" :aria-label="`${rating.score} 星`">
            <AppIcon v-for="score in 5" :key="score" :name="score <= rating.score ? 'star-filled' : 'star-empty'" size="24rpx" />
          </view>
        </view>
      </view>
    </view>

    <view class="personality">
      <text class="section-kicker">性格与陪伴</text>
      <text class="section-title">{{ breed.trait.replace('、', '，也') }}</text>
      <text class="body-copy">{{ breed.intro }}</text>
    </view>

    <view class="card care-card">
      <view><text class="section-kicker">日常养护</text><text class="section-title">陪伴建议</text></view>
      <text class="body-copy">{{ breed.care }}</text>
    </view>

    <view class="card comments-card">
      <view class="row-between">
        <view><text class="section-kicker">真实经验</text><text class="section-title">评论区</text></view>
        <view class="overall"><text>综合评分</text><text class="overall-score">4.4/5</text></view>
      </view>
      <view v-for="comment in comments.slice(0, 2)" :key="comment.name" class="comment-preview">
        <text class="comment-avatar">{{ comment.avatar }}</text>
        <view>
          <view class="comment-name"><text>{{ comment.name }}</text><text class="comment-date">{{ comment.date }}</text><text class="score">{{ comment.score }}/5</text></view>
          <text class="comment-text">{{ comment.text }}</text>
        </view>
      </view>
      <button class="ghost-button all-comments" @tap="openComments">全部评论</button>
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
  padding: 16rpx 4rpx 30rpx;
  border-bottom: 1rpx solid var(--line);
  display: grid;
  grid-template-columns: 244rpx minmax(0, 1fr);
  align-items: center;
  gap: 32rpx;
}

.breed-image {
  position: relative;
  width: 244rpx;
  height: 280rpx;
  overflow: hidden;
  border: 1rpx solid #ead9c4;
  border-radius: 30rpx;
  background: #f8ecd6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 28rpx rgba(91, 67, 48, .08);
}

.breed-image image {
  width: 100%;
  height: 100%;
}

.breed-type {
  padding: 7rpx 14rpx;
  border-radius: 999rpx;
  color: #99683f;
  background: #f8e7c6;
  font-size: 18rpx;
}

.breed-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10rpx;
}

.breed-name {
  color: #5c4334;
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1.3;
}

.breed-summary {
  display: block;
  margin-top: 6rpx;
  color: #756155;
  font-size: 24rpx;
  line-height: 1.68;
  text-align: justify;
}

.ratings-card { margin-top: 22rpx; padding: 24rpx; }
.ratings-grid { margin-top: 18rpx; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12rpx; }
.rating-item { min-height: 86rpx; padding: 14rpx 16rpx; border-radius: 20rpx; background: #fbf5ec; display: flex; flex-direction: column; justify-content: center; gap: 10rpx; }
.rating-label { color: #756155; font-size: 22rpx; }
.rating-stars { display: flex; align-items: center; gap: 5rpx; }

.personality { margin-top: 24rpx; padding: 28rpx 22rpx; border-radius: 30rpx; background: linear-gradient(135deg, #f8e5bc, #f3d49c); }
.body-copy { display: block; margin-top: 13rpx; color: #756155; font-size: 24rpx; line-height: 1.8; }
.care-card, .comments-card { margin-top: 22rpx; padding: 24rpx; }
.overall { display: flex; flex-direction: column; align-items: flex-end; color: var(--muted); font-size: 18rpx; }
.overall-score { color: var(--brand-dark); font-size: 28rpx; font-weight: 700; }
.comment-preview { margin-top: 16rpx; padding: 16rpx; border-radius: 22rpx; background: #fbf5ec; display: grid; grid-template-columns: 54rpx 1fr; gap: 14rpx; }
.comment-avatar { width: 50rpx; height: 50rpx; border-radius: 50%; color: white; background: #c8864f; display: flex; align-items: center; justify-content: center; }
.comment-name { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; font-weight: 600; }
.comment-date { color: var(--muted); font-size: 18rpx; font-weight: 400; }
.score { margin-left: auto; color: var(--brand); font-size: 20rpx; }
.comment-text { display: block; margin-top: 6rpx; color: var(--muted); font-size: 26rpx; line-height: 1.55; }
.all-comments { width: 100%; min-height: 66rpx; margin-top: 16rpx; }
</style>
