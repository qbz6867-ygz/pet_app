<template>
  <view class="page no-tab breed-list-page">
    <AppTopBar title="全部品种" eyebrow="宠物百科" back />

    <view class="catalog-main">
      <view class="search-box">
        <AppIcon name="search" size="28rpx" />
        <input v-model="query" placeholder="搜索全部宠物品种" />
      </view>

      <view class="catalog-toolbar">
        <text>共 {{ filteredBreeds.length }} 个品种</text>
        <button class="filter-trigger" :class="{ active: filterOpen }" @tap="filterOpen = !filterOpen">
          <AppIcon name="filter" size="27rpx" />
          <text>筛选{{ activeFilterCount ? ` · ${activeFilterCount}` : '' }}</text>
          <AppIcon :name="filterOpen ? 'chevron-up' : 'chevron-down'" size="21rpx" />
        </button>
      </view>

      <view v-if="filterOpen" class="filter-dismiss" @tap="filterOpen = false" />
      <view v-if="filterOpen" class="filter-panel">
        <view class="filter-heading">
          <view>
            <text class="filter-kicker">按饲养需求查找</text>
            <text class="filter-title">筛选品种</text>
          </view>
          <button class="filter-close" aria-label="关闭筛选" @tap="filterOpen = false">
            <AppIcon name="close" size="25rpx" />
          </button>
        </view>
        <view
          v-for="group in filterGroups"
          :key="group.key"
          class="filter-group"
          :class="{ 'type-group': group.key === 'type' }"
        >
          <text>{{ group.label }}</text>
          <view>
            <button
              v-for="option in group.options"
              :key="option"
              :class="{ active: filters[group.key] === option }"
              @tap="filters[group.key] = option"
            >{{ filterOptionLabel(group.key, option) }}</button>
          </view>
        </view>
        <view class="filter-actions">
          <button class="reset-button" @tap="resetFilters">重置</button>
          <button class="apply-button" @tap="filterOpen = false">查看 {{ filteredBreeds.length }} 个品种</button>
        </view>
      </view>

      <view class="breed-grid">
        <button v-for="breed in filteredBreeds" :key="breed.id" class="breed-card" @tap="openBreed(breed.id)">
          <view class="breed-art">
            <image v-if="breed.image" :src="breed.image" mode="aspectFill" />
            <AppIcon v-else :name="breed.icon" size="88rpx" />
            <text class="breed-type">{{ breed.type === '犬类' ? '犬类' : '猫类' }}</text>
          </view>
          <text class="breed-name">{{ breed.name }}</text>
        </button>
      </view>
      <view v-if="!filteredBreeds.length" class="empty">没有找到符合条件的品种</view>
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
      breeds,
      query: '',
      filterOpen: false,
      filters: { type: '全部', bodySize: '全部', coat: '全部', activity: '全部', shedding: '全部' },
      filterGroups: [
        { key: 'type', label: '宠物类型', options: ['全部', '猫类', '犬类'] },
        { key: 'bodySize', label: '体型', options: ['全部', '小型', '中型', '大型'] },
        { key: 'coat', label: '毛发长度', options: ['全部', '短毛', '中长毛', '长毛'] },
        { key: 'activity', label: '活动量', options: ['全部', '较低', '适中', '较高'] },
        { key: 'shedding', label: '掉毛程度', options: ['全部', '较少', '一般', '较多'] }
      ]
    }
  },
  computed: {
    activeFilterCount() {
      return Object.values(this.filters).filter(value => value !== '全部').length
    },
    filteredBreeds() {
      const query = this.query.trim()
      return this.breeds.filter(item => {
        if (query && !item.name.includes(query)) return false
        if (this.filters.type !== '全部' && item.type !== this.filters.type) return false
        if (this.filters.bodySize !== '全部' && item.bodySize !== this.filters.bodySize) return false
        if (this.filters.coat !== '全部' && item.coat !== this.filters.coat) return false
        if (this.filters.activity !== '全部' && item.activity !== this.filters.activity) return false
        if (this.filters.shedding !== '全部' && item.shedding !== this.filters.shedding) return false
        return true
      })
    }
  },
  methods: {
    resetFilters() { this.filters = { type: '全部', bodySize: '全部', coat: '全部', activity: '全部', shedding: '全部' } },
    filterOptionLabel(key, option) {
      if (key === 'type' && option === '猫类') return '猫'
      if (key === 'type' && option === '犬类') return '狗'
      if (option === '全部' && key !== 'type') return '不限'
      return option
    },
    openBreed(id) { uni.navigateTo({ url: `/pages/wiki/detail?id=${id}` }) }
  }
}
</script>

