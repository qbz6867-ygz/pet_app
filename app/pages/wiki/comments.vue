<template>
  <view class="page no-tab comments-page">
    <AppTopBar :title="breed.name" back />

    <view class="summary">
      <view class="score-overview">
        <view class="score-main">
          <text class="score-label">综合评分</text>
          <view class="score-value"><text class="score-number">{{ averageScore }}</text><text>/5</text></view>
          <text class="review-count">来自 {{ comments.length }} 条真实评价</text>
        </view>

        <view class="score-distribution">
          <view v-for="item in ratingDistribution" :key="item.score" class="distribution-row">
            <text class="distribution-label">{{ item.score }} 分</text>
            <view class="distribution-track">
              <view class="distribution-fill" :style="{ width: `${item.percentage}%` }" />
            </view>
            <text class="distribution-percent">{{ item.percentage }}%</text>
          </view>
        </view>
      </view>

      <view class="rate-now">
        <view class="rate-copy">
          <text class="rate-title">立即评分</text>
          <text class="rate-hint">{{ rating ? `已选择 ${rating}.0 分` : '点亮图标为它打分' }}</text>
        </view>
        <view class="rating-row" aria-label="选择评分">
          <button
            v-for="score in 5"
            :key="score"
            class="rating-button"
            :class="{ active: score <= rating }"
            :aria-label="`${score} 分`"
            @tap="rating = score"
          >
            <AppIcon name="sparkle" size="29rpx" />
          </button>
        </view>
      </view>
    </view>

    <view class="comments-head row-between">
      <text class="section-title">全部评论</text>
      <text class="pill">第 {{ currentPage }}/{{ totalPages }} 页</text>
    </view>

    <view class="comments-list">
      <view v-for="(comment, index) in pagedComments" :key="comment.id || `${comment.name}-${comment.date}-${index}`" class="comment-card card">
        <text class="comment-avatar">{{ comment.avatar }}</text>
        <view class="comment-content">
          <view class="row-between">
            <view class="name-row"><text>{{ comment.name }}</text><text v-if="comment.quality" class="quality">优质评论</text></view>
            <text class="score">{{ comment.score }}/5</text>
          </view>
          <text class="date">{{ comment.date }}</text>
          <text class="text">{{ comment.text }}</text>
        </view>
      </view>
    </view>

    <view v-if="totalPages > 1" class="pagination">
      <button class="page-button" :class="{ disabled: currentPage === 1 }" @tap="changePage(-1)">
        <AppIcon name="chevron-left" size="25rpx" />
        <text>上一页</text>
      </button>
      <text class="page-status">{{ currentPage }} / {{ totalPages }}</text>
      <button class="page-button" :class="{ disabled: currentPage === totalPages }" @tap="changePage(1)">
        <text>下一页</text>
        <AppIcon name="chevron-right" size="25rpx" />
      </button>
    </view>

    <view class="review-composer">
      <view class="composer-inner">
        <view class="composer-field">
          <textarea
            v-model="commentText"
            fixed
            maxlength="300"
            :placeholder="rating ? `已评分 ${rating}.0，写下你的评论…` : '请先在顶部评分，再写下评论…'"
            placeholder-class="comment-placeholder"
          />
        </view>
        <button class="submit-review" :class="{ disabled: !canSubmit }" @tap="submitReview">发布</button>
      </view>
      <view class="safe-bottom" />
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { breeds, comments as defaultComments } from '../../common/data.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      breed: breeds[0],
      comments: [...defaultComments],
      customComments: [],
      rating: 0,
      commentText: '',
      currentPage: 1,
      pageSize: 20
    }
  },
  computed: {
    canSubmit() {
      return this.rating > 0 && this.commentText.trim().length > 0
    },
    averageScore() {
      if (!this.comments.length) return '0.0'
      const total = this.comments.reduce((sum, comment) => sum + Number(comment.score || 0), 0)
      return (total / this.comments.length).toFixed(1)
    },
    ratingDistribution() {
      return [5, 4, 3, 2, 1].map((score) => {
        const count = this.comments.filter((comment) => {
          const roundedScore = Math.round(Number(comment.score || 0))
          return Math.max(1, Math.min(5, roundedScore)) === score
        }).length
        return {
          score,
          percentage: this.comments.length ? Math.round((count / this.comments.length) * 100) : 0
        }
      })
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.comments.length / this.pageSize))
    },
    pagedComments() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.comments.slice(start, start + this.pageSize)
    },
    storageKey() {
      return `wikiComments:${this.breed.id}`
    }
  },
  onLoad(options) {
    this.breed = breeds.find(item => item.id === Number(options.id || 1)) || breeds[0]
    this.customComments = uni.getStorageSync(this.storageKey) || []
    this.comments = [...this.customComments, ...defaultComments]
  },
  methods: {
    changePage(step) {
      const nextPage = this.currentPage + step
      if (nextPage < 1 || nextPage > this.totalPages) return
      this.currentPage = nextPage
      this.$nextTick(() => {
        uni.pageScrollTo({ selector: '.comments-head', duration: 260 })
      })
    },
    submitReview() {
      if (!this.rating) {
        uni.showToast({ title: '请先选择评分', icon: 'none' })
        return
      }
      const text = this.commentText.trim()
      if (!text) {
        uni.showToast({ title: '请输入评论内容', icon: 'none' })
        return
      }

      const comment = {
        id: `custom-${Date.now()}`,
        avatar: '我',
        name: '我',
        date: '今天',
        score: this.rating.toFixed(1),
        text,
        quality: false
      }

      this.customComments.unshift(comment)
      this.comments.unshift(comment)
      uni.setStorageSync(this.storageKey, this.customComments)
      this.currentPage = 1
      this.rating = 0
      this.commentText = ''
      uni.showToast({ title: '评论已发布', icon: 'success' })
      this.$nextTick(() => {
        uni.pageScrollTo({ selector: '.comments-head', duration: 300 })
      })
    }
  }
}
</script>

