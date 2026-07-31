<template>
  <view class="page wiki-page">
    <AppTopBar title="宠物百科" eyebrow="PAW DAILY" />

    <view class="search-box">
      <AppIcon name="search" size="28rpx" />
      <input v-model="query" placeholder="搜索宠物品种" confirm-type="search" />
    </view>

    <button class="guide-banner" @tap="openGuide">
      <image class="guide-photo" src="/static/pet-avatar-corgi.png" mode="aspectFill" />
      <view class="guide-shade" />
      <view class="guide-copy">
        <text class="guide-title">新手养宠指南</text>
        <text class="guide-desc">开始养宠前，先了解这些重点</text>
        <view class="guide-icon"><AppIcon name="book" size="28rpx" /></view>
      </view>
    </button>

    <view class="wiki-heading">
      <text class="section-title">热门</text>
      <view class="breed-tabs">
        <button
          v-for="tab in breedTabs"
          :key="tab"
          class="breed-tab"
          :class="{ active: breedFilter === tab }"
          @tap="breedFilter = tab"
        >
          <text>{{ tab }}</text>
        </button>
      </view>
      <button class="all-breeds-link" @tap="openAll">
        <text>查看全部</text><AppIcon name="chevron-right" size="23rpx" />
      </button>
    </view>

    <view class="breed-grid">
      <view
        v-for="breed in filteredBreeds"
        :key="breed.id"
        class="breed-card card"
        hover-class="breed-card-hover"
        :hover-stay-time="120"
        @tap="openBreed(breed.id)"
      >
        <view class="breed-art">
          <image v-if="breed.image" :src="breed.image" mode="aspectFill" />
          <AppIcon v-else class="breed-symbol" :name="breed.icon" size="82rpx" />
        </view>
        <view class="breed-card-body">
          <text class="breed-name">{{ breed.name }}</text>
          <view class="breed-tags">
            <text>{{ breed.type === '犬类' ? '狗类' : '猫类' }}</text>
            <text>{{ breed.bodySize }}</text>
          </view>
          <text class="breed-desc">{{ breedImpression(breed.id) }}</text>
        </view>
      </view>
    </view>

    <AppBottomNav active="wiki" />
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import AppBottomNav from '../../components/AppBottomNav.vue'
import { breeds } from '../../common/data.js'

export default {
  components: { AppTopBar, AppBottomNav },
  data() {
    return {
      query: '',
      breeds,
      breedFilter: '全部',
      breedTabs: ['全部', '狗狗', '猫咪'],
      breedImpressions: {
        1: '短腿萌宠，精力充沛',
        2: '圆脸憨萌，安静陪伴',
        3: '暖心伙伴，忠诚可靠',
        4: '温柔粘人，颜值出众',
        5: '个性独立，忠诚机警',
        6: '聪明好学，造型百变',
        7: '爱说爱聊，陪伴感强',
        8: '体型霸气，内心温柔',
        9: '热情友善，家庭好伙伴',
        10: '聪明专注，运动天赋高',
        11: '小巧憨萌，城市生活友好',
        12: '微笑天使，雪白又治愈',
        13: '适应力强，稳重又亲人',
        14: '长毛优雅，安静爱陪伴',
        15: '豹纹醒目，活力十足',
        16: '无毛暖身，亲人爱撒娇'
      }
    }
  },
  computed: {
    filteredBreeds() {
      const value = this.query.trim()
      const typeMap = { 狗狗: '犬类', 猫咪: '猫类' }
      const selectedType = typeMap[this.breedFilter]
      return this.breeds.filter(item => {
        if (selectedType && item.type !== selectedType) return false
        return !value || item.name.includes(value) || item.type.includes(value)
      })
    }
  },
  methods: {
    openGuide() { uni.navigateTo({ url: '/pages/wiki/guide' }) },
    openAll() { uni.navigateTo({ url: '/pages/wiki/list' }) },
    openBreed(id) { uni.navigateTo({ url: `/pages/wiki/detail?id=${id}` }) },
    breedImpression(id) { return this.breedImpressions[id] || '独特伙伴，值得了解' }
  }
}
</script>

