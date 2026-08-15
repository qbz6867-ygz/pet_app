<template>
  <view class="page no-tab wiki-page">
    <AppTopBar title="宠物百科" eyebrow="PAW DAILY" center>
      <template #left>
        <button class="account-avatar" :aria-label="loggedIn ? '查看个人资料' : '登录或注册'" @tap="openAccount">
          <image v-if="loggedIn && session.avatar" :src="session.avatar" mode="aspectFill" />
          <text v-else-if="loggedIn">{{ session.avatarText || session.name.slice(0, 1) }}</text>
          <AppIcon v-else name="user" size="30rpx" />
        </button>
      </template>
    </AppTopBar>

    <button class="search-box" aria-label="搜索宠物品种" @tap="openSearch">
      <AppIcon name="search" size="28rpx" />
      <text>搜索宠物品种</text>
    </button>

    <button class="guide-banner" @tap="openGuide">
      <image class="guide-photo" src="/static/pet-avatar-corgi.png" mode="aspectFill" />
      <view class="guide-shade" />
      <view class="guide-copy">
        <text class="guide-title">新手养宠指南</text>
        <text class="guide-desc">养宠第一课，从这里开始</text>
        <view class="guide-icon"><AppIcon name="book" size="38rpx" /></view>
      </view>
    </button>

    <view class="filter-area">
      <view class="breed-controls">
        <view class="breed-tabs">
          <button
            v-for="tab in breedTabs"
            :key="tab"
            class="breed-tab"
            :class="{ active: breedFilter === tab }"
            @tap="breedFilter = tab"
          >
            <text>{{ tab }}</text>
            <view class="breed-tab-indicator" />
          </button>
        </view>
        <button class="filter-trigger" :class="{ active: filterOpen }" @tap="filterOpen = !filterOpen">
          <AppIcon name="filter" size="27rpx" />
          <text>筛选{{ activeFilterCount ? ` · ${activeFilterCount}` : '' }}</text>
          <AppIcon :name="filterOpen ? 'chevron-up' : 'chevron-down'" size="21rpx" />
        </button>
      </view>

      <view v-if="filterOpen" class="filter-panel">
        <view v-for="group in filterGroups" :key="group.key" class="filter-group">
          <text>{{ group.label }}</text>
          <view>
            <button
              v-for="option in group.options"
              :key="option"
              :class="{ active: filters[group.key] === option }"
              @tap="filters[group.key] = option"
            >{{ option === '全部' ? '不限' : option }}</button>
          </view>
        </view>
        <view class="filter-actions">
          <button class="reset-button" @tap="resetFilters">重置</button>
          <button class="apply-button" @tap="filterOpen = false">查看 {{ filteredBreeds.length }} 个品种</button>
        </view>
      </view>
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
    <view v-if="!filteredBreeds.length" class="empty">没有找到符合条件的品种</view>

  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
import { breeds } from '../../common/data.js'

export default {
  components: { AppTopBar },
  data() {
    return {
      session: {},
      breeds,
      breedFilter: '狗狗',
      breedTabs: ['狗狗', '猫咪'],
      filterOpen: false,
      filters: { bodySize: '全部', coat: '全部', activity: '全部', shedding: '全部' },
      filterGroups: [
        { key: 'bodySize', label: '体型', options: ['全部', '小型', '中型', '大型'] },
        { key: 'coat', label: '毛发长度', options: ['全部', '短毛', '中长毛', '长毛'] },
        { key: 'activity', label: '活动量', options: ['全部', '较低', '适中', '较高'] },
        { key: 'shedding', label: '掉毛程度', options: ['全部', '较少', '一般', '较多'] }
      ],
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
    loggedIn() {
      return Boolean(this.session && this.session.loggedIn)
    },
    activeFilterCount() {
      return Object.values(this.filters).filter(value => value !== '全部').length
    },
    filteredBreeds() {
      const typeMap = { 狗狗: '犬类', 猫咪: '猫类' }
      const selectedType = typeMap[this.breedFilter]
      return this.breeds.filter(item => {
        if (selectedType && item.type !== selectedType) return false
        if (this.filters.bodySize !== '全部' && item.bodySize !== this.filters.bodySize) return false
        if (this.filters.coat !== '全部' && item.coat !== this.filters.coat) return false
        if (this.filters.activity !== '全部' && item.activity !== this.filters.activity) return false
        if (this.filters.shedding !== '全部' && item.shedding !== this.filters.shedding) return false
        return true
      })
    }
  },
  onShow() {
    this.session = uni.getStorageSync('authSession') || {}
  },
  methods: {
    openAccount() {
      uni.navigateTo({ url: this.loggedIn ? '/pages/profile/info' : '/pages/auth/login' })
    },
    openSearch() { uni.navigateTo({ url: '/pages/wiki/search' }) },
    openGuide() { uni.navigateTo({ url: '/pages/wiki/guide' }) },
    resetFilters() {
      this.filters = { bodySize: '全部', coat: '全部', activity: '全部', shedding: '全部' }
    },
    openBreed(id) { uni.navigateTo({ url: `/pages/wiki/detail?id=${id}` }) },
    breedImpression(id) { return this.breedImpressions[id] || '独特伙伴，值得了解' }
  }
}
</script>

<style scoped>
.account-avatar {
  width: 58rpx;
  height: 58rpx;
  padding: 0;
  overflow: hidden;
  border: 2rpx solid #ead6bd;
  border-radius: 50%;
  color: #956941;
  background: #f8ead7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
}

.account-avatar image {
  width: 100%;
  height: 100%;
}

.search-box {
  min-height: 90rpx;
  padding: 0 28rpx;
  border: 1rpx solid #eadfd4;
  border-radius: 999rpx;
  background: #fffefc;
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: var(--muted);
  box-shadow: 0 10rpx 28rpx rgba(96, 68, 45, .035);
}

.search-box text {
  color: var(--muted);
  font-size: 28rpx;
}

.guide-banner {
  position: relative;
  width: 100%;
  min-height: 330rpx;
  margin-top: 28rpx;
  padding: 42rpx 36rpx;
  overflow: hidden;
  border: 1rpx solid #ead8c3;
  border-radius: 32rpx;
  background: #fff8ef;
  box-shadow: 0 14rpx 38rpx rgba(105, 77, 52, .07);
  text-align: left;
}

.guide-photo {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  width: 62%;
  height: 100%;
}

.guide-shade {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    90deg,
    #fff8ef 0%,
    #fff8ef 36%,
    rgba(255, 248, 239, .94) 46%,
    rgba(255, 248, 239, .42) 66%,
    rgba(255, 248, 239, 0) 100%
  );
}

