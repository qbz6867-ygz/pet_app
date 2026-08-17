<template>
  <view class="page no-tab comments-page">
    <AppTopBar :title="breed.name" back center />

    <view class="summary">
      <view class="summary-heading row-between">
        <view class="section-heading">
          <text class="heading-mark" />
          <text class="section-heading-text">{{ breed.name }}真实经验</text>
        </view>
        <text class="review-count">{{ comments.length }} 条评价</text>
      </view>

      <view class="score-overview">
        <view class="score-main">
          <text class="score-label">综合评分</text>
          <view class="score-value"><text class="score-number">{{ averageScore }}</text><text>/5</text></view>
          <text class="score-caption">来自真实养宠经验</text>
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
            <AppIcon :name="score <= rating ? 'star-filled' : 'star-empty'" size="28rpx" />
          </button>
        </view>
      </view>
    </view>

    <view class="comments-head row-between">
      <view class="section-heading">
        <text class="heading-mark" />
        <text class="section-heading-text">全部评论</text>
      </view>
      <text class="page-count">第 {{ currentPage }}/{{ totalPages }} 页</text>
    </view>

    <view class="comments-list">
      <view v-for="(comment, index) in pagedComments" :key="comment.id || `${comment.name}-${comment.date}-${index}`" class="comment-card">
        <text class="comment-avatar">{{ comment.avatar }}</text>
        <view class="comment-content">
          <view class="row-between">
            <view class="name-row">
              <text>{{ comment.name }}</text>
              <text class="date">{{ comment.date }}</text>
            </view>
            <text class="score">{{ comment.score }}/5</text>
          </view>
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
  padding: 10rpx 4rpx 34rpx;
  border-bottom: 1rpx solid var(--line);
}

.summary-heading {
  align-items: center;
  margin-bottom: 26rpx;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 14rpx;
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

.score-overview {
  padding-bottom: 28rpx;
  border-bottom: 1rpx solid var(--line);
  display: grid;
  grid-template-columns: 174rpx 1fr;
  align-items: center;
  gap: 24rpx;
}

.score-main {
  min-height: 164rpx;
  border-right: 1rpx solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.score-label {
  color: var(--muted);
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
  font-size: 22rpx;
}

.score-caption,
.review-count {
  color: var(--muted);
  font-size: 20rpx;
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
  font-size: 20rpx;
}

.distribution-percent {
  text-align: right;
}

.distribution-track {
  height: 8rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: rgba(139, 104, 72, .13);
}

.distribution-fill {
  height: 100%;
  border-radius: inherit;
  background: #d5a765;
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
  font-size: 28rpx;
  font-weight: 600;
}

.rate-hint {
  color: var(--muted);
  font-size: 20rpx;
  white-space: nowrap;
}

.comments-head { margin: 34rpx 4rpx 10rpx; }
.page-count { color: var(--muted); font-size: 20rpx; }
.comments-list { display: flex; flex-direction: column; }
.comment-card { padding: 26rpx 4rpx; border-bottom: 1rpx solid var(--line); display: grid; grid-template-columns: 54rpx 1fr; gap: 14rpx; }
.comment-avatar { width: 50rpx; height: 50rpx; border-radius: 50%; color: white; background: #c8864f; display: flex; align-items: center; justify-content: center; font-size: 22rpx; }
.comment-content { min-width: 0; }
.name-row { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; font-weight: 600; }
.score { color: var(--brand); font-size: 20rpx; }
.date { color: var(--muted); font-size: 20rpx; font-weight: 400; }
.text { display: block; margin-top: 6rpx; color: var(--muted); font-size: 28rpx; line-height: 1.55; }

.rating-row {
  display: flex;
  gap: 8rpx;
}

.rating-button {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: .7;
  transition: opacity .18s ease, transform .18s ease;
}

.rating-button.active {
  opacity: 1;
  transform: translateY(-2rpx);
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
  border: 1rpx solid var(--line);
  border-radius: 0;
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  color: var(--brand-dark);
  font-size: 22rpx;
}

.page-button.disabled {
  opacity: .38;
}

.page-status {
  min-width: 70rpx;
  color: var(--muted);
  font-size: 20rpx;
  text-align: center;
}

.review-composer {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 18rpx 40rpx 0;
  border-top: 1rpx solid var(--line);
  background: rgba(255, 255, 255, .985);
  box-shadow: 0 -10rpx 30rpx rgba(91, 67, 48, .055);
}

.composer-inner {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.composer-field {
  height: 80rpx;
  padding: 14rpx 24rpx;
  border: 1rpx solid #ead7c3;
  border-radius: 24rpx;
  background: #fffdfa;
  flex: 1;
  display: flex;
  align-items: center;
}

.composer-field textarea {
  width: 100%;
  height: 48rpx;
  padding: 0;
  color: var(--ink);
  font-size: 28rpx;
  line-height: 48rpx;
}

.comment-placeholder {
  color: #a9998c;
}

.submit-review {
  width: 116rpx;
  height: 80rpx;
  padding: 0;
  border-radius: 24rpx;
  color: #ffffff;
  background: var(--brand-dark);
  box-shadow: 0 8rpx 18rpx rgba(155, 108, 70, .16);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .18s ease, background-color .18s ease, box-shadow .18s ease;
}

.submit-review.disabled {
  border: 1rpx solid #eadfce;
  color: #ae9d8e;
  background: #f8f2e9;
  box-shadow: none;
}
</style>