<style scoped>
.page.no-tab.comments-page {
  padding-bottom: calc(166rpx + env(safe-area-inset-bottom));
}

.summary {
  padding: 30rpx 28rpx 24rpx;
  border: 1rpx solid #ead9bd;
  border-radius: 32rpx;
  background: linear-gradient(145deg, #fffaf0, #f8e7c4);
  box-shadow: 0 16rpx 42rpx rgba(121, 86, 52, .07);
}

.score-overview {
  padding-bottom: 25rpx;
  border-bottom: 1rpx solid rgba(143, 105, 69, .15);
  display: grid;
  grid-template-columns: 174rpx 1fr;
  align-items: center;
  gap: 24rpx;
}

.score-main {
  min-height: 164rpx;
  border-right: 1rpx solid rgba(133,92,54,.18);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.score-label {
  color: #94755d;
  font-size: 20rpx;
}

.score-value {
  margin: 2rpx 0 3rpx;
  color: #654b3a;
  line-height: 1;
}

.score-number {
  margin-right: 4rpx;
  font-size: 58rpx;
  font-weight: 650;
}

.score-value > text:last-child {
  color: #92765e;
  font-size: 21rpx;
}

.review-count {
  color: #a48a75;
  font-size: 17rpx;
  line-height: 1.45;
}

.score-distribution {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.distribution-row {
  display: grid;
  grid-template-columns: 42rpx 1fr 54rpx;
  align-items: center;
  gap: 10rpx;
}

.distribution-label,
.distribution-percent {
  color: #8d715d;
  font-size: 17rpx;
}

.distribution-percent {
  text-align: right;
}

.distribution-track {
  height: 10rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: rgba(139, 104, 72, .13);
}

.distribution-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e2b66e, #c98a4d);
}

.rate-now {
  padding-top: 22rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.rate-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3rpx;
}

.rate-title {
  color: #60483a;
  font-size: 25rpx;
  font-weight: 600;
}

.rate-hint {
  color: #a08773;
  font-size: 17rpx;
  white-space: nowrap;
}

.comments-head { margin: 28rpx 0 16rpx; }
.comments-list { display: flex; flex-direction: column; gap: 14rpx; }
.comment-card { padding: 20rpx; display: grid; grid-template-columns: 60rpx 1fr; gap: 14rpx; }
.comment-avatar { width: 56rpx; height: 56rpx; border-radius: 50%; color: white; background: #c8844c; display: flex; align-items: center; justify-content: center; }
.comment-content { min-width: 0; }
.name-row { display: flex; align-items: center; gap: 8rpx; font-weight: 600; }
.quality { padding: 4rpx 9rpx; border-radius: 999rpx; color: #9d6b34; background: #f6e2b5; font-size: 16rpx; }
.score { padding: 5rpx 10rpx; border: 1rpx solid #e5c69e; border-radius: 999rpx; color: var(--brand); font-size: 18rpx; }
.date { display: block; margin: 5rpx 0 10rpx; color: var(--muted); font-size: 18rpx; }
.text { color: #756357; font-size: 22rpx; line-height: 1.65; }

.rating-row {
  display: flex;
  gap: 8rpx;
}

.rating-button {
  width: 48rpx;
  height: 48rpx;
  border: 1rpx solid rgba(139, 96, 56, .18);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, .65);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .42;
  transform: scale(.96);
  transition: opacity .18s ease, background-color .18s ease, transform .18s ease;
}

.rating-button.active {
  border-color: rgba(145, 94, 45, .26);
  background: #fff9ed;
  opacity: 1;
  transform: scale(1);
}

.pagination {
  margin: 24rpx 0 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.page-button {
  min-width: 132rpx;
  height: 62rpx;
  padding: 0 18rpx;
  border: 1rpx solid #eadcca;
  border-radius: 20rpx;
  background: #fffaf3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  color: var(--brand-dark);
  font-size: 21rpx;
}

.page-button.disabled {
  opacity: .38;
}

.page-status {
  min-width: 70rpx;
  color: var(--muted);
  font-size: 18rpx;
  text-align: center;
}

.review-composer {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 14rpx 28rpx 0;
  border-top: 1rpx solid #eadfce;
  background: rgba(255, 255, 255, .97);
  box-shadow: 0 -12rpx 32rpx rgba(83, 61, 43, .08);
}

.composer-inner {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.composer-field {
  height: 74rpx;
  padding: 12rpx 20rpx;
  border: 1rpx solid #eadfce;
  border-radius: 24rpx;
  background: #fbf6ed;
  flex: 1;
  display: flex;
  align-items: center;
}

.composer-field textarea {
  width: 100%;
  height: 48rpx;
  padding: 0;
  color: var(--ink);
  font-size: 22rpx;
  line-height: 48rpx;
}

.comment-placeholder {
  color: #b7a79a;
}

.submit-review {
  width: 104rpx;
  height: 74rpx;
  padding: 0;
  border-radius: 22rpx;
  color: #ffffff;
  background: var(--brand-dark);
  font-size: 23rpx;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-review.disabled {
  color: #b5a99f;
  background: #eee6da;
  box-shadow: none;
}
</style>
