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
      query: ''
    }
  },
  computed: {
    filteredBreeds() {
      const query = this.query.trim()
      return this.breeds.filter(item => !query || item.name.includes(query))
    }
  },
  methods: {
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
  color: var(--muted);
  font-size: 22rpx;
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
