<template>
  <view class="page no-tab">
    <AppTopBar title="帮助与反馈" back />

    <view class="help-hero">
      <text class="section-kicker">需要帮助？</text>
      <text class="section-title">我们一起解决问题</text>
      <text>查看常见问题，或把使用过程中遇到的问题告诉我们。</text>
    </view>

    <view class="section">
      <text class="section-title">常见问题</text>
      <view class="faq-list">
        <button v-for="(faq, index) in faqs" :key="faq.q" class="faq card" @tap="openFaq = openFaq === index ? -1 : index">
          <view class="row-between"><text>{{ faq.q }}</text><AppIcon :name="openFaq === index ? 'minus' : 'plus'" size="24rpx" /></view>
          <text v-if="openFaq === index" class="answer">{{ faq.a }}</text>
        </button>
      </view>
    </view>

    <view class="card feedback">
      <text class="section-title">意见反馈</text>
      <textarea v-model="feedback" placeholder="请描述你的建议或遇到的问题" maxlength="300" />
      <button class="primary-button" @tap="submit">提交反馈</button>
    </view>
  </view>
</template>

<script>
import AppTopBar from '../../components/AppTopBar.vue'
export default {
  components: { AppTopBar },
  data() {
    return {
      openFaq: 0,
      feedback: '',
      faqs: [
        { q: '如何切换当前宠物？', a: '在首页顶部宠物区域左右滑动即可切换；在记录页也可以点击宠物名称选择。' },
        { q: '家庭成员可以看到哪些内容？', a: '账号可加入多个家庭组，并自动看到同步至这些家庭组的宠物档案、健康记录与任务安排；宠物创建者可以选择同步到全部或指定家庭组。' },
        { q: '百科信息能替代医生建议吗？', a: '不能。百科仅供日常养护参考，宠物出现持续异常时应及时联系专业宠物医生。' }
      ]
    }
  },
  methods: {
    submit() {
      if (!this.feedback.trim()) return uni.showToast({ title: '请先填写反馈内容', icon: 'none' })
      this.feedback = ''
      uni.showToast({ title: '感谢你的反馈', icon: 'success' })
    }
  }
}
</script>

<style scoped>
.help-hero { padding: 30rpx; border-radius: 32rpx; background: linear-gradient(135deg, #f6dba5, #f2c987); }
.help-hero .section-title { display: block; margin: 6rpx 0 10rpx; }
.help-hero > text:last-child { color: #7c6656; font-size: 22rpx; line-height: 1.6; }
.faq-list { margin-top: 16rpx; display: flex; flex-direction: column; gap: 12rpx; }
.faq { width: 100%; padding: 22rpx; text-align: left; }
.faq .row-between { font-weight: 600; }
.answer { display: block; margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid var(--line-soft); color: var(--muted); font-size: 22rpx; line-height: 1.7; }
.feedback { margin-top: 24rpx; padding: 24rpx; }
.feedback textarea { width: 100%; height: 190rpx; margin: 18rpx 0; padding: 18rpx; border-radius: 20rpx; background: var(--surface-strong); font-size: 28rpx; }
.feedback .primary-button { width: 100%; }
</style>
