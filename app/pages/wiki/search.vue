<template>
  <view class="page no-tab search-page">
    <AppTopBar title="品种搜索" eyebrow="宠物百科" back />

    <view class="search-input">
      <AppIcon name="search" size="28rpx" />
      <input
        v-model="query"
        :focus="autoFocus"
        placeholder="搜索宠物品种"
        confirm-type="search"
        @confirm="finishInput"
      />
      <button v-if="query" class="clear-button" aria-label="清空搜索" @tap="clearQuery">
        <AppIcon name="close" size="24rpx" />
      </button>
    </view>

    <view class="result-heading">
      <text>{{ query.trim() ? '搜索结果' : '全部品种' }}</text>
      <text>{{ filteredBreeds.length }} 个品种</text>
    </view>

    <view v-if="filteredBreeds.length" class="result-list">
      <button
        v-for="breed in filteredBreeds"
        :key="breed.id"
        class="result-card"
        @tap="openBreed(breed.id)"
      >
        <view class="breed-image">
          <image v-if="breed.image" :src="breed.image" mode="aspectFill" />
          <AppIcon v-else :name="breed.icon" size="58rpx" />
        </view>
        <view class="breed-copy">
          <text class="breed-name">{{ breed.name }}</text>
          <text class="breed-meta">{{ breed.type }} · {{ breed.bodySize }} · {{ breed.coat }}</text>
        </view>
        <AppIcon name="chevron-right" size="24rpx" />
      </button>
    </view>

    <view v-else class="empty-state">
      <AppIcon name="search" size="52rpx" />
      <text class="empty-title">没有找到相关品种</text>
      <text class="empty-hint">换一个名称或关键词试试</text>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { breeds } from '../../common/data.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      query: '',
      breeds,
      autoFocus: true
    }
  },
  computed: {
    filteredBreeds() {
      const value = this.query.trim().toLowerCase()
      if (!value) return this.breeds
      return this.breeds.filter(item => [
        item.name,
        item.type,
        item.bodySize,
        item.coat,
        item.trait
      ].some(field => String(field || '').toLowerCase().includes(value)))
    }
  },
  methods: {
    clearQuery() {
      this.query = ''
      this.autoFocus = false
      this.$nextTick(() => { this.autoFocus = true })
    },
    finishInput() { this.autoFocus = false },
    openBreed(id) { uni.navigateTo({ url: `/pages/wiki/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.search-input {
  min-height: 92rpx;
  padding: 0 18rpx 0 26rpx;
  border: 1rpx solid #eadfd4;
  border-radius: 999rpx;
  background: #fffefc;
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: var(--muted);
  box-shadow: 0 10rpx 28rpx rgba(96, 68, 45, .035);
}

.search-input input {
  flex: 1;
  height: 92rpx;
  color: var(--ink);
  font-size: 28rpx;
}

.clear-button {
  width: 56rpx;
  height: 56rpx;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #9a897d;
  background: #f5eee7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-heading {
  min-height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ink);
  font-size: 28rpx;
  font-weight: 600;
}

.result-heading text:last-child {
  color: var(--muted);
  font-size: 22rpx;
  font-weight: 400;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.result-card {
  width: 100%;
  min-height: 132rpx;
  padding: 14rpx 18rpx 14rpx 14rpx;
  border: 1rpx solid var(--line);
  border-radius: 26rpx;
  color: var(--ink);
  background: #fffdfa;
  display: grid;
  grid-template-columns: 104rpx minmax(0, 1fr) 28rpx;
  align-items: center;
  gap: 18rpx;
  text-align: left;
}

.breed-image {
  width: 104rpx;
  height: 104rpx;
  overflow: hidden;
  border-radius: 20rpx;
  background: #f8ecd6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breed-image image {
  width: 100%;
  height: 100%;
}

.breed-copy {
  min-width: 0;
}

.breed-name {
  display: block;
  overflow: hidden;
  font-size: 28rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breed-meta {
  display: block;
  margin-top: 8rpx;
  overflow: hidden;
  color: var(--muted);
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  padding: 120rpx 20rpx;
  color: #b29f90;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-title {
  margin-top: 22rpx;
  color: var(--ink);
  font-size: 28rpx;
  font-weight: 600;
}

.empty-hint {
  margin-top: 10rpx;
  color: var(--muted);
  font-size: 22rpx;
}
</style>