.guide-copy {
  position: relative;
  z-index: 2;
  width: 58%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.guide-title {
  margin-top: 42rpx;
  color: #51382b;
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1.3;
}

.guide-desc {
  margin-top: 16rpx;
  color: #7c6759;
  font-size: 24rpx;
  line-height: 1.6;
  white-space: nowrap;
}

.guide-icon {
  width: 56rpx;
  height: 56rpx;
  margin-top: 30rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95683f;
}

.filter-area {
  position: relative;
  z-index: 20;
  margin: 36rpx 0 24rpx;
}

.breed-controls {
  min-height: 76rpx;
  border-bottom: 2rpx solid #eadfd6;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 24rpx;
}

.filter-trigger {
  min-width: 136rpx;
  height: 58rpx;
  margin-top: 2rpx;
  padding: 0 17rpx;
  border: 1rpx solid var(--line);
  border-radius: 22rpx;
  color: var(--brand-dark);
  background: #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9rpx;
  font-size: 22rpx;
}

.filter-trigger.active {
  border-color: #ead3b2;
  background: #fffbf5;
}

.filter-panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 12rpx);
  right: 0;
  left: 0;
  width: 100%;
  padding: 14rpx 20rpx 22rpx;
  border: 1rpx solid #eee6de;
  border-radius: 28rpx;
  background: #fffefb;
  box-shadow: 0 18rpx 46rpx rgba(91, 67, 48, .14);
  transform-origin: top center;
  animation: filter-expand .22s ease-out;
}

@keyframes filter-expand {
  from { opacity: 0; transform: translateY(-10rpx) scaleY(.98); }
  to { opacity: 1; transform: translateY(0) scaleY(1); }
}

.filter-group {
  min-height: 108rpx;
  padding: 16rpx 0;
  display: grid;
  grid-template-columns: 118rpx minmax(0, 1fr);
  align-items: center;
  gap: 12rpx;
}

.filter-group > text {
  color: #66544a;
  font-size: 24rpx;
  font-weight: 600;
}

.filter-group > view {
  min-height: 70rpx;
  padding: 6rpx;
  border-radius: 20rpx;
  background: #faf6f0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.filter-group button {
  min-width: 0;
  height: 58rpx;
  padding: 0 8rpx;
  border: 0;
  border-radius: 15rpx;
  color: #8e7f75;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  line-height: 1;
}

.filter-group button.active {
  color: #9a6846;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 5rpx 14rpx rgba(111, 82, 60, .09);
  font-weight: 600;
}

.filter-actions {
  margin-top: 18rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f1eae3;
  display: grid;
  grid-template-columns: 168rpx 1fr;
  gap: 16rpx;
}

.filter-actions button {
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.reset-button {
  border: 1rpx solid #e8ddd2;
  color: #79685d;
  background: #fffefc;
}

.apply-button {
  color: #6c4b34;
  background: linear-gradient(135deg, #f3dda9, #eac77f);
  font-weight: 600;
}

.breed-tabs {
  width: 240rpx;
  max-width: 100%;
  min-height: 74rpx;
  display: flex;
  align-items: stretch;
}

.breed-tab {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 72rpx;
  padding: 0 16rpx 18rpx;
  color: #a2958c;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  line-height: 1;
  transition: color .2s ease;
}

.breed-tab.active {
  color: #51382b;
  font-weight: 600;
}

.breed-tab-indicator {
  position: absolute;
  right: 18%;
  bottom: -2rpx;
  left: 18%;
  height: 2rpx;
  border-radius: 999rpx;
  background: transparent;
}

.breed-tab.active .breed-tab-indicator {
  height: 7rpx;
  background: #d48a57;
}

.breed-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: stretch;
  gap: 24rpx 20rpx;
}

.empty {
  padding: 100rpx 20rpx;
  color: var(--muted);
  font-size: 24rpx;
  text-align: center;
}

.breed-card {
  min-width: 0;
  overflow: hidden;
  padding: 10rpx;
  border: 1rpx solid rgba(107, 91, 82, .08);
  border-radius: 30rpx;
  background: #fffefc;
  box-shadow: 0 12rpx 30rpx rgba(101, 72, 48, .075);
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: transform .22s ease, box-shadow .22s ease;
}

.breed-card-hover,
.breed-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 18rpx 38rpx rgba(101, 72, 48, .12);
}

.breed-art {
  width: 100%;
  height: 0;
  padding-top: 75%;
  position: relative;
  overflow: hidden;
  border-radius: 22rpx;
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
  padding: 18rpx 12rpx 14rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.breed-name {
  display: block;
  color: var(--ink);
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.35;
}

.breed-tags {
  margin-top: 9rpx;
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
  margin-top: 11rpx;
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