<style scoped>
.catalog-main {
  position: relative;
}

.search-box {
  min-height: 96rpx;
  padding: 0 26rpx;
  border: 1rpx solid var(--line);
  border-radius: 28rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
}

.catalog-toolbar {
  min-height: 88rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 22rpx;
}

.filter-trigger {
  min-width: 136rpx;
  height: 58rpx;
  padding: 0 17rpx;
  border: 1rpx solid var(--line);
  border-radius: 22rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9rpx;
  color: var(--brand-dark);
  font-size: 22rpx;
}

.filter-trigger.active {
  border-color: #e3c18f;
  background: #fff8ec;
}

.filter-dismiss {
  position: fixed;
  z-index: 29;
  inset: 0;
  background: rgba(90, 71, 55, .035);
}

.filter-panel {
  position: absolute;
  z-index: 30;
  top: 198rpx;
  right: 0;
  width: calc(100% - 138rpx);
  padding: 28rpx 24rpx 22rpx;
  border: 1rpx solid var(--line);
  border-radius: 30rpx;
  background: #fffdfa;
  box-shadow: 0 24rpx 60rpx rgba(91, 67, 48, .13);
}

.filter-heading {
  padding-bottom: 19rpx;
  border-bottom: 1rpx solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-heading > view {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.filter-kicker {
  color: var(--muted);
  font-size: 18rpx;
}

.filter-title {
  color: var(--ink);
  font-size: 32rpx;
  font-weight: 600;
}

.filter-close {
  width: 48rpx;
  height: 48rpx;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-group {
  margin-top: 20rpx;
}

.filter-group > text {
  display: block;
  margin-bottom: 10rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.filter-group > view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
}

.filter-group.type-group > view {
  grid-template-columns: repeat(3, 1fr);
}

.filter-group button {
  min-width: 0;
  height: 52rpx;
  padding: 0 8rpx;
  border: 1rpx solid #eadac4;
  border-radius: 16rpx;
  color: var(--muted);
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  line-height: 1;
  text-align: center;
}

.filter-group button.active {
  border-color: #d9ab67;
  color: var(--brand-dark);
  background: #f5e1b8;
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, .75);
  font-weight: 600;
}

.filter-actions {
  margin-top: 24rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid var(--line-soft);
  display: grid;
  grid-template-columns: 136rpx 1fr;
  gap: 12rpx;
}

.filter-actions button {
  height: 62rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  line-height: 1;
  text-align: center;
}

.reset-button {
  border: 1rpx solid #e5d2b8;
  background: white;
}

.apply-button {
  background: #e9c987;
  font-weight: 600;
}

.breed-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.breed-card {
  min-width: 0;
  padding: 16rpx;
  border: 1rpx solid var(--line);
  border-radius: 28rpx;
  background: #fffdfa;
  text-align: left;
}

.breed-art {
  position: relative;
  height: 228rpx;
  margin-bottom: 17rpx;
  overflow: hidden;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #faedca, #f6e3b4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.breed-art image {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.breed-type {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  padding: 5rpx 11rpx;
  border-radius: 999rpx;
  color: var(--muted);
  background: rgba(255, 255, 255, .82);
  font-size: 18rpx;
}

.breed-name {
  display: block;
  padding: 2rpx 2rpx 6rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.empty {
  grid-column: 1 / -1;
  padding: 100rpx 20rpx;
  color: var(--muted);
  text-align: center;
}
</style>
