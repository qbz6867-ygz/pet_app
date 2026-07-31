<template>
  <view class="page no-tab">
    <AppTopBar title="品种详情" back />

    <view class="breed-hero">
      <view class="breed-image">
        <image v-if="breed.image" :src="breed.image" mode="aspectFill" />
        <AppIcon v-else :name="breed.icon" size="78rpx" />
      </view>
      <view class="breed-copy">
        <text class="breed-type">{{ breed.type }}</text>
        <text class="muted">宠物百科 · 品种图鉴</text>
        <text class="breed-name">{{ breed.name }}</text>
        <text class="breed-trait">{{ breed.trait }}</text>
      </view>
    </view>

    <view class="card facts-card">
      <text class="section-kicker">品种信息</text>
      <view class="facts-grid">
        <view v-for="fact in facts" :key="fact.label">
          <view class="fact-icon"><AppIcon :name="fact.icon" size="25rpx" /></view>
          <text class="muted">{{ fact.label }}</text>
          <text>{{ fact.value }}</text>
        </view>
      </view>
    </view>

    <view class="personality">
      <text class="section-kicker">性格与陪伴</text>
      <text class="section-title">{{ breed.trait.replace('、', '，也') }}</text>
      <text class="body-copy">{{ breed.intro }}</text>
    </view>

    <view class="card care-card">
      <view class="row-between"><view><text class="section-kicker">日常养护</text><text class="section-title">陪伴建议</text></view><AppIcon class="heart" name="heart" size="38rpx" /></view>
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
          <view class="comment-name"><text>{{ comment.name }}</text><text v-if="comment.quality" class="quality">优质评论</text><text class="score">{{ comment.score }}/5</text></view>
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
    facts() {
      return [
        { icon: 'ruler', label: '体型', value: this.breed.size },
        { icon: 'paw', label: '运动量', value: this.breed.exercise },
        { icon: 'scissors', label: '掉毛程度', value: this.breed.shedding },
        { icon: 'meal', label: '饭量', value: this.breed.appetite },
        { icon: 'sparkle', label: '体味', value: this.breed.odor },
        { icon: 'calendar', label: '平均寿命', value: this.breed.age }
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
  min-height: 316rpx;
  padding: 8rpx 4rpx 30rpx;
  border-bottom: 1rpx solid var(--line);
  display: grid;
  grid-template-columns: 258rpx 1fr;
  align-items: center;
  gap: 30rpx;
}

.breed-image {
  position: relative;
  width: 258rpx;
  height: 282rpx;
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
  gap: 11rpx;
}

.breed-copy .muted {
  color: #8c735f;
  font-size: 18rpx;
  line-height: 1.5;
}

.breed-name {
  color: #5c4334;
  font-size: 38rpx;
  font-weight: 600;
  line-height: 1.25;
}

.breed-trait {
  color: #755b49;
  font-size: 23rpx;
  line-height: 1.5;
}

.facts-card { margin-top: 22rpx; padding: 24rpx; }
.facts-grid { margin-top: 18rpx; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; }
.facts-grid > view { min-height: 122rpx; padding: 12rpx 5rpx; border-radius: 22rpx; background: #fbf5ec; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5rpx; text-align: center; font-size: 21rpx; }
.facts-grid .muted { font-size: 18rpx; }
.fact-icon { width: 44rpx; height: 44rpx; border: 1rpx solid var(--line); border-radius: 14rpx; background: white; display: flex; align-items: center; justify-content: center; color: var(--brand); }

.personality { margin-top: 24rpx; padding: 28rpx 22rpx; border-radius: 30rpx; background: linear-gradient(135deg, #f8e5bc, #f3d49c); }
.body-copy { display: block; margin-top: 13rpx; color: #756155; font-size: 23rpx; line-height: 1.8; }
.care-card, .comments-card { margin-top: 22rpx; padding: 24rpx; }
.overall { display: flex; flex-direction: column; align-items: flex-end; color: var(--muted); font-size: 18rpx; }
.overall-score { color: var(--brand-dark); font-size: 26rpx; font-weight: 700; }
.comment-preview { margin-top: 16rpx; padding: 16rpx; border-radius: 22rpx; background: #fbf5ec; display: grid; grid-template-columns: 54rpx 1fr; gap: 14rpx; }
.comment-avatar { width: 50rpx; height: 50rpx; border-radius: 50%; color: white; background: #c8864f; display: flex; align-items: center; justify-content: center; }
.comment-name { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; font-weight: 600; }
.quality { padding: 4rpx 8rpx; border-radius: 999rpx; color: #9e6d36; background: #f7e3b8; font-size: 16rpx; }
.score { margin-left: auto; color: var(--brand); font-size: 19rpx; }
.comment-text { display: block; margin-top: 6rpx; color: var(--muted); font-size: 20rpx; line-height: 1.55; }
.all-comments { width: 100%; min-height: 66rpx; margin-top: 16rpx; }
</style>