<style scoped>
.search-box {
  min-height: 86rpx;
  padding: 0 24rpx;
  border: 1rpx solid var(--line);
  border-radius: 24rpx;
  background: #fffdfa;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: var(--muted);
}

.search-box input {
  flex: 1;
  font-size: 26rpx;
}

.guide-banner {
  position: relative;
  width: 100%;
  min-height: 254rpx;
  margin-top: 26rpx;
  padding: 36rpx 34rpx;
  overflow: hidden;
  border: 1rpx solid #ead9c2;
  border-radius: 28rpx;
  background: #fffaf3;
  box-shadow: 0 12rpx 32rpx rgba(105, 77, 52, .055);
  text-align: left;
}

.guide-photo {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  width: 57%;
  height: 100%;
}

.guide-shade {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    90deg,
    #fffaf3 0%,
    #fffaf3 43%,
    rgba(255, 250, 243, .92) 51%,
    rgba(255, 250, 243, .3) 70%,
    rgba(255, 250, 243, 0) 100%
  );
}

.guide-copy {
  position: relative;
  z-index: 2;
  width: 61%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.guide-title {
  margin-top: 30rpx;
  color: #584033;
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.3;
}

.guide-desc {
  margin-top: 12rpx;
  color: #7c6759;
  font-size: 21rpx;
  line-height: 1.6;
  white-space: nowrap;
}

.guide-icon {
  width: 52rpx;
  height: 52rpx;
  margin-top: 22rpx;
  border: 1rpx solid rgba(157, 109, 62, .13);
  border-radius: 50%;
  background: #f4ddac;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95683f;
}

.wiki-heading {
  min-height: 70rpx;
  margin: 28rpx 0 18rpx;
  display: flex;
  align-items: center;
}

.wiki-heading > .section-title {
  flex: none;
  font-size: 38rpx;
  line-height: 1;
}

.breed-tabs {
  flex: none;
  margin-left: 14rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.breed-tab {
  min-width: 68rpx;
  min-height: 50rpx;
  padding: 0 15rpx;
  border-radius: 999rpx;
  color: #9b8a7d;
  background: #faf5ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  line-height: 1;
  transition: color .2s ease, background .2s ease, transform .2s ease;
}

.breed-tab.active {
  color: #855d3e;
  background: #f3d9ad;
  font-weight: 600;
  transform: translateY(-1rpx);
}

.all-breeds-link {
  flex: none;
  margin-left: auto;
  padding: 4rpx 0;
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  gap: 3rpx;
  font-size: 25rpx;
  line-height: 1;
}

.breed-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: stretch;
  gap: 22rpx 18rpx;
}

.breed-card {
  min-width: 0;
  overflow: hidden;
  padding: 12rpx;
  border: 0;
  border-radius: 40rpx;
  background: #fffdfa;
  box-shadow: 0 14rpx 36rpx rgba(101, 72, 48, .09);
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: transform .22s ease, box-shadow .22s ease;
}

.breed-card-hover,
.breed-card:hover {
  transform: translateY(-8rpx);
  box-shadow: 0 22rpx 44rpx rgba(101, 72, 48, .14);
}

.breed-art {
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 32rpx;
  background: linear-gradient(145deg, #fbefcf, #f7e5bd);
}

.breed-art image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.breed-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.breed-card-body {
  flex: 1;
  padding: 18rpx 10rpx 14rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.breed-name {
  display: block;
  color: var(--ink);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.35;
}

.breed-tags {
  margin-top: 11rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.breed-tags text {
  padding: 6rpx 11rpx;
  border-radius: 999rpx;
  color: #916d50;
  background: #f8ecd9;
  font-size: 18rpx;
  line-height: 1;
}

.breed-desc {
  width: 100%;
  min-height: 31rpx;
  margin-top: 13rpx;
  overflow: hidden;
  color: #aaa098;
  display: block;
  font-size: 20rpx;
  font-weight: 400;
  line-height: 1.55;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
