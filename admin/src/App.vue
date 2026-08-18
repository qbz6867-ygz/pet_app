<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdminIcon from './components/AdminIcon.vue'

const navItems = [
  { label: '工作台', icon: 'home' },
  { label: '用户数据', icon: 'users' },
  { label: '品种管理', icon: 'pet', children: ['宠物管理', '分类管理'] },
  { label: '评论管理', icon: 'message' },
  { label: '工单管理', icon: 'ticket' },
  { label: '系统日志', icon: 'log' },
  { label: '管理员', icon: 'user' }
]

const activeNav = ref('工作台')
const breedMenuOpen = ref(true)
const selectedFilterGroupName = ref('体型分类')
const selectedTagPetType = ref('犬类')
const draggedFilterTagIndex = ref(null)
const dragOverFilterTagIndex = ref(null)
const dragOverFilterTagAfter = ref(false)
let filterTagDragPreview = null
const chartMode = ref('访问量')
const searchText = ref('')
const breedKeyword = ref('')
const breedType = ref('全部类型')
const breedStatus = ref('全部状态')
const breedTagFilterOpen = ref(false)
const selectedBreedTags = ref([])
const breedPage = ref(1)
const reviewKeyword = ref('')
const reviewPage = ref(1)
const commentKeyword = ref('')
const commentPage = ref(1)
const feedbackKeyword = ref('')
const ticketTab = ref('全部工单')
const ticketType = ref('全部工单类型')
const ticketPriority = ref('全部优先级')
const ticketSource = ref('全部来源')
const ticketKeyword = ref('')
const ticketPage = ref(1)
const logTab = ref('异常日志')
const logLevel = ref('全部级别')
const logService = ref('全部服务')
const logKeyword = ref('')
const logPage = ref(1)
const performanceMode = ref('响应时间')
const logRetentionDays = ref('30 天')
const slowRequestThreshold = ref('1000 ms')
const logMinimumLevel = ref('信息及以上')
const logAlertEnabled = ref(true)
const logTaskEnabled = ref(true)
const logLoginEnabled = ref(true)
const breedCommentTab = ref('全部评论')
const breedCommentKeyword = ref('')
const breedCommentSort = ref('最新发布')
const breedCommentPage = ref(1)
const allBreedsOpen = ref(false)
const breedEntryKeyword = ref('')
const breedEntryType = ref('全部品种')
const activityPage = ref(1)
const adminLogPage = ref(1)
const reviewTab = ref('全部')
const commentTab = ref('全部评论')
const feedbackTab = ref('全部反馈')
const activityType = ref('全部行为')
const activityRange = ref('近 30 天')
const activityKeyword = ref('')
const userGrowthMode = ref('新增用户')
const userChannelRange = ref('近 30 日')
const userChannelRangeOpen = ref(false)
const userStatusFilter = ref('全部用户状态')
const userSourceFilter = ref('全部注册来源')
const userListKeyword = ref('')
const userCurrentPage = ref(1)
const userPageSize = 6
const listPageSize = 3
const commentPageSize = 5
const ticketPageSize = 5
const logPageSize = 5
const reviewPageSize = 5
const breedPageSize = 10
const userOverviewRange = ref('近 7 日')
const userOverviewRangeOpen = ref(false)
const accountMenuOpen = ref(false)
const notificationMenuOpen = ref(false)
const notificationsRead = ref(false)
const subPage = ref('')
const subPageData = ref({})
const toastMessage = ref('')
let toastTimer

const stats = [
  { label: '猫咪品种', value: '86', delta: '8%', compare: '较上周', icon: '', tone: 'up', nav: '宠物管理', breedType: '猫类' },
  { label: '狗狗品种', value: '128', delta: '6%', compare: '较上周', icon: '', tone: 'up', nav: '宠物管理', breedType: '犬类' },
  { label: '筛选分类', value: '27', delta: '4', compare: '个分组', icon: 'tag', tone: 'up', nav: '分类管理' },
  { label: '今日搜索', value: '3,286', delta: '12%', compare: '较昨日', icon: 'search', tone: 'up', nav: '用户数据' }
]

const pendingTasks = [
  { count: 5, text: '条用户反馈待处理', nav: '工单管理', icon: 'mail' },
  { count: 4, text: '条评论举报待处理', nav: '评论管理', icon: 'message' },
  { count: 9, text: '条工单等待分配', nav: '工单管理', icon: 'ticket' },
  { count: 3, text: '条异常日志待复核', nav: '系统日志', icon: 'alert' }
]

const notifications = [
  { title: '4 条评论举报需要处理', detail: '评论管理 · 18 分钟前', nav: '评论管理', icon: 'message' },
  { title: '5 条用户反馈等待回复', detail: '工单管理 · 42 分钟前', nav: '工单管理', icon: 'mail' },
  { title: '文件服务出现响应延迟', detail: '系统日志 · 1 小时前', nav: '系统日志', icon: 'alert' }
]

const userOverview = {
  total: '48,620',
  today: '1,286',
  yesterday: '1,143',
  change: 143,
  trend: [42, 55, 49, 63, 58, 72, 86]
}

const userOverviewSeries = computed(() => ({
  '近 7 日': { values: [42, 55, 49, 63, 58, 72, 86], labels: ['08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '今日'] },
  '近 30 日': { values: [36, 45, 52, 48, 61, 57, 69, 73, 79, 88], labels: ['07-13', '07-16', '07-19', '07-22', '07-25', '07-28', '07-31', '08-03', '08-06', '今日'] },
  '近 90 日': { values: [28, 35, 41, 46, 53, 61, 68, 77, 88], labels: ['05-14', '05-25', '06-05', '06-16', '06-27', '07-08', '07-19', '07-30', '今日'] }
}[userOverviewRange.value]))

const userChannelSeries = computed(() => ({
  '近 7 日': { total: '3,286', values: [42, 25, 20, 8, 5] },
  '近 30 日': { total: '12,680', values: [38, 27, 21, 9, 5] },
  '近 90 日': { total: '34,820', values: [35, 29, 22, 10, 4] }
}[userChannelRange.value]))

const userChannelItems = computed(() => [
  { name: '微信搜索', tone: 'orange', value: userChannelSeries.value.values[0] },
  { name: '好友分享', tone: 'green', value: userChannelSeries.value.values[1] },
  { name: '小程序推荐', tone: 'purple', value: userChannelSeries.value.values[2] },
  { name: '公众号', tone: 'blue', value: userChannelSeries.value.values[3] },
  { name: '其他', tone: 'gray', value: userChannelSeries.value.values[4] }
])

const userChannelRingStyle = computed(() => {
  const [search, share, recommend, account] = userChannelSeries.value.values
  const shareEnd = search + share
  const recommendEnd = shareEnd + recommend
  const accountEnd = recommendEnd + account
  return { background: `conic-gradient(#d07b36 0 ${search}%, #77a27a ${search}% ${shareEnd}%, #9979b1 ${shareEnd}% ${recommendEnd}%, #7292b2 ${recommendEnd}% ${accountEnd}%, #d2ccc7 ${accountEnd}% 100%)` }
})

function selectUserOverviewRange(range) {
  userOverviewRange.value = range
  userOverviewRangeOpen.value = false
}

function selectUserChannelRange(range) {
  userChannelRange.value = range
  userChannelRangeOpen.value = false
}

const breeds = [
  { name: '威尔士柯基犬', type: '犬类', size: '小型犬', bodySize: '小型', exercise: '中高', shedding: '较多', appetite: '中等', odor: '较轻', age: '12–15 年', summary: '短腿大耳、活泼亲人，运动充沛，需控制体重并保护腰背。', trait: '活泼、亲人', intro: '短腿、大耳朵和灿烂笑容是它的标志。性格开朗，喜欢参与家庭活动，也很愿意和人互动。', care: '每天安排 45–60 分钟散步，控制体重并减少频繁上下楼，换毛期需要增加梳毛频率。', tags: ['小型犬', '短毛', '新手友好'], createdAt: '2026-07-20 10:18', updatedAt: '2026-08-11 14:30', image: '/breeds/welsh-corgi.jpg', status: '已发布' },
  { name: '英国短毛猫', type: '猫类', size: '中型猫', bodySize: '中型', exercise: '中低', shedding: '一般', appetite: '较好', odor: '很轻', age: '14–18 年', summary: '圆脸厚毛、安静稳重，适应独处，日常需注意活动和体重。', trait: '温和、安静', intro: '圆脸、厚实被毛和沉稳气质很有辨识度，适应力强，独处时安静，也乐于陪伴家人。', care: '每周梳毛 2–3 次，准备益智玩具鼓励活动，并关注饮食热量与体重变化。', tags: ['中型猫', '短毛', '适合小户型'], createdAt: '2026-07-22 09:40', updatedAt: '2026-08-11 11:20', image: '/breeds/british-shorthair.jpg', status: '已发布' },
  { name: '布偶猫', type: '猫类', size: '大型猫', bodySize: '大型', exercise: '中低', shedding: '较多', appetite: '中等', odor: '很轻', age: '13–16 年', summary: '蓝眼长毛、温顺粘人，喜欢安静陪伴，柔软被毛需规律梳理。', trait: '温顺、粘人', intro: '拥有蓝色眼睛和柔软长毛，性格温柔且依恋家人，喜欢在熟悉的人身边安静陪伴。', care: '每周梳毛 3–4 次以减少打结，设置低强度互动游戏，并注意饮水量与口腔护理。', tags: ['大型猫', '长毛', '护理较多'], createdAt: '2026-07-25 16:05', updatedAt: '2026-08-10 16:45', image: '/breeds/ragdoll.jpg', status: '已发布' },
  { name: '金毛寻回犬', type: '犬类', size: '大型犬', bodySize: '大型', exercise: '高', shedding: '较多', appetite: '较大', odor: '中等', age: '10–12 年', summary: '金色长毛、聪明友善，对孩子有耐心，是可靠的家庭伙伴。', trait: '友善、聪明', intro: '性格温和、学习能力强，对儿童和其他宠物通常十分友善，是热情可靠的家庭伙伴。', care: '每天保证 60–90 分钟运动，定期清洁耳道并梳理长毛，训练时适合使用正向奖励。', tags: ['大型犬', '长毛', '亲近儿童', '运动需求高'], createdAt: '2026-07-28 14:22', updatedAt: '2026-08-10 10:05', image: '/breeds/golden-retriever.jpg', status: '已发布' },
  { name: '暹罗猫', type: '猫类', size: '中型猫', bodySize: '中型', exercise: '中高', shedding: '较少', appetite: '中等', odor: '很轻', age: '12–16 年', summary: '蓝眼重点色、聪明好奇，爱用叫声交流，也十分依赖陪伴。', trait: '亲人、爱交流', intro: '身形修长、重点色明显，喜欢用声音表达需求。它重视陪伴，也热衷探索与互动。', care: '每天安排逗猫和攀爬活动，避免长时间独处，并定期检查牙齿与保持稳定作息。', tags: ['中型猫', '短毛', '运动需求高'], createdAt: '2026-08-01 11:08', updatedAt: '2026-08-09 17:12', image: '/breeds/siamese.jpg', status: '草稿' },
  { name: '柴犬', type: '犬类', size: '中小型犬', bodySize: '中型', exercise: '中高', shedding: '较多', appetite: '中等', odor: '较轻', age: '12–15 年', summary: '竖耳卷尾、爱干净有主见，对家人忠诚，需要耐心训练。', trait: '独立、忠诚', intro: '警觉、利落又很有主见，对家人忠诚。早期社会化能帮助它更从容地面对陌生环境。', care: '保持规律运动和边界清晰的训练，换毛季每天梳毛，并使用牵引绳保障户外安全。', tags: ['中小型犬', '短毛', '需要经验'], createdAt: '2026-08-03 15:46', updatedAt: '2026-08-09 09:36', image: '/breeds/shiba-inu.jpg', status: '草稿' }
]

const breedTagGroupsByType = ref({
  犬类: [
    { name: '体型分类', options: ['小型犬', '中小型犬', '中型犬', '大型犬'] },
    { name: '毛发类型', options: ['短毛', '中长毛', '长毛', '低掉毛'] },
    { name: '饲养难度', options: ['新手友好', '需要经验', '护理较多'] },
    { name: '适居场景', options: ['适合小户型', '亲近儿童', '运动需求高'] }
  ],
  猫类: [
    { name: '体型分类', options: ['小型猫', '中型猫', '大型猫'] },
    { name: '毛发类型', options: ['短毛', '中长毛', '长毛', '低掉毛'] },
    { name: '饲养难度', options: ['新手友好', '需要经验', '护理较多'] },
    { name: '适居场景', options: ['适合小户型', '亲近儿童', '运动需求高'] }
  ]
})

const breedTypeOptions = computed(() => Object.keys(breedTagGroupsByType.value))
const categoryManagementRows = computed(() => breedTypeOptions.value.map(name => ({
  name,
  groups: breedTagGroupsByType.value[name] || [],
  breedCount: breeds.filter(breed => breed.type === name).length
})))
const breedTagGroups = computed(() => breedTagGroupsByType.value[selectedTagPetType.value] || [])
const editorBreedTagGroups = computed(() => breedTagGroupsByType.value[subPageData.value.type] || breedTagGroups.value)
const breedFilterTags = computed(() => [...new Set(Object.values(breedTagGroupsByType.value).flatMap(groups => groups.flatMap(group => group.options)))])
const tagManagementRows = computed(() => breedTagGroups.value.flatMap((group, groupIndex) =>
  group.options.map((name, tagIndex) => ({
    name,
    group: group.name,
    groupIndex,
    tagIndex,
    breeds: breeds.filter(breed => breed.type === selectedTagPetType.value && breed.tags.includes(name)).length
  }))
))
const tagUsageCounts = computed(() => Object.fromEntries(
  breedTagGroups.value.flatMap(group => group.options).map(tag => [tag, breeds.filter(breed => breed.type === selectedTagPetType.value && breed.tags.includes(tag)).length])
))
const selectedFilterGroup = computed(() =>
  breedTagGroups.value.find(group => group.name === selectedFilterGroupName.value) || breedTagGroups.value[0]
)
const selectedFilterGroupIndex = computed(() =>
  breedTagGroups.value.findIndex(group => group.name === selectedFilterGroup.value?.name)
)
const dogDetailSizeOptions = ['小型犬', '中小型犬', '中型犬', '大型犬']
const catDetailSizeOptions = ['小型猫', '中型猫', '大型猫']
const breedDetailSizeOptions = computed(() => {
  const categoryGroups = breedTagGroupsByType.value[subPageData.value.type] || []
  const sizeGroup = categoryGroups.find(group => group.name === '体型分类')
  if (sizeGroup?.options?.length) return sizeGroup.options
  if (subPageData.value.type === '犬类') return dogDetailSizeOptions
  if (subPageData.value.type === '猫类') return catDetailSizeOptions
  return []
})
const breedOrigins = {
  威尔士柯基犬: '英国威尔士',
  英国短毛猫: '英国',
  布偶猫: '美国',
  金毛寻回犬: '英国苏格兰',
  暹罗猫: '泰国',
  柴犬: '日本'
}

const popularPets = [
  { name: '布偶猫', type: '猫类', image: '/breeds/ragdoll.jpg', views: '12,680' },
  { name: '金毛寻回犬', type: '犬类', image: '/breeds/golden-retriever.jpg', views: '10,256' },
  { name: '英国短毛猫', type: '猫类', image: '/breeds/british-shorthair.jpg', views: '8,942' },
  { name: '威尔士柯基犬', type: '犬类', image: '/breeds/welsh-corgi.jpg', views: '7,618' },
  { name: '暹罗猫', type: '猫类', image: '/breeds/siamese.jpg', views: '6,845' },
  { name: '边境牧羊犬', type: '犬类', image: '/breeds/border-collie.jpg', views: '6,326' }
]

const reviews = [
  { title: '边境牧羊犬百科资料补充', type: '资料更新', icon: 'document', author: '编辑-小周', target: '边境牧羊犬', time: '今天 15:42', status: '待审核', priority: '高' },
  { title: '挪威森林猫性格描述修正', type: '纠错修改', icon: 'alert', author: '用户 186****4208', target: '挪威森林猫', time: '今天 14:18', status: '待审核', priority: '普通' },
  { title: '新增犬种：澳大利亚牧羊犬', type: '新增品种', icon: 'plus', author: '编辑-阿哲', target: '澳大利亚牧羊犬', time: '今天 11:03', status: '审核中', priority: '高' },
  { title: '布偶猫饲养难度标签调整', type: '标签调整', icon: 'document', author: '编辑-小周', target: '布偶猫', time: '昨天 18:36', status: '已通过', priority: '普通' },
  { title: '法国斗牛犬健康说明修改', type: '资料更新', icon: 'document', author: '编辑-林晓', target: '法国斗牛犬', time: '昨天 16:25', status: '已驳回', priority: '普通' }
]

const pendingReviewCount = computed(() => reviews.filter(review => review.status === '待审核').length)
const highPriorityPendingReviewCount = computed(() => reviews.filter(review => review.status === '待审核' && review.priority === '高').length)

const commentAttentionCount = computed(() => 7 + 4)
const ticketAttentionCount = computed(() => ticketStatusCount('待处理') + ticketStatusCount('处理中'))

const comments = [
  { content: '介绍得很详细，尤其是性格和护理部分，对新手很有帮助。', user: '星星的铲屎官', target: '布偶猫', likes: 36, time: '2026-08-11 15:26', status: '正常' },
  { content: '我家的英短也是这种性格，适应新环境很快。', user: '橘子汽水', target: '英国短毛猫', likes: 18, time: '2026-08-11 13:08', status: '正常' },
  { content: '这段寿命数据可能不准确，建议重新核对来源。', user: '宠物医生 Leo', target: '金毛寻回犬', likes: 12, time: '2026-08-11 10:42', status: '待复核' },
  { content: '包含无关推广信息，请管理员处理。', user: '匿名用户', target: '柴犬', likes: 0, time: '2026-08-10 21:17', status: '被举报' },
  { content: '希望增加不同年龄段的喂养建议。', user: '旺仔小馒头', target: '威尔士柯基犬', likes: 9, time: '2026-08-10 17:32', status: '正常' }
]

const breedCommentEntries = [
  { name: '布偶猫', type: '猫类', image: '/breeds/ragdoll.jpg', count: 326, pending: 2 },
  { name: '英国短毛猫', type: '猫类', image: '/breeds/british-shorthair.jpg', count: 284, pending: 1 },
  { name: '金毛寻回犬', type: '犬类', image: '/breeds/golden-retriever.jpg', count: 251, pending: 3 },
  { name: '柴犬', type: '犬类', image: '/breeds/shiba-inu.jpg', count: 218, pending: 1 },
  { name: '威尔士柯基犬', type: '犬类', image: '/breeds/welsh-corgi.jpg', count: 196, pending: 0 },
  { name: '暹罗猫', type: '猫类', image: '/breeds/siamese.jpg', count: 185, pending: 2 },
  { name: '缅因猫', type: '猫类', image: '/breeds/maine-coon.jpg', count: 173, pending: 0 },
  { name: '波斯猫', type: '猫类', image: '/breeds/persian.jpg', count: 168, pending: 1 },
  { name: '美国短毛猫', type: '猫类', image: '/breeds/american-shorthair.jpg', count: 156, pending: 0 },
  { name: '边境牧羊犬', type: '犬类', image: '/breeds/border-collie.jpg', count: 149, pending: 2 },
  { name: '拉布拉多犬', type: '犬类', image: '/breeds/labrador.jpg', count: 137, pending: 0 },
  { name: '贵宾犬', type: '犬类', image: '/breeds/poodle.jpg', count: 128, pending: 1 },
  { name: '萨摩耶犬', type: '犬类', image: '/breeds/samoyed.jpg', count: 116, pending: 0 },
  { name: '法国斗牛犬', type: '犬类', image: '/breeds/french-bulldog.jpg', count: 102, pending: 1 },
  { name: '孟加拉猫', type: '猫类', image: '/breeds/bengal.jpg', count: 96, pending: 0 },
  { name: '斯芬克斯猫', type: '猫类', image: '/breeds/sphynx.jpg', count: 84, pending: 0 }
]

const filteredBreedCommentEntries = computed(() => breedCommentEntries.filter(breed => {
  const matchType = breedEntryType.value === '全部品种' || breed.type === breedEntryType.value
  const keyword = breedEntryKeyword.value.trim()
  return matchType && (!keyword || breed.name.includes(keyword))
}))

const breedCommentSamples = [
  { content: '百科介绍非常全面，性格特点与我家的情况基本一致。', user: '小鱼干收藏家', likes: 42, time: '2026-08-11 15:26', status: '正常' },
  { content: '护理部分很实用，希望后续再增加幼年期的喂养建议。', user: '一颗栗子', likes: 27, time: '2026-08-11 13:48', status: '正常' },
  { content: '我家养了三年，确实比较亲人，但需要定期梳理毛发。', user: '毛球日记', likes: 19, time: '2026-08-11 11:05', status: '正常' },
  { content: '寿命数据是否可以标注一下参考来源？', user: '养宠新手 77', likes: 8, time: '2026-08-10 22:16', status: '待复核' },
  { content: '评论包含重复推广内容，已被其他用户举报。', user: '匿名用户', likes: 0, time: '2026-08-10 18:32', status: '被举报' },
  { content: '图片很清楚，外观特征一眼就能看懂。', user: '今天也想撸猫', likes: 15, time: '2026-08-10 16:09', status: '正常' }
]

const users = [
  { name: '星星的铲屎官', id: 'U20260811082', source: '微信搜索', favorites: 18, comments: 12, registered: '2026-05-18', active: '3 分钟前', status: '活跃', avatar: '星' },
  { name: '橘子汽水', id: 'U20260810031', source: '好友分享', favorites: 26, comments: 8, registered: '2026-04-02', active: '26 分钟前', status: '活跃', avatar: '橘' },
  { name: '宠物医生 Leo', id: 'U20260809017', source: '公众号', favorites: 32, comments: 21, registered: '2026-01-16', active: '今天 11:42', status: '活跃', avatar: 'L' },
  { name: '旺仔小馒头', id: 'U20260808066', source: '微信搜索', favorites: 9, comments: 5, registered: '2026-07-21', active: '昨天 20:18', status: '普通', avatar: '旺' },
  { name: '一颗栗子', id: 'U20260807042', source: '小程序推荐', favorites: 14, comments: 3, registered: '2026-06-09', active: '3 天前', status: '普通', avatar: '栗' },
  { name: '匿名用户 0926', id: 'U20260806029', source: '好友分享', favorites: 2, comments: 0, registered: '2026-08-06', active: '5 天前', status: '沉默', avatar: '匿' },
  { name: '毛球观察员', id: 'U20260805018', source: '微信搜索', favorites: 11, comments: 4, registered: '2026-05-26', active: '6 天前', status: '普通', avatar: '毛' },
  { name: '柚子和猫', id: 'U20260804077', source: '小程序推荐', favorites: 21, comments: 9, registered: '2026-03-11', active: '8 分钟前', status: '活跃', avatar: '柚' },
  { name: '养犬笔记', id: 'U20260803054', source: '公众号', favorites: 16, comments: 6, registered: '2026-02-08', active: '今天 09:16', status: '活跃', avatar: '犬' },
  { name: '奶糖不加糖', id: 'U20260802039', source: '好友分享', favorites: 7, comments: 2, registered: '2026-07-03', active: '2 天前', status: '普通', avatar: '糖' },
  { name: '猫咪研究所', id: 'U20260801026', source: '微信搜索', favorites: 38, comments: 17, registered: '2025-12-19', active: '1 小时前', status: '活跃', avatar: '猫' },
  { name: '周末遛狗队', id: 'U20260731081', source: '小程序推荐', favorites: 13, comments: 5, registered: '2026-04-28', active: '昨天 18:35', status: '普通', avatar: '周' },
  { name: '团子的主人', id: 'U20260730063', source: '好友分享', favorites: 19, comments: 7, registered: '2026-01-22', active: '12 分钟前', status: '活跃', avatar: '团' },
  { name: '新手铲屎官', id: 'U20260729042', source: '公众号', favorites: 5, comments: 1, registered: '2026-07-29', active: '7 天前', status: '沉默', avatar: '新' },
  { name: '小狗能量站', id: 'U20260728035', source: '微信搜索', favorites: 24, comments: 11, registered: '2026-03-18', active: '今天 13:05', status: '活跃', avatar: '狗' },
  { name: '布丁日记', id: 'U20260727019', source: '小程序推荐', favorites: 10, comments: 3, registered: '2026-06-15', active: '4 天前', status: '普通', avatar: '布' },
  { name: '阿福一家', id: 'U20260726008', source: '好友分享', favorites: 15, comments: 6, registered: '2026-02-27', active: '昨天 22:40', status: '普通', avatar: '福' },
  { name: '匿名用户 3185', id: 'U20260725095', source: '微信搜索', favorites: 1, comments: 0, registered: '2026-07-25', active: '12 天前', status: '沉默', avatar: '匿' }
]

const userGrowthData = computed(() => userGrowthMode.value === '新增用户'
  ? { values: [58,72,66,81,76,89,96,85,102,110,104,118,126,137], total: '12,680', secondary: '自然增长占比 76%', average: '日均新增 906 人' }
  : { values: [72,78,75,86,82,91,88,96,102,98,108,115,121,132], total: '86,900', secondary: '平均活跃率 17.9%', average: '日均活跃 6,207 人' })

const userGrowthChartCoordinates = computed(() => {
  const values = userGrowthData.value.values
  return values.map((value, index) => ({
    x: 10 + index * (680 / (values.length - 1)),
    y: 150 - (value / 150) * 138
  }))
})
const userGrowthChartPoints = computed(() => userGrowthChartCoordinates.value.map(point => `${point.x},${point.y}`).join(' '))
const userGrowthAreaPoints = computed(() => `10,150 ${userGrowthChartPoints.value} 690,150`)

const filteredUsers = computed(() => users.filter(user => {
  const matchesStatus = userStatusFilter.value === '全部用户状态' || user.status === userStatusFilter.value
  const matchesSource = userSourceFilter.value === '全部注册来源' || user.source === userSourceFilter.value
  const keyword = userListKeyword.value.trim().toLowerCase()
  const matchesKeyword = !keyword || `${user.name}${user.id}`.toLowerCase().includes(keyword)
  return matchesStatus && matchesSource && matchesKeyword
}))

const userTotalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / userPageSize)))
const paginatedUsers = computed(() => {
  const start = (userCurrentPage.value - 1) * userPageSize
  return filteredUsers.value.slice(start, start + userPageSize)
})

watch([userStatusFilter, userSourceFilter, userListKeyword], () => {
  userCurrentPage.value = 1
})

function changeUserPage(page) {
  userCurrentPage.value = Math.min(Math.max(page, 1), userTotalPages.value)
}

const userActivities = [
  { type: '搜索', icon: 'search', title: '搜索了“适合小户型的猫”', detail: '查看 24 条搜索结果，停留 2 分 18 秒', target: '搜索结果页', time: '今天 15:26', source: '微信小程序', ip: '浙江杭州' },
  { type: '浏览', icon: 'document', title: '浏览了布偶猫百科详情', detail: '阅读「性格特点」与「日常护理」，完成度 86%', target: '布偶猫', time: '今天 15:22', source: '微信小程序', ip: '浙江杭州' },
  { type: '收藏', icon: 'heart', title: '收藏了英国短毛猫', detail: '从品种详情页加入收藏', target: '英国短毛猫', time: '昨天 20:18', source: '微信小程序', ip: '浙江杭州' },
  { type: '评论', icon: 'message', title: '在金毛寻回犬下发表评论', detail: '“介绍得很详细，对新手很有帮助。”', target: '金毛寻回犬', time: '08-09 18:42', source: '微信小程序', ip: '浙江杭州' },
  { type: '浏览', icon: 'document', title: '浏览了威尔士柯基犬百科详情', detail: '阅读「常见疾病」与「喂养建议」，停留 4 分 06 秒', target: '威尔士柯基犬', time: '08-09 18:31', source: '微信小程序', ip: '浙江杭州' },
  { type: '筛选', icon: 'filter', title: '使用条件筛选宠物品种', detail: '猫类 · 低掉毛 · 温顺亲人 · 适合小户型', target: '品种列表', time: '08-08 21:07', source: '微信小程序', ip: '浙江杭州' },
  { type: '分享', icon: 'share', title: '分享了布偶猫百科详情', detail: '通过微信好友完成分享', target: '布偶猫', time: '08-06 22:36', source: '微信小程序', ip: '浙江杭州' },
  { type: '搜索', icon: 'search', title: '搜索了“新手养猫注意事项”', detail: '查看 18 条搜索结果，点击 3 条内容', target: '搜索结果页', time: '08-05 12:48', source: '微信小程序', ip: '浙江杭州' }
]

const userCommentHistory = [
  { content: '介绍得很详细，尤其是性格和护理部分，对新手很有帮助。', target: '布偶猫', likes: 36, replies: 4, time: '2026-08-11 15:26', status: '正常' },
  { content: '我家猫咪也很喜欢跟人待在一起，晚上会主动跑来一起睡。', target: '英国短毛猫', likes: 18, replies: 2, time: '2026-08-08 21:36', status: '正常' },
  { content: '这部分的掉毛程度描述很准确，换毛季确实需要每天梳理。', target: '威尔士柯基犬', likes: 12, replies: 1, time: '2026-08-03 10:42', status: '正常' },
  { content: '想问一下幼犬阶段每天建议安排多久的户外活动？', target: '金毛寻回犬', likes: 7, replies: 3, time: '2026-07-28 18:15', status: '正常' }
]

const feedbacks = [
  { id: 'FB20260811021', type: '内容纠错', content: '暹罗猫的原产地信息与资料来源不一致，希望核实。', user: '用户 172****9031', time: '今天 14:36', status: '待处理', owner: '未分配' },
  { id: 'FB20260811018', type: '功能建议', content: '希望增加品种对比功能，可以同时比较两种宠物。', user: '用户 185****1260', time: '今天 12:05', status: '处理中', owner: '林晓' },
  { id: 'FB20260810087', type: '图片问题', content: '英国短毛猫第二张图片加载后清晰度比较低。', user: '用户 139****6612', time: '昨天 19:42', status: '处理中', owner: '小周' },
  { id: 'FB20260810066', type: '使用问题', content: '筛选条件清空后列表没有自动回到顶部。', user: '用户 158****2027', time: '昨天 15:20', status: '已解决', owner: '阿哲' },
  { id: 'FB20260809032', type: '内容建议', content: '建议补充适合小户型饲养的犬种说明。', user: '用户 186****7784', time: '08-09 11:15', status: '已关闭', owner: '林晓' }
]

const admins = [
  { name: '陈一舟', account: 'admin_cyz', lastLogin: '今天 15:48', status: '正常', avatar: '陈' }
]

const workOrders = [
  { id: 'WO-20260812-026', title: '布偶猫封面图片无法正常显示', type: '系统异常', priority: '高', source: '用户反馈', owner: '技术-陈一舟', created: '今天 10:26', status: '处理中' },
  { id: 'WO-20260812-025', title: '柯基犬平均寿命数据需要复核', type: '内容纠错', priority: '中', source: '内容审核', owner: '编辑-周雨桐', created: '今天 09:48', status: '待处理' },
  { id: 'WO-20260811-087', title: '百科评论中出现重复推广内容', type: '评论举报', priority: '中', source: '评论管理', owner: '审核-何嘉宁', created: '昨天 20:16', status: '处理中' },
  { id: 'WO-20260811-066', title: '批量导入品种时部分标签匹配失败', type: '数据问题', priority: '高', source: '系统告警', owner: '技术-陈一舟', created: '昨天 16:35', status: '待处理' },
  { id: 'WO-20260810-042', title: '增加适合小户型品种的筛选说明', type: '内容需求', priority: '普通', source: '用户反馈', owner: '编辑-周雨桐', created: '08-10 14:22', status: '已解决' },
  { id: 'WO-20260809-018', title: '评论筛选条件重置后列表未刷新', type: '功能问题', priority: '普通', source: '内部创建', owner: '当前管理员', created: '08-09 11:08', status: '已关闭' },
  { id: 'FB-20260811-021', title: '暹罗猫的原产地信息与资料来源不一致，希望核实', type: '内容纠错', priority: '中', source: '用户反馈', owner: '当前管理员', created: '今天 14:36', status: '待处理', user: '用户 172****9031' },
  { id: 'FB-20260811-018', title: '希望增加品种对比功能，可以同时比较两种宠物', type: '功能建议', priority: '普通', source: '用户反馈', owner: '当前管理员', created: '今天 12:05', status: '处理中', user: '用户 185****1260' },
  { id: 'FB-20260810-087', title: '英国短毛猫第二张图片加载后清晰度较低', type: '图片问题', priority: '中', source: '用户反馈', owner: '当前管理员', created: '昨天 19:42', status: '处理中', user: '用户 139****6612' },
  { id: 'FB-20260810-066', title: '筛选条件清空后列表没有自动回到顶部', type: '使用问题', priority: '普通', source: '用户反馈', owner: '当前管理员', created: '昨天 15:20', status: '已解决', user: '用户 158****2027' },
  { id: 'FB-20260809-032', title: '建议补充适合小户型饲养的犬种说明', type: '内容建议', priority: '普通', source: '用户反馈', owner: '当前管理员', created: '08-09 11:15', status: '已关闭', user: '用户 186****7784' }
]

const systemLogs = [
  { time: '10:32:16', level: '错误', service: '百科内容服务', event: '品种封面图片处理失败', detail: '图片存储服务返回 503', trace: 'TR-8FA29C', status: '待处理' },
  { time: '10:28:03', level: '警告', service: '用户服务', event: '用户列表接口响应时间较长', detail: 'P95 响应时间达到 1.8s', trace: 'TR-7BC128', status: '已恢复' },
  { time: '10:21:37', level: '警告', service: '数据库', event: '数据库连接池使用率偏高', detail: '连接池使用率达到 82%', trace: 'TR-6DE245', status: '待处理' },
  { time: '10:15:42', level: '信息', service: '内容服务', event: '品种数据批量导入完成', detail: '成功 26 条，跳过 2 条', trace: 'TR-5AD911', status: '正常' },
  { time: '09:58:20', level: '警告', service: '评论服务', event: '敏感词服务发生重试', detail: '第 2 次调用成功', trace: 'TR-3CD620', status: '已恢复' },
  { time: '09:30:00', level: '信息', service: '定时任务', event: '每日用户统计任务执行完成', detail: '处理用户 48,620 位', trace: 'JOB-1028', status: '正常' },
  { time: '08:42:13', level: '错误', service: '文件服务', event: '导出反馈文件生成失败', detail: '临时存储空间不足', trace: 'TR-1EF407', status: '已处理' }
]

const logAttentionCount = computed(() => systemLogs.filter(log => log.status === '待处理').length)

function navAttentionCount(label) {
  return {
    评论管理: commentAttentionCount.value,
    工单管理: ticketAttentionCount.value,
    系统日志: logAttentionCount.value
  }[label] || 0
}

const currentDescription = computed(() => ({
  工作台: '数据概览', 宠物管理: '管理宠物品种资料', 分类管理: '维护宠物分类及各分类的筛选项', 评论管理: '维护百科评论区内容', 用户数据: '分析用户增长与百科使用行为', 用户反馈: '跟进用户问题与建议', 工单管理: '分配并跟进平台问题', 系统日志: '查看运行状态与异常记录', 管理员: '当前管理员账号设置'
}[activeNav.value]))

const subPageMeta = computed(() => ({
  'breed-create': ['新增品种', '创建新的宠物百科档案'],
  'breed-edit': ['编辑品种', `维护${subPageData.value.name || '品种'}的百科资料`],
  'breed-view': ['品种详情', `查看${subPageData.value.name || '品种'}的完整资料`],
  'breed-import': ['导入品种', '通过模板批量导入品种资料'],
  'tag-create': ['新增筛选项', '创建用于宠物列表筛选的选项'],
  'category-create': ['新建分类', '添加新的宠物分类'],
  'category-edit': ['分类详情', `维护“${subPageData.value.name || '分类'}”的分类名称与分类标签`],
  'group-create': ['新建筛选分组', '设置筛选项的分类与展示顺序'],
  'group-edit': ['编辑筛选分组', `维护“${subPageData.value.name || '筛选分组'}”的设置`],
  'tag-edit': ['编辑筛选项', `维护“${subPageData.value.name || '筛选项'}”的配置`],
  'tag-relate': ['配置品种', `管理“${subPageData.value.name || '筛选项'}”适用的品种`],
  'review-detail': ['审核详情', subPageData.value.title || '查看内容变更并完成审核'],
  'review-rules': ['审核规则', '配置百科内容审核标准与处理流程'],
  'comment-detail': ['评论详情', '查看评论上下文与用户信息'],
  'comment-handle': ['处理评论', '复核举报内容并选择处理结果'],
  'comment-rules': ['评论规则', '配置敏感内容识别与评论处理规则'],
  'breed-comments': [`${subPageData.value.name || subPageData.value.target || '品种'}评论`, '查看该品种下的全部用户评论'],
  'feedback-detail': ['反馈详情', subPageData.value.id || '查看并跟进用户反馈'],
  'feedback-export': ['导出反馈', '选择反馈范围与导出字段'],
  'user-detail': ['用户详情', `查看${subPageData.value.name || '用户'}的资料与使用行为`],
  'user-activity': ['用户行为记录', `查看${subPageData.value.name || '用户'}的完整访问与互动轨迹`],
  'admin-edit': ['账号设置', '修改当前管理员的账号资料'],
  'admin-log': ['操作日志', `查看${subPageData.value.name || '管理员'}的后台操作记录`],
  'ticket-settings': ['工单设置', '配置工单默认规则与处理提醒'],
  'ticket-create': ['创建工单', '录入需要跟进的问题或任务'],
  'ticket-view': ['工单详情', subPageData.value.id || '查看工单信息与处理记录'],
  'ticket-handle': ['处理工单', subPageData.value.id || '更新工单状态并填写处理结果'],
  'ticket-more': ['更多操作', subPageData.value.id || '管理当前工单的其他操作'],
  'log-settings': ['日志设置', '配置日志记录、保留期限与异常告警规则']
}[subPage.value] || ['详情页面', '查看与维护详细信息']))

const subPageGroup = computed(() => {
  if (subPage.value === 'breed-comments') return 'comment'
  if (subPage.value.startsWith('breed-')) return 'breed'
  if (subPage.value.startsWith('tag-') || ['category-create', 'category-edit', 'group-create', 'group-edit'].includes(subPage.value)) return 'tag'
  if (subPage.value.startsWith('review-')) return 'review'
  if (subPage.value.startsWith('comment-')) return 'comment'
  if (subPage.value.startsWith('feedback-')) return 'feedback'
  if (subPage.value.startsWith('user-')) return 'user'
  if (subPage.value.startsWith('ticket-')) return 'ticket'
  if (subPage.value.startsWith('log-')) return 'log'
  if (subPage.value.startsWith('admin-') || subPage.value === 'role-manage') return 'admin'
  return ''
})
const isGroupSubPage = computed(() => ['group-create', 'group-edit'].includes(subPage.value))
const isCategorySubPage = computed(() => ['category-create', 'category-edit'].includes(subPage.value))

const filteredBreeds = computed(() => breeds.filter(item => {
  const matchType = breedType.value === '全部类型' || item.type === breedType.value
  const matchStatus = breedStatus.value === '全部状态' || item.status === breedStatus.value
  const matchKeyword = !breedKeyword.value || item.name.includes(breedKeyword.value)
  const matchTags = selectedBreedTags.value.length === 0 || selectedBreedTags.value.every(tag => item.tags.includes(tag))
  return matchType && matchStatus && matchKeyword && matchTags
}))

function pageCount(items) {
  return Math.max(1, Math.ceil(items.length / listPageSize))
}

function pageSlice(items, page) {
  const start = (page - 1) * listPageSize
  return items.slice(start, start + listPageSize)
}

function setListPage(pageRef, page, total) {
  pageRef.value = Math.min(Math.max(page, 1), total)
}

function ticketStatusCount(status) {
  return ({ 待处理: 18, 处理中: 20, 已解决: 104, 已关闭: 26 })[status] || 0
}

const breedTotalPages = computed(() => Math.max(1, Math.ceil(filteredBreeds.value.length / breedPageSize)))
const paginatedBreeds = computed(() => {
  const start = (breedPage.value - 1) * breedPageSize
  return filteredBreeds.value.slice(start, start + breedPageSize)
})

const filteredReviews = computed(() => reviews.filter(review => {
  const matchTab = reviewTab.value === '全部' || review.status === reviewTab.value
  const keyword = reviewKeyword.value.trim()
  return matchTab && (!keyword || `${review.title}${review.target}${review.author}`.includes(keyword))
}))
const reviewTotalPages = computed(() => Math.max(1, Math.ceil(filteredReviews.value.length / reviewPageSize)))
const paginatedReviews = computed(() => {
  const start = (reviewPage.value - 1) * reviewPageSize
  return filteredReviews.value.slice(start, start + reviewPageSize)
})

const filteredComments = computed(() => comments.filter(comment => {
  const matchTab = commentTab.value === '全部评论' || comment.status === commentTab.value
  const keyword = commentKeyword.value.trim()
  return matchTab && (!keyword || `${comment.content}${comment.user}${comment.target}`.includes(keyword))
}))
const commentTotalPages = computed(() => Math.max(1, Math.ceil(filteredComments.value.length / commentPageSize)))
const paginatedComments = computed(() => {
  const start = (commentPage.value - 1) * commentPageSize
  return filteredComments.value.slice(start, start + commentPageSize)
})

const filteredFeedbacks = computed(() => feedbacks.filter(feedback => {
  const matchTab = feedbackTab.value === '全部反馈' || feedback.status === feedbackTab.value
  const keyword = feedbackKeyword.value.trim()
  return matchTab && (!keyword || `${feedback.id}${feedback.content}${feedback.user}`.includes(keyword))
}))

const filteredWorkOrders = computed(() => workOrders.filter(order => {
  const matchTab = ticketTab.value === '全部工单' || order.status === ticketTab.value
  const matchType = ticketType.value === '全部工单类型' || order.type === ticketType.value
  const matchPriority = ticketPriority.value === '全部优先级' || order.priority === ticketPriority.value
  const matchSource = ticketSource.value === '全部来源' || order.source === ticketSource.value
  const keyword = ticketKeyword.value.trim()
  return matchTab && matchType && matchPriority && matchSource && (!keyword || `${order.id}${order.title}${order.owner}${order.user || ''}`.includes(keyword))
}))
const ticketTotalPages = computed(() => Math.max(1, Math.ceil(filteredWorkOrders.value.length / ticketPageSize)))
const paginatedWorkOrders = computed(() => {
  const start = (ticketPage.value - 1) * ticketPageSize
  return filteredWorkOrders.value.slice(start, start + ticketPageSize)
})

const filteredSystemLogs = computed(() => systemLogs.filter(log => {
  const matchTab = logTab.value === '全部日志'
    || (logTab.value === '异常日志' && ['错误', '警告'].includes(log.level))
    || (logTab.value === '接口性能' && `${log.event}${log.detail}`.includes('响应'))
    || (logTab.value === '定时任务' && log.service === '定时任务')
  const matchLevel = logLevel.value === '全部级别' || log.level === logLevel.value
  const matchService = logService.value === '全部服务' || log.service === logService.value
  const keyword = logKeyword.value.trim()
  return matchTab && matchLevel && matchService && (!keyword || `${log.event}${log.detail}${log.trace}`.includes(keyword))
}))
const logTotalPages = computed(() => Math.max(1, Math.ceil(filteredSystemLogs.value.length / logPageSize)))
const paginatedSystemLogs = computed(() => {
  const start = (logPage.value - 1) * logPageSize
  return filteredSystemLogs.value.slice(start, start + logPageSize)
})

const filteredBreedComments = computed(() => {
  const filtered = breedCommentSamples.filter(comment => {
    const matchTab = breedCommentTab.value === '全部评论' || comment.status === breedCommentTab.value
    const keyword = breedCommentKeyword.value.trim()
    return matchTab && (!keyword || `${comment.content}${comment.user}`.includes(keyword))
  })
  return [...filtered].sort((a, b) => breedCommentSort.value === '点赞最多' ? b.likes - a.likes : b.time.localeCompare(a.time))
})
const breedCommentTotalPages = computed(() => pageCount(filteredBreedComments.value))
const paginatedBreedComments = computed(() => pageSlice(filteredBreedComments.value, breedCommentPage.value))
const activityTotalPages = computed(() => pageCount(filteredUserActivities.value))
const paginatedUserActivities = computed(() => pageSlice(filteredUserActivities.value, activityPage.value))

function toggleBreedTag(tag) {
  selectedBreedTags.value = selectedBreedTags.value.includes(tag)
    ? selectedBreedTags.value.filter(item => item !== tag)
    : [...selectedBreedTags.value, tag]
}

function isEditorTagSelected(tag) {
  return (subPageData.value.tags || []).includes(tag)
}

function toggleEditorTag(tag) {
  if (subPage.value === 'breed-view') return
  const currentTags = subPageData.value.tags || []
  subPageData.value = {
    ...subPageData.value,
    tags: currentTags.includes(tag)
      ? currentTags.filter(item => item !== tag)
      : [...currentTags, tag]
  }
}

function getEditableTagContext() {
  const type = subPage.value.startsWith('breed-') && subPageData.value.type
    ? subPageData.value.type
    : selectedTagPetType.value
  return { type, groups: breedTagGroupsByType.value[type] || breedTagGroups.value }
}

function updateBreedTag(groupIndex, tagIndex, event) {
  const { type, groups } = getEditableTagContext()
  const oldTag = groups[groupIndex].options[tagIndex]
  const nextTag = event.target.value.trim()
  if (!nextTag || nextTag === oldTag) {
    event.target.value = oldTag
    return
  }
  if (groups.flatMap(group => group.options).includes(nextTag)) {
    event.target.value = oldTag
    showToast('标签名称不能重复')
    return
  }
  groups[groupIndex].options[tagIndex] = nextTag
  breeds.filter(breed => breed.type === type).forEach(breed => {
    breed.tags = breed.tags.map(tag => tag === oldTag ? nextTag : tag)
  })
  selectedBreedTags.value = selectedBreedTags.value.map(tag => tag === oldTag ? nextTag : tag)
  subPageData.value.tags = (subPageData.value.tags || []).map(tag => tag === oldTag ? nextTag : tag)
  showToast('标签名称已更新')
}

function addBreedTag(groupIndex) {
  const { groups } = getEditableTagContext()
  const baseName = '新标签'
  let nextName = baseName
  let suffix = 2
  const currentTags = groups.flatMap(group => group.options)
  while (currentTags.includes(nextName)) nextName = `${baseName}${suffix++}`
  groups[groupIndex].options.push(nextName)
  subPageData.value.tags = [...(subPageData.value.tags || []), nextName]
}

function removeBreedTag(groupIndex, tagIndex) {
  const { type, groups } = getEditableTagContext()
  const tag = groups[groupIndex].options[tagIndex]
  groups[groupIndex].options.splice(tagIndex, 1)
  if (!breedFilterTags.value.includes(tag)) selectedBreedTags.value = selectedBreedTags.value.filter(item => item !== tag)
  breeds.filter(breed => breed.type === type).forEach(breed => { breed.tags = breed.tags.filter(item => item !== tag) })
  subPageData.value.tags = (subPageData.value.tags || []).filter(item => item !== tag)
}

function deleteTagFromList(tag) {
  if (!window.confirm(`确认删除标签“${tag.name}”吗？`)) return
  removeBreedTag(tag.groupIndex, tag.tagIndex)
  showToast(`已删除标签“${tag.name}”`)
}

function startFilterTagDrag(event, tagIndex) {
  draggedFilterTagIndex.value = tagIndex
  dragOverFilterTagIndex.value = tagIndex
  dragOverFilterTagAfter.value = false
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(tagIndex))
  const row = event.currentTarget.closest('.filter-detail-row')
  if (row) {
    filterTagDragPreview = row.cloneNode(true)
    filterTagDragPreview.classList.add('filter-drag-preview')
    filterTagDragPreview.style.width = `${row.getBoundingClientRect().width}px`
    document.body.appendChild(filterTagDragPreview)
    event.dataTransfer.setDragImage(filterTagDragPreview, 28, row.offsetHeight / 2)
  }
}

function updateFilterTagDropTarget(event, tagIndex) {
  const bounds = event.currentTarget.getBoundingClientRect()
  dragOverFilterTagIndex.value = tagIndex
  dragOverFilterTagAfter.value = event.clientY >= bounds.top + bounds.height / 2
}

function dropFilterTag() {
  const options = selectedFilterGroup.value?.options
  const sourceIndex = draggedFilterTagIndex.value
  const targetIndex = dragOverFilterTagIndex.value
  if (options && sourceIndex !== null && targetIndex !== null) {
    let insertIndex = targetIndex + (dragOverFilterTagAfter.value ? 1 : 0)
    const [tag] = options.splice(sourceIndex, 1)
    if (sourceIndex < insertIndex) insertIndex -= 1
    options.splice(insertIndex, 0, tag)
  }
  endFilterTagDrag()
}

function endFilterTagDrag() {
  draggedFilterTagIndex.value = null
  dragOverFilterTagIndex.value = null
  dragOverFilterTagAfter.value = false
  filterTagDragPreview?.remove()
  filterTagDragPreview = null
}

function deleteFilterGroup() {
  const group = selectedFilterGroup.value
  const groupIndex = selectedFilterGroupIndex.value
  if (!group || groupIndex < 0 || !window.confirm(`确认删除筛选分组“${group.name}”及其全部筛选项吗？`)) return
  const removedTags = new Set(group.options)
  breedTagGroups.value.splice(groupIndex, 1)
  breeds.filter(breed => breed.type === selectedTagPetType.value).forEach(breed => {
    breed.tags = breed.tags.filter(tag => !removedTags.has(tag))
  })
  selectedBreedTags.value = selectedBreedTags.value.filter(tag => breedFilterTags.value.includes(tag))
  selectedFilterGroupName.value = breedTagGroups.value[0]?.name || ''
  showToast(`已删除筛选分组“${group.name}”`)
}

function resetBreedFilters() {
  breedKeyword.value = ''
  breedType.value = '全部类型'
  breedStatus.value = '全部状态'
  selectedBreedTags.value = []
  breedTagFilterOpen.value = false
}

function selectReviewTab(tab) {
  reviewTab.value = tab
  reviewPage.value = 1
}

watch([breedKeyword, breedType, breedStatus, selectedBreedTags], () => { breedPage.value = 1 })
watch(() => subPageData.value.type, (type, previousType) => {
  if (!previousType || type === previousType || !['犬类', '猫类'].includes(type)) return
  const validSizes = type === '犬类' ? dogDetailSizeOptions : catDetailSizeOptions
  if (!validSizes.includes(subPageData.value.size)) subPageData.value.size = ''
})
watch([reviewTab, reviewKeyword], () => { reviewPage.value = 1 })
watch([commentTab, commentKeyword], () => { commentPage.value = 1 })
watch([ticketTab, ticketType, ticketPriority, ticketSource, ticketKeyword], () => { ticketPage.value = 1 })
watch([logTab, logLevel, logService, logKeyword], () => { logPage.value = 1 })
watch([breedCommentTab, breedCommentKeyword, breedCommentSort], () => { breedCommentPage.value = 1 })
watch([activityType, activityRange, activityKeyword], () => { activityPage.value = 1 })

const filteredUserActivities = computed(() => userActivities.filter(item => {
  const matchType = activityType.value === '全部行为' || item.type === activityType.value
  const keyword = activityKeyword.value.trim()
  return matchType && (!keyword || `${item.title}${item.detail}${item.target}`.includes(keyword))
}))

const chartValues = computed(() => chartMode.value === '访问量' ? [52, 70, 58, 78, 56, 79, 94] : [34, 52, 48, 69, 47, 65, 82])
const chartSecondaryValues = computed(() => chartMode.value === '访问量' ? [39, 55, 45, 61, 43, 64, 76] : [24, 39, 36, 51, 34, 49, 63])
const dashboardChartX = index => 48 + index * (656 / 6)
const chartPoints = computed(() => chartValues.value.map((value, index) => `${dashboardChartX(index)},${198 - value * 1.45}`).join(' '))
const chartSecondaryPoints = computed(() => chartSecondaryValues.value.map((value, index) => `${dashboardChartX(index)},${198 - value * 1.45}`).join(' '))
const chartAreaPoints = computed(() => `48,212 ${chartPoints.value} 704,212`)
const chartSecondaryAreaPoints = computed(() => `48,212 ${chartSecondaryPoints.value} 704,212`)

function selectNav(label) {
  accountMenuOpen.value = false
  notificationMenuOpen.value = false
  if (label === '品种管理') label = '宠物管理'
  if (['宠物管理', '分类管理'].includes(label)) breedMenuOpen.value = true
  activeNav.value = label
  subPage.value = ''
  window.location.hash = encodeURIComponent(label)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleAccountMenu() {
  notificationMenuOpen.value = false
  accountMenuOpen.value = !accountMenuOpen.value
}

function toggleNotificationMenu() {
  accountMenuOpen.value = false
  notificationMenuOpen.value = !notificationMenuOpen.value
}

function openNotification(notification) {
  notificationMenuOpen.value = false
  selectNav(notification.nav)
}

function markNotificationsRead() {
  notificationsRead.value = true
  notificationMenuOpen.value = false
}

function handleAccountAction(action) {
  accountMenuOpen.value = false
  if (action === 'profile') {
    selectNav('管理员')
    openSubPage('admin-edit', admins[0])
    return
  }
  if (action === 'manage') {
    selectNav('管理员')
    return
  }
  window.alert('当前为管理平台前端原型，退出登录将在接入账号鉴权后启用。')
}

function openStatPage(stat) {
  if (stat.breedType) breedType.value = stat.breedType
  selectNav(stat.nav)
}

function valueToRating(value, kind) {
  const scales = {
    exercise: { 中低: 2, 中等: 3, 中高: 4, 高: 5 },
    shedding: { 较少: 1, 一般: 3, 较多: 5 },
    appetite: { 较小: 2, 中等: 3, 较好: 4, 较大: 5 },
    odor: { 很轻: 1, 较轻: 2, 中等: 3, 较重: 5 }
  }
  return scales[kind]?.[value] || 3
}

function createDefaultRatings(breed = {}) {
  const friendlyTrait = /亲人|友善|温顺|粘人/.test(breed.trait || '')
  return [
    { label: '运动需求', score: valueToRating(breed.exercise, 'exercise') },
    { label: '掉毛程度', score: valueToRating(breed.shedding, 'shedding') },
    { label: '饭量', score: valueToRating(breed.appetite, 'appetite') },
    { label: '体味', score: valueToRating(breed.odor, 'odor') },
    { label: '亲人程度', score: friendlyTrait ? 5 : 3 },
    { label: '训练配合度', score: 4 }
  ]
}

function createDefaultTraitTags(breed = {}) {
  if (Array.isArray(breed.traits)) return [...breed.traits]
  if (breed.name === '威尔士柯基犬') return ['聪明机警', '开朗亲人', '精力充沛', '服从性好', '牧犬本能']
  return String(breed.trait || '').split(/[、,，]/).map(tag => tag.trim()).filter(Boolean)
}

function createLifespanRange(value = '') {
  const values = String(value).match(/\d+/g) || []
  return [values[0] || '', values[1] || '']
}

function openSubPage(type, data = {}) {
  if (['breed-create', 'breed-edit', 'breed-view'].includes(type)) {
    const [lifespanStart, lifespanEnd] = createLifespanRange(data.age)
    subPageData.value = {
      origin: data.origin || breedOrigins[data.name] || '',
      intro: '',
      care: '',
      tags: [],
      ...data,
      _originalName: data.name || '',
      lifespanStart: data.lifespanStart || lifespanStart,
      lifespanEnd: data.lifespanEnd || lifespanEnd,
      traits: createDefaultTraitTags(data),
      ratings: Array.isArray(data.ratings) ? data.ratings : createDefaultRatings(data)
    }
  } else if (['category-create', 'category-edit'].includes(type)) {
    const originalName = data.name || ''
    const sourceGroups = data.groups || breedTagGroupsByType.value[originalName] || []
    subPageData.value = {
      name: originalName,
      _originalName: originalName,
      groups: sourceGroups.map(group => ({ name: group.name, options: [...group.options] }))
    }
  } else {
    subPageData.value = data
  }
  subPage.value = type
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function addCategoryLabel() {
  const groups = [...(subPageData.value.groups || [])]
  groups.push({ name: '', options: [] })
  subPageData.value = { ...subPageData.value, groups }
}

function removeCategoryLabel(groupIndex) {
  subPageData.value = {
    ...subPageData.value,
    groups: subPageData.value.groups.filter((_, index) => index !== groupIndex)
  }
}

function addCategoryFilterOption(groupIndex) {
  subPageData.value.groups[groupIndex].options.push('')
}

function removeCategoryFilterOption(groupIndex, optionIndex) {
  subPageData.value.groups[groupIndex].options.splice(optionIndex, 1)
}

function deleteCategory(category) {
  if (category.breedCount > 0) {
    showToast(`该分类仍关联 ${category.breedCount} 个品种，请先调整品种分类`)
    return
  }
  if (!window.confirm(`确定删除分类“${category.name}”吗？`)) return
  delete breedTagGroupsByType.value[category.name]
  if (selectedTagPetType.value === category.name) selectedTagPetType.value = breedTypeOptions.value[0] || ''
  showToast(`分类“${category.name}”已删除`)
}

function addBreedRating() {
  const ratings = Array.isArray(subPageData.value.ratings) ? subPageData.value.ratings : []
  if (ratings.length >= 12) {
    showToast('评分项目最多添加 12 项')
    return
  }
  subPageData.value = { ...subPageData.value, ratings: [...ratings, { label: '自定义项目', score: 3 }] }
}

function removeBreedRating(index) {
  subPageData.value = {
    ...subPageData.value,
    ratings: subPageData.value.ratings.filter((_, ratingIndex) => ratingIndex !== index)
  }
}

function setBreedRating(index, score) {
  subPageData.value.ratings[index].score = score
}

function handleBreedImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过 5MB')
    event.target.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    subPageData.value = { ...subPageData.value, image: reader.result }
    showToast('品种图片已更新')
  }
  reader.readAsDataURL(file)
}

function addBreedTrait() {
  const traits = [...(subPageData.value.traits || [])]
  if (traits.length >= 12) {
    showToast('宠物标签最多添加 12 个')
    return
  }
  subPageData.value = { ...subPageData.value, traits: [...traits, `新标签 ${traits.length + 1}`] }
}

function removeBreedTrait(index) {
  subPageData.value = {
    ...subPageData.value,
    traits: subPageData.value.traits.filter((_, traitIndex) => traitIndex !== index)
  }
}

function normalizeLifespan(field) {
  const value = Math.floor(Number(subPageData.value[field]))
  subPageData.value[field] = Number.isFinite(value) && value > 0 ? value : ''
  const start = Number(subPageData.value.lifespanStart)
  const end = Number(subPageData.value.lifespanEnd)
  if (!start || !end || start <= end) return
  if (field === 'lifespanStart') subPageData.value.lifespanStart = end
  else subPageData.value.lifespanEnd = start
}

function closeSubPage() {
  subPage.value = ''
  subPageData.value = {}
}

function saveBreedDraft() {
  subPageData.value = { ...subPageData.value, status: '草稿' }
  showToast('品种资料已保存为草稿')
}

function deleteBreedFromList(breed) {
  if (!window.confirm(`确定删除“${breed.name}”吗？此操作无法撤销。`)) return
  const index = breeds.findIndex(item => item.name === breed.name)
  if (index >= 0) breeds.splice(index, 1)
  if (breedPage.value > breedTotalPages.value) breedPage.value = breedTotalPages.value
  showToast(`已删除“${breed.name}”`)
}

function toggleBreedPublishStatus() {
  const isPublished = subPageData.value.status === '已发布'
  const nextStatus = isPublished ? '已下架' : '已发布'
  subPageData.value.status = nextStatus
  const breed = breeds.find(item => item.name === subPageData.value.name)
  if (breed) {
    breed.status = nextStatus
    breed.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
  }
  showToast(isPublished ? '品种已下架' : '品种已上架')
}

function deleteBreed() {
  const name = subPageData.value.name || '该品种'
  if (!window.confirm(`确定删除“${name}”吗？此操作无法撤销。`)) return
  const index = breeds.findIndex(breed => breed.name === subPageData.value.name)
  if (index >= 0) breeds.splice(index, 1)
  closeSubPage()
  showToast(`已删除“${name}”`)
}

function showToast(message) {
  toastMessage.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toastMessage.value = '' }, 2200)
}

function handleSubPagePrimary() {
  if (subPage.value.includes('export')) showToast('导出任务已创建，文件生成后将自动下载')
  else if (subPage.value === 'review-detail') showToast('审核已通过')
  else if (['breed-create', 'breed-edit'].includes(subPage.value)) {
    const originalName = subPageData.value._originalName || subPageData.value.name
    const payload = { ...subPageData.value }
    delete payload._originalName
    payload.traits = (payload.traits || []).map(tag => tag.trim()).filter(Boolean)
    payload.trait = payload.traits.join('、')
    if (payload.lifespanStart && payload.lifespanEnd) payload.age = `${payload.lifespanStart}–${payload.lifespanEnd} 年`
    payload.type = payload.type || (payload.size?.includes('犬') ? '犬类' : payload.size?.includes('猫') ? '猫类' : '')
    payload.bodySize = payload.size?.replace(/[犬猫]$/, '') || payload.bodySize || ''
    payload.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
    if (subPage.value === 'breed-create') payload.createdAt = payload.updatedAt
    if (subPage.value === 'breed-edit') {
      const index = breeds.findIndex(breed => breed.name === originalName)
      if (index >= 0) Object.assign(breeds[index], payload)
    } else {
      breeds.unshift({ ...payload, status: payload.status || '草稿' })
    }
    subPageData.value = { ...payload, _originalName: payload.name }
    showToast('品种资料已保存')
  } else if (['category-create', 'category-edit'].includes(subPage.value)) {
    const name = (subPageData.value.name || '').trim()
    const originalName = subPageData.value._originalName || ''
    if (!name) {
      showToast('请输入分类名称')
      return
    }
    if (breedTagGroupsByType.value[name] && name !== originalName) {
      showToast('分类名称不能重复')
      return
    }
    const groups = (subPageData.value.groups || []).map(group => ({
      name: String(group.name || '').trim(),
      options: (group.options || []).map(option => String(option || '').trim()).filter(Boolean)
    }))
    if (groups.some(group => !group.name)) {
      showToast('请填写分类标签名称')
      return
    }
    if (new Set(groups.map(group => group.name)).size !== groups.length) {
      showToast('分类标签名称不能重复')
      return
    }
    if (groups.some(group => new Set(group.options).size !== group.options.length)) {
      showToast('同一分类标签下的筛选项不能重复')
      return
    }
    if (originalName && originalName !== name) {
      delete breedTagGroupsByType.value[originalName]
      breeds.filter(breed => breed.type === originalName).forEach(breed => { breed.type = name })
      if (breedType.value === originalName) breedType.value = name
    }
    breedTagGroupsByType.value[name] = groups
    selectedTagPetType.value = name
    selectedFilterGroupName.value = ''
    subPageData.value = { name, _originalName: name, groups: groups.map(group => ({ name: group.name, options: [...group.options] })) }
    showToast(subPage.value === 'category-create' ? `分类“${name}”已创建` : `分类“${name}”已更新`)
  } else if (['group-create', 'group-edit'].includes(subPage.value)) {
    const type = subPageData.value.type || selectedTagPetType.value
    const groups = breedTagGroupsByType.value[type] || (breedTagGroupsByType.value[type] = [])
    const name = (subPageData.value.name || '').trim()
    if (!name) {
      showToast('请输入筛选分组名称')
      return
    }
    const currentIndex = Number(subPageData.value.groupIndex)
    const duplicate = groups.some((group, index) => group.name === name && index !== currentIndex)
    if (duplicate) {
      showToast('筛选分组名称不能重复')
      return
    }
    if (subPage.value === 'group-edit' && currentIndex >= 0 && groups[currentIndex]) {
      groups[currentIndex].name = name
      selectedFilterGroupName.value = name
      showToast('筛选分组已更新')
    } else {
      groups.push({ name, options: [] })
      selectedTagPetType.value = type
      selectedFilterGroupName.value = name
      subPageData.value.groupIndex = groups.length - 1
      showToast('筛选分组已创建')
    }
  } else showToast('内容已保存')
}

function handlePrototypeAction(message) {
  showToast(message)
}

function handleDashboardFallback(event) {
  const button = event.target.closest('button')
  if (!button) return
  const label = button.textContent.trim().replace(/\s+/g, ' ')
  if (button.closest('.pagination') && !button.disabled) {
    const pagination = button.closest('.pagination')
    const pageButtons = [...pagination.querySelectorAll('button')].filter(item => /^\d[\d,]*$/.test(item.textContent.trim()))
    if (/^\d[\d,]*$/.test(label)) {
      pageButtons.forEach(item => item.classList.toggle('active', item === button))
    }
    return
  }
  if (['响应时间', '请求量', '错误率'].includes(label)) {
    performanceMode.value = label
    button.parentElement.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button))
    return
  }
  const feedback = {
    '驳回修改': '该审核内容已标记为驳回',
    '通过审核': '该审核内容已通过',
    '添加运营备注': '运营备注编辑框已打开',
    '保存处理结果': '反馈处理结果已保存',
    '查看用户截图': '用户反馈截图预览已打开',
    '编辑角色信息': '角色信息编辑状态已开启',
    '生成随机密码': '已生成一组随机初始密码',
    '重置登录密码': '密码重置流程已打开',
    '近 30 日': '时间范围选择已展开',
    '添加标签': '标签选择器已展开'
  }[label]
  if (feedback) showToast(feedback)
}

onMounted(() => {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  if (hash === '内容审核') {
    activeNav.value = '工作台'
    window.location.hash = encodeURIComponent('工作台')
    return
  }
  if (hash === '品种管理') {
    activeNav.value = '宠物管理'
    window.location.hash = encodeURIComponent('宠物管理')
    return
  }
  if (hash === '标签管理') {
    activeNav.value = '分类管理'
    window.location.hash = encodeURIComponent('分类管理')
    return
  }
  if (hash === '用户反馈') {
    activeNav.value = '工单管理'
    window.location.hash = encodeURIComponent('工单管理')
    return
  }
  if (navItems.some(item => item.label === hash || item.children?.includes(hash))) activeNav.value = hash
})
</script>

<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark"><AdminIcon name="paw" :size="28" /></div><strong>宠物百科管理平台</strong></div>
      <nav class="nav-list" aria-label="管理平台导航">
        <div v-for="item in navItems" :key="item.label" class="nav-group">
          <button class="nav-item" :class="{ active: activeNav === item.label || item.children?.includes(activeNav) }" :aria-expanded="item.children ? breedMenuOpen : undefined" @click="item.children ? breedMenuOpen = !breedMenuOpen : selectNav(item.label)">
            <AdminIcon :name="item.icon" :size="22" /><span>{{ item.label }}</span>
            <span v-if="navAttentionCount(item.label)" class="nav-badge">{{ navAttentionCount(item.label) }}</span>
            <AdminIcon v-if="item.children" class="nav-chevron" :name="breedMenuOpen ? 'chevron-up' : 'chevron-down'" :size="15" />
            <span v-if="item.label === '用户反馈'" class="nav-dot" />
          </button>
          <div v-if="item.children && breedMenuOpen" class="nav-submenu">
            <button v-for="child in item.children" :key="child" type="button" :class="{ active: activeNav === child }" @click="selectNav(child)">{{ child }}</button>
          </div>
        </div>
      </nav>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="breadcrumb"><strong>{{ activeNav }}</strong><span>/</span><span>{{ currentDescription }}</span></div>
        <label class="global-search"><AdminIcon name="search" :size="17" /><input v-model="searchText" placeholder="搜索品种或内容" /></label>
        <div class="topbar-actions"><div class="notification-picker"><button class="icon-button notification" :class="{ 'has-unread': !notificationsRead }" type="button" aria-label="消息通知" aria-haspopup="menu" :aria-expanded="notificationMenuOpen" @click="toggleNotificationMenu"><AdminIcon name="bell" :size="20" /></button><div v-if="notificationMenuOpen" class="notification-menu" role="menu"><div class="notification-heading"><div><strong>消息通知</strong><small>{{ notificationsRead ? '暂无未读消息' : `${notifications.length} 条未读` }}</small></div><button v-if="!notificationsRead" type="button" @click="markNotificationsRead">全部标为已读</button></div><button v-for="notification in notifications" :key="notification.title" class="notification-item" type="button" role="menuitem" @click="openNotification(notification)"><span class="notification-item-icon"><AdminIcon :name="notification.icon" :size="17" /></span><span><strong>{{ notification.title }}</strong><small>{{ notification.detail }}</small></span><AdminIcon name="chevron-right" :size="14" /></button></div></div><div class="account-picker"><button class="account-area" type="button" aria-haspopup="menu" :aria-expanded="accountMenuOpen" @click="toggleAccountMenu"><span class="avatar"><AdminIcon name="user" :size="19" /></span><span>管理员</span><AdminIcon class="chevron" :name="accountMenuOpen ? 'chevron-up' : 'chevron-down'" :size="15" /></button><div v-if="accountMenuOpen" class="account-menu" role="menu"><button type="button" role="menuitem" @click="handleAccountAction('profile')"><AdminIcon name="user" :size="16" /><span><strong>个人资料</strong><small>查看并修改当前账号</small></span></button><button type="button" role="menuitem" @click="handleAccountAction('manage')"><AdminIcon name="users" :size="16" /><span><strong>管理员管理</strong><small>账号、角色与权限</small></span></button><button class="logout-item" type="button" role="menuitem" @click="handleAccountAction('logout')"><AdminIcon name="logout" :size="16" /><span><strong>退出登录</strong><small>退出当前管理账号</small></span></button></div></div></div>
      </header>

      <main class="dashboard" @click="handleDashboardFallback">
        <!-- 二级页面 -->
        <template v-if="subPage">
          <section class="subpage-header" :class="{ 'tag-editor-header': subPageGroup === 'tag' && subPage !== 'tag-relate' }">
            <button class="back-button" @click="closeSubPage"><AdminIcon name="arrow-left" :size="16" />返回{{ activeNav }}</button>
            <div><h1>{{ subPageMeta[0] }}</h1></div>
            <div class="subpage-actions">
              <button v-if="subPage === 'user-activity'" class="secondary-button" @click="handlePrototypeAction('用户行为记录已导出')">导出记录</button>
              <button v-else-if="subPage === 'breed-comments'" class="secondary-button" @click="handlePrototypeAction('品种评论已导出')"><AdminIcon name="download" :size="15" />导出评论</button>
              <button v-else-if="subPage !== 'breed-edit'" class="secondary-button" @click="closeSubPage">取消</button>
              <button v-if="subPage === 'breed-view'" class="primary-button" @click="openSubPage('breed-edit', subPageData)">编辑</button>
              <button v-if="subPage === 'ticket-view'" class="primary-button" @click="openSubPage('ticket-handle', subPageData)">处理工单</button>
              <button v-if="subPage === 'breed-create'" class="draft-button" @click="saveBreedDraft"><AdminIcon name="document" :size="15" />保存为草稿</button>
              <button v-if="!['breed-edit','breed-view','admin-log','user-activity','breed-comments','ticket-view','ticket-more'].includes(subPage)" class="primary-button" @click="handleSubPagePrimary">{{ subPage.includes('export') ? '开始导出' : subPage === 'review-detail' ? '通过审核' : subPage === 'ticket-create' ? '创建工单' : subPage === 'ticket-handle' ? '提交处理' : '保存' }}</button>
            </div>
          </section>

          <!-- 品种二级页面 -->
          <template v-if="subPageGroup === 'breed'">
            <section v-if="subPage === 'breed-import'" class="subpage-grid import-page">
              <article class="panel form-panel"><div class="section-title"><span class="step-number">1</span><div><h2>上传导入文件</h2><p>支持 XLSX 或 CSV 格式，单次最多导入 500 条</p></div></div><div class="upload-zone"><span class="upload-icon"><AdminIcon name="upload" :size="30" /></span><strong>将文件拖到此处，或点击选择文件</strong><p>文件大小不超过 10MB</p><button class="secondary-button" @click="handlePrototypeAction('文件选择功能已就绪，接入后端后执行上传校验')">选择文件</button></div><div class="template-download"><div><strong>首次导入？</strong><p>请先下载模板，并按照字段说明填写品种数据。</p></div><button class="text-button" @click="handlePrototypeAction('品种导入模板已开始下载')">下载导入模板 <AdminIcon name="download" :size="14" /></button></div></article>
              <aside class="panel guide-panel"><div class="panel-heading bordered"><h2>导入说明</h2></div><ol><li><strong>下载模板</strong><span>不要修改模板中的字段名称</span></li><li><strong>填写品种信息</strong><span>带 * 字段为必填项</span></li><li><strong>上传并校验</strong><span>系统会自动检查重复与格式</span></li><li><strong>确认导入</strong><span>通过校验后保存至草稿</span></li></ol><div class="import-history"><strong>最近导入</strong><p><span>品种数据_08月.xlsx</span><em>成功 26 条</em></p><p><span>猫咪品种补充.csv</span><em>成功 8 条</em></p></div></aside>
            </section>
            <section v-else class="editor-layout breed-editor-layout">
              <div class="editor-main">
                <article class="panel form-panel breed-basic-panel"><div class="section-title"><h2>基础资料</h2><p>编辑宠物照片、分类、品种名称与品种简介</p></div><div class="breed-basic-content"><div class="form-grid"><label class="form-field"><span>宠物品种名 *</span><input v-model="subPageData.name" placeholder="请输入宠物品种名" :disabled="subPage === 'breed-view'"></label><label class="form-field"><span>所属分类 *</span><select v-model="subPageData.type" :disabled="subPage === 'breed-view'"><option disabled value="">请选择所属分类</option><option v-for="type in breedTypeOptions" :key="type" :value="type">{{ type }}</option></select></label><label class="form-field full"><span>品种简介 *</span><textarea v-model="subPageData.summary" :disabled="subPage === 'breed-view'" placeholder="概括该品种的外形特点、性格和饲养重点"></textarea><small>建议 30–60 字</small></label></div><div class="breed-basic-media"><strong>宠物照片</strong><div class="cover-preview"><img v-if="subPageData.image" :src="subPageData.image" :alt="subPageData.name"><AdminIcon v-else name="image" :size="42" /><p>{{ subPageData.image ? '品种封面图' : '请选择品种照片' }}</p></div><label v-if="subPage !== 'breed-view'" class="secondary-button full-button breed-image-button"><AdminIcon name="upload" :size="14" />更换图片<input type="file" accept="image/png,image/jpeg,image/webp" @change="handleBreedImageChange"></label><small>建议比例 4:3，大小不超过 5MB</small></div></div></article>
                <article class="panel form-panel breed-traits-panel"><div class="section-title"><h2>品种特质</h2><p>编辑品种来源、体型、寿命和特质标签</p></div><div class="form-grid"><label class="form-field"><span>原产地 *</span><input v-model="subPageData.origin" :disabled="subPage === 'breed-view'" placeholder="例如：英国威尔士"></label><label class="form-field"><span>体型分类 *</span><select v-model="subPageData.size" :disabled="subPage === 'breed-view'"><option disabled value="">请选择前端展示体型</option><option v-for="size in breedDetailSizeOptions" :key="size" :value="size">{{ size }}</option></select></label><label class="form-field"><span>平均寿命 *</span><span class="lifespan-range"><input v-model.number="subPageData.lifespanStart" type="number" min="1" step="1" inputmode="numeric" :disabled="subPage === 'breed-view'" aria-label="最短寿命" @change="normalizeLifespan('lifespanStart')"><b>–</b><input v-model.number="subPageData.lifespanEnd" type="number" min="1" step="1" inputmode="numeric" :disabled="subPage === 'breed-view'" aria-label="最长寿命" @change="normalizeLifespan('lifespanEnd')"><em>年</em></span></label><div class="form-field full breed-trait-field"><span>宠物标签 *</span><div class="breed-trait-editor"><div v-for="(tag,index) in subPageData.traits" :key="index" class="breed-trait-chip"><input v-model="subPageData.traits[index]" :disabled="subPage === 'breed-view'" :aria-label="`宠物标签 ${index + 1}`"><button v-if="subPage !== 'breed-view'" type="button" :aria-label="`删除宠物标签 ${tag}`" @click="removeBreedTrait(index)"><AdminIcon name="close" :size="12" /></button></div><button v-if="subPage !== 'breed-view'" type="button" class="breed-trait-add" @click="addBreedTrait"><AdminIcon name="plus" :size="13" />添加标签</button></div><small>已添加 {{ subPageData.traits?.length || 0 }} 个标签，可直接修改名称</small></div></div></article>
                <article class="panel form-panel rating-form-panel"><div class="section-title rating-section-title"><div><h2>品种信息</h2><p>项目名称与 1–5 星评分均可自定义</p></div><div v-if="subPage !== 'breed-view'" class="rating-heading-actions"><button type="button" class="secondary-button" @click="addBreedRating"><AdminIcon name="plus" :size="14" />添加项目</button></div></div><div class="rating-editor-list"><div v-for="(rating,index) in subPageData.ratings" :key="index" class="rating-editor-row"><label><span>项目名称</span><input v-model="rating.label" :disabled="subPage === 'breed-view'" placeholder="例如：亲人程度"></label><div class="rating-score-editor"><span>{{ rating.score }} 星</span><div><button v-for="score in 5" :key="score" type="button" :class="{ active: score <= rating.score }" :aria-label="`${score} 星`" :aria-pressed="rating.score === score" :disabled="subPage === 'breed-view'" @click="setBreedRating(index, score)"><AdminIcon name="star" :size="20" /></button></div></div><button v-if="subPage !== 'breed-view'" type="button" class="rating-delete-button" aria-label="删除评分项目" @click="removeBreedRating(index)"><AdminIcon name="trash" :size="17" /></button></div><div v-if="!subPageData.ratings?.length" class="rating-empty"><AdminIcon name="star" :size="24" /><strong>暂无评分项目</strong><span>点击“添加项目”创建评分内容</span></div></div></article>
                <article class="panel form-panel"><div class="section-title"><h2>品种小常识</h2><p>编辑详情页展示的品种知识内容</p></div><div class="form-grid"><label class="form-field full"><span>内容信息 *</span><textarea v-model="subPageData.intro" :disabled="subPage === 'breed-view'" placeholder="填写品种历史、性格特点或与家庭相处等知识内容"></textarea><small>建议 50–150 字</small></label></div></article>
                <article class="panel form-panel"><div class="section-title"><h2>日常养护</h2><p>编辑喂养、运动、清洁和健康注意事项</p></div><div class="form-grid"><label class="form-field full"><span>内容信息 *</span><textarea v-model="subPageData.care" :disabled="subPage === 'breed-view'" placeholder="填写运动、饮食、梳毛、清洁、训练和健康注意事项"></textarea><small>建议 50–150 字</small></label></div></article>
                <article class="panel form-panel breed-tags-editor"><div class="section-title"><h2>分类标签</h2></div><div class="form-grid"><div class="form-field full"><div class="breed-tag-groups"><section v-for="group in editorBreedTagGroups" :key="group.name" class="breed-tag-group"><strong>{{ group.name }}</strong><div class="breed-tag-items"><button v-for="tag in group.options" :key="`${group.name}-${tag}`" type="button" class="breed-tag-choice" :class="{ selected: isEditorTagSelected(tag) }" :aria-label="`${isEditorTagSelected(tag) ? '取消选择' : '选择'}${tag}`" :aria-pressed="isEditorTagSelected(tag)" :disabled="subPage === 'breed-view'" @click="toggleEditorTag(tag)"><AdminIcon v-if="isEditorTagSelected(tag)" name="check" :size="12" /><span>{{ tag }}</span></button></div></section></div></div></div></article>
                <article v-if="subPage === 'breed-edit'" class="panel breed-operation-panel"><div class="panel-heading bordered"><h2>品种操作</h2></div><div class="breed-operation-list"><button class="save-operation" type="button" @click="handleSubPagePrimary"><AdminIcon name="check" :size="16" /><span><strong>保存品种</strong></span></button><button class="publish-operation" :class="{ 'is-published': subPageData.status === '已发布' }" type="button" @click="toggleBreedPublishStatus"><AdminIcon :name="subPageData.status === '已发布' ? 'download' : 'upload'" :size="16" /><span><strong>{{ subPageData.status === '已发布' ? '下架品种' : '上架品种' }}</strong></span></button><button class="danger-operation" type="button" @click="deleteBreed"><AdminIcon name="trash" :size="16" /><span><strong>删除品种</strong></span></button></div></article>
              </div>
            </section>
          </template>

          <!-- 标签二级页面 -->
          <template v-else-if="subPageGroup === 'tag'">
            <section v-if="isCategorySubPage" class="category-detail-page"><article class="panel form-panel category-basic-panel"><div class="section-title"><h2>分类信息</h2></div><div class="category-name-field"><label class="form-field"><span>分类名 *</span><input v-model="subPageData.name" placeholder="例如：兔类"></label></div></article><article class="panel form-panel category-label-panel"><div class="section-title category-label-heading"><div><h2>分类标签</h2><p>为当前分类设置标签名称及对应的筛选项</p></div><button type="button" class="secondary-button" @click="addCategoryLabel"><AdminIcon name="plus" :size="15" />添加分类标签</button></div><div class="category-label-list"><section v-for="(group, groupIndex) in subPageData.groups" :key="groupIndex" class="category-label-card"><div class="category-label-card-heading"><label class="form-field"><span>标签名称 *</span><input v-model="group.name" placeholder="例如：体型分类"></label><button type="button" class="icon-danger-button" :aria-label="`删除分类标签 ${group.name || groupIndex + 1}`" @click="removeCategoryLabel(groupIndex)"><AdminIcon name="trash" :size="16" /></button></div><div class="category-option-editor"><span class="field-label">筛选项</span><div class="category-option-list"><div v-for="(option, optionIndex) in group.options" :key="optionIndex" class="category-option-input"><input v-model="group.options[optionIndex]" :aria-label="`${group.name || '分类标签'}筛选项 ${optionIndex + 1}`" placeholder="请输入筛选项"><button type="button" :aria-label="`删除筛选项 ${option || optionIndex + 1}`" @click="removeCategoryFilterOption(groupIndex, optionIndex)"><AdminIcon name="close" :size="12" /></button></div><button type="button" class="category-add-option" @click="addCategoryFilterOption(groupIndex)"><AdminIcon name="plus" :size="13" />添加筛选项</button></div></div></section><div v-if="!subPageData.groups?.length" class="category-label-empty"><AdminIcon name="tag" :size="28" /><strong>暂未添加分类标签</strong><p>点击“添加分类标签”设置名称和筛选项。</p><button type="button" class="secondary-button" @click="addCategoryLabel"><AdminIcon name="plus" :size="15" />添加分类标签</button></div></div></article></section>
            <section v-else-if="subPage === 'tag-relate'" class="panel relation-panel"><div class="relation-toolbar"><label class="inline-search"><AdminIcon name="search" :size="15" /><input placeholder="搜索品种名称"></label><select disabled><option>{{ subPageData.type }}</option></select><span>已关联 <strong>{{ subPageData.breeds || 0 }}</strong> 个品种</span></div><div class="relation-grid"><label v-for="breed in breeds.filter(breed => breed.type === subPageData.type)" :key="breed.name" class="relation-card"><input type="checkbox" :checked="breed.tags.includes(subPageData.name)"><img class="breed-thumb large" :src="breed.image" :alt="breed.name"><span><strong>{{ breed.name }}</strong><small>{{ breed.type }} · {{ breed.bodySize }}</small></span></label></div><div class="pagination"><span>已选择 {{ subPageData.breeds || 0 }} 个品种</span><button disabled aria-label="上一页"><AdminIcon name="chevron-left" :size="13" /></button><button class="active">1</button></div></section>
            <section v-else class="editor-layout compact-editor tag-editor-page"><article class="panel form-panel tag-editor-panel"><div class="section-title"><h2>{{ isGroupSubPage ? '筛选分组信息' : '筛选项信息' }}</h2><p>配置宠物管理列表中可使用的筛选条件</p></div><div class="form-grid"><label class="form-field"><span>{{ isGroupSubPage ? '分组名称' : '筛选项名称' }} *</span><input v-model="subPageData.name" :placeholder="isGroupSubPage ? '例如：生活环境' : '例如：适合小户型'"></label><label class="form-field"><span>适用分类 *</span><select v-model="subPageData.type" :disabled="isGroupSubPage"><option v-for="type in breedTypeOptions" :key="type" :value="type">{{ type }}</option></select></label><label v-if="!isGroupSubPage" class="form-field"><span>筛选分组 *</span><select v-model="subPageData.group"><option disabled value="">请选择筛选分组</option><option v-for="group in editorBreedTagGroups" :key="group.name">{{ group.name }}</option></select></label></div></article></section>
          </template>

          <!-- 审核二级页面 -->
          <template v-else-if="subPageGroup === 'review'">
            <section v-if="subPage === 'review-rules'" class="rules-grid"><article v-for="rule in [{icon:'document',name:'文本内容规范',desc:'敏感词、表述准确性及内容完整度检查',count:'已启用 8 项规则'},{icon:'image',name:'图片内容规范',desc:'图片清晰度、版权与不当内容检查',count:'已启用 5 项规则'},{icon:'external',name:'资料来源规范',desc:'关键数据需填写可信来源及更新时间',count:'已启用 4 项规则'},{icon:'trend',name:'审核流程',desc:'高风险内容需经过两位审核员确认',count:'2 级审核流程'}]" :key="rule.name" class="panel rule-card"><div class="rule-icon"><AdminIcon :name="rule.icon" :size="22" /></div><div><h2>{{ rule.name }}</h2><p>{{ rule.desc }}</p><span>{{ rule.count }}</span></div><button @click="handlePrototypeAction(`${rule.name}配置面板已打开`)">配置 <AdminIcon name="chevron-right" :size="13" /></button></article></section>
            <section v-else class="review-detail-layout"><div class="review-detail-main"><article class="panel change-panel"><div class="section-title"><h2>变更内容</h2><p>{{ subPageData.type || '资料更新' }} · {{ subPageData.target || '目标品种' }}</p></div><div class="change-block"><div class="change-label"><strong>品种简介</strong><span>文本修改</span></div><div class="diff-grid"><div class="diff-old"><small>修改前</small><p>该品种聪明活泼，需要保持充足的活动时间。</p></div><div class="diff-new"><small>修改后</small><p>该品种智商高、学习能力强，每日建议保持 1–2 小时活动和互动训练。</p></div></div></div><div class="change-block"><div class="change-label"><strong>特征标签</strong><span>新增 2 项</span></div><div class="tag-selector"><button class="selected">聪明</button><button class="selected">活跃</button><button class="new-tag"><AdminIcon name="plus" :size="13" />需要运动</button><button class="new-tag"><AdminIcon name="plus" :size="13" />易训练</button></div></div></article><article class="panel source-panel"><div class="section-title"><h2>资料来源</h2></div><a href="#">国际犬业联盟品种标准（FCI） <AdminIcon name="external" :size="13" /></a><a href="#">AKC Breed Information <AdminIcon name="external" :size="13" /></a></article></div><aside class="review-side"><article class="panel audit-panel"><div class="panel-heading bordered"><h2>审核操作</h2></div><div class="check-list"><label><input type="checkbox" checked><span><strong>内容表述准确</strong><small>无明显事实或表述错误</small></span></label><label><input type="checkbox" checked><span><strong>资料来源可信</strong><small>关键数据具有可靠来源</small></span></label><label><input type="checkbox"><span><strong>符合平台规范</strong><small>无违规、营销或不当内容</small></span></label></div><label class="audit-note"><span>审核备注</span><textarea placeholder="填写审核意见，驳回时必填"></textarea></label><div class="audit-actions"><button class="reject-button">驳回修改</button><button class="primary-button">通过审核</button></div></article><article class="panel submitter-card"><span>提交人</span><strong>{{ subPageData.author || '编辑-小周' }}</strong><small>{{ subPageData.time || '今天 15:42' }}</small></article></aside></section>
          </template>

          <!-- 评论二级页面 -->
          <template v-else-if="subPageGroup === 'comment'">
            <section v-if="subPage === 'breed-comments'" class="breed-comments-page">
              <div class="breed-comments-summary">
                <article class="panel selected-breed-card"><img v-if="subPageData.image" class="selected-breed-avatar" :src="subPageData.image" :alt="subPageData.name"><span v-else class="selected-breed-avatar"><AdminIcon name="paw" :size="28" /></span><div><small>当前品种</small><h2>{{ subPageData.name || subPageData.target }}</h2><p>百科评论集中管理</p></div></article>
                <article class="panel"><span>全部评论</span><strong>{{ subPageData.count || 326 }}</strong><small>累计发布评论</small></article>
                <article class="panel"><span>今日新增</span><strong>18</strong><small class="success-text">较昨日增加 5 条</small></article>
                <article class="panel"><span>待处理</span><strong>{{ subPageData.pending ?? 2 }}</strong><small class="warning-text">待复核及被举报</small></article>
              </div>
              <article class="panel data-panel">
                <div class="breed-comment-toolbar"><div class="category-tabs"><button v-for="tab in ['全部评论','正常','待复核','被举报','已隐藏']" :key="tab" :class="{ active: breedCommentTab === tab }" @click="breedCommentTab = tab">{{ tab }}</button></div><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="breedCommentKeyword" placeholder="搜索该品种下的评论"></label><select v-model="breedCommentSort"><option>最新发布</option><option>点赞最多</option></select></div>
                <div class="table-scroll"><table class="management-table breed-comments-table"><thead><tr><th><input type="checkbox"></th><th>评论内容</th><th>评论用户</th><th>点赞</th><th>发布时间</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="comment in paginatedBreedComments" :key="comment.content"><td><input type="checkbox"></td><td><p class="comment-content">{{ comment.content }}</p></td><td>{{ comment.user }}</td><td>{{ comment.likes }}</td><td>{{ comment.time }}</td><td><span class="state-pill" :class="comment.status">{{ comment.status }}</span></td><td><div class="row-actions"><button @click="openSubPage('comment-detail', { ...comment, target: subPageData.name || subPageData.target })">查看</button><button v-if="comment.status !== '正常'" class="danger-text" @click="openSubPage('comment-handle', { ...comment, target: subPageData.name || subPageData.target })">处理</button><button v-else @click="openSubPage('comment-handle', { ...comment, target: subPageData.name || subPageData.target })">隐藏</button></div></td></tr><tr v-if="!filteredBreedComments.length"><td colspan="7" class="empty-table-state">没有符合条件的品种评论</td></tr></tbody></table></div>
                <div class="batch-bar"><span>当前结果 {{ filteredBreedComments.length }} 条</span><button disabled>批量隐藏</button><button disabled>批量删除</button><div class="pagination compact"><button :disabled="breedCommentPage === 1" aria-label="上一页" @click="setListPage(breedCommentPage, breedCommentPage - 1, breedCommentTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in breedCommentTotalPages" :key="page" :class="{ active: breedCommentPage === page }" @click="setListPage(breedCommentPage, page, breedCommentTotalPages)">{{ page }}</button><button :disabled="breedCommentPage === breedCommentTotalPages" aria-label="下一页" @click="setListPage(breedCommentPage, breedCommentPage + 1, breedCommentTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></div>
              </article>
            </section>
            <section v-else-if="subPage === 'comment-rules'" class="rules-layout"><article class="panel form-panel"><div class="section-title"><h2>评论发布规则</h2><p>配置评论审核与展示方式</p></div><div class="setting-rows"><label><span><strong>敏感词自动识别</strong><small>命中敏感词的评论进入待复核列表</small></span><input type="checkbox" checked></label><label><span><strong>链接与联系方式拦截</strong><small>自动识别广告链接、手机号和社交账号</small></span><input type="checkbox" checked></label><label><span><strong>新用户评论审核</strong><small>注册未满 24 小时的用户评论需审核</small></span><input type="checkbox"></label><label><span><strong>重复评论折叠</strong><small>同一用户短时间内发布相似内容时自动折叠</small></span><input type="checkbox" checked></label></div></article><article class="panel form-panel"><div class="section-title"><h2>自动处理阈值</h2></div><div class="form-grid"><label class="form-field"><span>举报自动隐藏</span><div class="unit-input"><input value="5"><b>次</b></div></label><label class="form-field"><span>每日评论上限</span><div class="unit-input"><input value="30"><b>条</b></div></label><label class="form-field full"><span>评论区提示语</span><textarea>友善交流，分享真实的养宠经验。</textarea></label></div></article></section>
            <section v-else class="moderation-layout"><div><article class="panel comment-detail-card"><div class="comment-author"><div class="user-avatar">用</div><div><strong>{{ subPageData.user || '星星的铲屎官' }}</strong><span>普通用户 · 注册 286 天</span></div><small>{{ subPageData.time || '2026-08-11 15:26' }}</small></div><p class="full-comment">{{ subPageData.content || '介绍得很详细，尤其是性格和护理部分，对新手很有帮助。' }}</p><div class="comment-meta"><span>所属品种：<b>{{ subPageData.target || '布偶猫' }}</b></span><span>点赞 {{ subPageData.likes || 36 }}</span><span>IP 属地：浙江</span></div></article></div><aside class="panel moderation-panel"><div class="panel-heading bordered"><h2>{{ subPage === 'comment-handle' ? '处理评论' : '评论状态' }}</h2></div><div class="risk-result"><span>系统检测结果</span><strong>{{ subPageData.status === '被举报' ? '存在举报记录' : '未发现明显违规' }}</strong><small>文本风险评分：18 / 100</small></div><label class="radio-card"><input type="radio" name="handle" checked><span><strong>保留评论</strong><small>评论正常展示</small></span></label><label class="radio-card"><input type="radio" name="handle"><span><strong>隐藏评论</strong><small>仅发布者自己可见</small></span></label><label class="radio-card"><input type="radio" name="handle"><span><strong>删除并警告</strong><small>删除内容并记录用户违规</small></span></label><label class="audit-note"><span>处理备注</span><textarea placeholder="记录处理依据"></textarea></label></aside></section>
          </template>

          <!-- 用户详情二级页面 -->
          <template v-else-if="subPageGroup === 'user'">
            <section v-if="subPage === 'user-activity'" class="user-activity-page">
              <div class="activity-summary-grid">
                <article class="panel activity-user-summary">
                  <span class="activity-user-avatar">{{ subPageData.avatar || '用' }}</span>
                  <div><small>当前用户</small><h2>{{ subPageData.name || '微信用户' }}</h2><p>{{ subPageData.id || 'U20260811082' }} · {{ subPageData.status || '活跃' }}</p></div>
                </article>
                <article class="panel activity-metric"><span>近 30 日行为</span><strong>86</strong><small class="success-text">较上月 +12%</small></article>
                <article class="panel activity-metric"><span>累计访问时长</span><strong>12.6<em>小时</em></strong><small>单次平均 8 分钟</small></article>
                <article class="panel activity-metric"><span>最近活跃</span><strong class="metric-time">3 分钟前</strong><small>微信小程序</small></article>
              </div>

              <section class="activity-content-layout">
                <article class="panel activity-list-panel">
                  <div class="activity-toolbar">
                    <div class="activity-tabs">
                      <button v-for="type in ['全部行为','浏览','搜索','收藏','评论']" :key="type" :class="{ active: activityType === type }" @click="activityType = type">{{ type }}</button>
                    </div>
                    <label class="compact-search activity-search"><AdminIcon name="search" :size="15" /><input v-model="activityKeyword" placeholder="搜索行为内容"></label>
                    <select v-model="activityRange"><option>近 7 天</option><option>近 30 天</option><option>近 90 天</option></select>
                  </div>
                  <div class="activity-list">
                    <article v-for="item in paginatedUserActivities" :key="`${item.time}-${item.title}`" class="activity-row">
                      <div class="activity-axis"><span :class="`type-${item.type}`"><AdminIcon :name="item.icon" :size="17" /></span><i /></div>
                      <div class="activity-copy"><div><strong>{{ item.title }}</strong><span class="activity-type-tag">{{ item.type }}</span></div><p>{{ item.detail }}</p><small>关联内容：<b>{{ item.target }}</b></small></div>
                      <div class="activity-origin"><strong>{{ item.time }}</strong><span>{{ item.source }}</span><small>IP 属地：{{ item.ip }}</small></div>
                    </article>
                    <div v-if="!filteredUserActivities.length" class="activity-empty"><AdminIcon name="search" :size="15" /><strong>暂无匹配记录</strong><p>调整行为类型或搜索关键词后重试</p></div>
                  </div>
                  <div class="activity-pagination"><span>共 {{ filteredUserActivities.length }} 条行为记录</span><div class="pagination compact"><button :disabled="activityPage === 1" aria-label="上一页" @click="setListPage(activityPage, activityPage - 1, activityTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in activityTotalPages" :key="page" :class="{ active: activityPage === page }" @click="setListPage(activityPage, page, activityTotalPages)">{{ page }}</button><button :disabled="activityPage === activityTotalPages" aria-label="下一页" @click="setListPage(activityPage, activityPage + 1, activityTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></div>
                </article>

                <aside class="activity-side">
                  <article class="panel activity-insight-card"><div class="panel-heading bordered"><h2>行为构成</h2></div><div class="activity-donut"><div><strong>86</strong><span>行为总数</span></div></div><div class="activity-legend"><p><i class="browse"/><span>浏览百科</span><strong>42</strong><small>49%</small></p><p><i class="search"/><span>搜索筛选</span><strong>21</strong><small>24%</small></p><p><i class="interact"/><span>收藏评论</span><strong>15</strong><small>17%</small></p><p><i class="other"/><span>其他行为</span><strong>8</strong><small>10%</small></p></div></article>
                  <article class="panel activity-insight-card"><div class="panel-heading bordered"><h2>活跃洞察</h2></div><div class="activity-insights"><p><span>最常访问时段</span><strong>20:00–22:00</strong></p><p><span>最关注分类</span><strong>猫类百科</strong></p><p><span>高频兴趣标签</span><strong>低掉毛、小户型</strong></p><p><span>常用访问设备</span><strong>iPhone · 微信</strong></p></div></article>
                </aside>
              </section>
            </section>
            <section v-else class="user-detail-layout">
              <aside class="panel user-profile-card">
                <div class="user-profile-avatar">{{ subPageData.avatar || '用' }}</div>
                <h2>{{ subPageData.name || '微信用户' }}</h2>
                <span class="state-pill" :class="subPageData.status">{{ subPageData.status || '活跃' }}</span>
                <div class="user-profile-data"><p><span>用户编号</span><strong>{{ subPageData.id || 'U20260811082' }}</strong></p><p><span>注册来源</span><strong>{{ subPageData.source || '微信搜索' }}</strong></p><p><span>注册时间</span><strong>{{ subPageData.registered || '2026-05-18' }}</strong></p><p><span>最近活跃</span><strong>{{ subPageData.active || '3 分钟前' }}</strong></p></div>
                <button class="secondary-button full-button">添加运营备注</button>
              </aside>
              <div class="user-detail-main">
                <section class="user-behavior-stats"><article class="panel"><span>收藏品种</span><strong>{{ subPageData.favorites ?? 18 }}</strong><small>累计收藏</small></article><article class="panel"><span>发表评论</span><strong>{{ subPageData.comments ?? 12 }}</strong><small>正常评论 11 条</small></article><article class="panel"><span>近 30 日访问</span><strong>46</strong><small>活跃天数 12 天</small></article></section>
                <article class="panel user-track-panel"><div class="panel-heading bordered"><h2>最近行为</h2><button class="text-button" @click="openSubPage('user-activity', subPageData)">查看全部</button></div><div class="user-track-list"><p><i><AdminIcon name="search" :size="15" /></i><span><strong>搜索了“适合小户型的猫”</strong><small>今天 15:26</small></span></p><p><i><AdminIcon name="document" :size="15" /></i><span><strong>浏览了布偶猫百科详情</strong><small>今天 15:22</small></span></p><p><i><AdminIcon name="heart" :size="15" /></i><span><strong>收藏了英国短毛猫</strong><small>昨天 20:18</small></span></p><p><i><AdminIcon name="message" :size="15" /></i><span><strong>在金毛寻回犬下发表评论</strong><small>08-09 18:42</small></span></p></div></article>
                <article class="panel user-interest-panel"><div class="panel-heading bordered"><h2>兴趣偏好</h2></div><div class="interest-content"><div><span>关注分类</span><p><b>猫类</b><b>小型犬</b><b>低掉毛</b></p></div><div><span>常用筛选</span><p><b>温顺亲人</b><b>新手友好</b><b>适合小户型</b></p></div><div><span>最近关注品种</span><p><b>布偶猫</b><b>英国短毛猫</b><b>威尔士柯基犬</b></p></div></div></article>
                <article class="panel user-comments-panel">
                  <div class="panel-heading bordered"><div><h2>该用户的评论</h2><span>共 {{ subPageData.comments ?? 12 }} 条</span></div><button class="text-button" @click="selectNav('评论管理')">前往评论管理 <AdminIcon name="chevron-right" :size="13" /></button></div>
                  <div class="user-comment-list">
                    <article v-for="comment in userCommentHistory" :key="comment.time" class="user-comment-row">
                      <span class="user-comment-avatar"><AdminIcon name="message" :size="15" /></span>
                      <div class="user-comment-content"><p>{{ comment.content }}</p><div><span>评论于 <b>{{ comment.target }}</b></span><span>♡ {{ comment.likes }}</span><span>回复 {{ comment.replies }}</span></div></div>
                      <div class="user-comment-meta"><span class="state-pill" :class="comment.status">{{ comment.status }}</span><small>{{ comment.time }}</small><button class="text-button" @click="openSubPage('comment-detail', { ...comment, user: subPageData.name || '星星的铲屎官' })">查看详情</button></div>
                    </article>
                  </div>
                </article>
              </div>
            </section>
          </template>

          <!-- 反馈二级页面 -->
          <template v-else-if="subPageGroup === 'feedback'">
            <section v-if="subPage === 'feedback-export'" class="editor-layout compact-editor"><article class="panel form-panel"><div class="section-title"><h2>选择导出范围</h2><p>根据条件生成反馈数据文件</p></div><div class="form-grid"><label class="form-field"><span>时间范围 *</span><select><option>最近 30 天</option><option>最近 7 天</option><option>本月</option><option>自定义</option></select></label><label class="form-field"><span>反馈状态</span><select><option>全部状态</option><option>待处理</option><option>处理中</option><option>已解决</option></select></label><label class="form-field full"><span>反馈类型</span><div class="check-options"><label><input type="checkbox" checked>内容纠错</label><label><input type="checkbox" checked>功能建议</label><label><input type="checkbox" checked>图片问题</label><label><input type="checkbox" checked>使用问题</label></div></label><label class="form-field full"><span>导出字段</span><div class="check-options"><label><input type="checkbox" checked>反馈编号</label><label><input type="checkbox" checked>反馈内容</label><label><input type="checkbox" checked>用户信息</label><label><input type="checkbox" checked>处理状态</label><label><input type="checkbox">处理记录</label></div></label></div></article><aside class="panel export-summary"><div class="panel-heading bordered"><h2>导出概览</h2></div><div><span>预计导出</span><strong>42 条</strong></div><div><span>文件格式</span><strong>XLSX</strong></div><p>文件生成后将自动下载，有效期为 24 小时。</p></aside></section>
            <section v-else class="feedback-detail-layout"><div><article class="panel feedback-content-card"><div class="feedback-head"><span class="feedback-type">{{ subPageData.type || '内容纠错' }}</span><span class="state-pill" :class="subPageData.status || '待处理'">{{ subPageData.status || '待处理' }}</span></div><h2>{{ subPageData.content || '用户提交的反馈内容' }}</h2><div class="feedback-user-grid"><p><span>反馈编号</span><strong>{{ subPageData.id || 'FB20260811021' }}</strong></p><p><span>提交用户</span><strong>{{ subPageData.user || '用户 172****9031' }}</strong></p><p><span>提交时间</span><strong>{{ subPageData.time || '今天 14:36' }}</strong></p><p><span>客户端</span><strong>微信小程序 1.0.0</strong></p></div><div class="feedback-images"><span>相关截图</span><button><AdminIcon name="image" :size="14" />查看用户截图</button></div></article><article class="panel timeline-panel"><div class="panel-heading bordered"><h2>处理记录</h2></div><div class="timeline"><p class="done"><i/><span><strong>用户提交反馈</strong><small>今天 14:36</small></span></p><p :class="subPageData.owner !== '未分配' ? 'done' : ''"><i/><span><strong>{{ subPageData.owner !== '未分配' ? `已分配给 ${subPageData.owner}` : '等待分配负责人' }}</strong><small>系统自动记录</small></span></p><p><i/><span><strong>等待处理结果</strong><small>处理后可向用户发送回复</small></span></p></div></article></div><aside class="panel process-panel"><div class="panel-heading bordered"><h2>处理反馈</h2></div><label class="form-field"><span>负责人</span><select><option>{{ subPageData.owner || '请选择负责人' }}</option><option>林晓</option><option>小周</option><option>阿哲</option></select></label><label class="form-field"><span>处理状态</span><select><option>{{ subPageData.status || '待处理' }}</option><option>处理中</option><option>已解决</option><option>已关闭</option></select></label><label class="form-field"><span>内部备注</span><textarea placeholder="仅管理员可见"></textarea></label><label class="form-field"><span>回复用户</span><textarea placeholder="处理完成后发送给用户"></textarea></label><button class="primary-button full-button">保存处理结果</button></aside></section>
          </template>

          <!-- 工单二级页面 -->
          <template v-else-if="subPageGroup === 'ticket'">
            <section v-if="subPage === 'ticket-settings'" class="ticket-settings-layout">
              <article class="panel form-panel"><div class="section-title"><h2>基础规则</h2><p>设置新工单的默认处理方式</p></div><div class="form-grid"><label class="form-field"><span>默认优先级</span><select><option>普通</option><option>中</option><option>高</option></select></label><label class="form-field"><span>默认状态</span><select><option>待处理</option><option>处理中</option></select></label><label class="form-field"><span>处理时限</span><select><option>24 小时</option><option>48 小时</option><option>72 小时</option></select></label><label class="form-field"><span>编号前缀</span><input value="WO" maxlength="4"></label></div></article>
              <aside class="panel ticket-setting-side"><div class="panel-heading bordered"><h2>提醒设置</h2></div><div class="setting-rows"><label><span><strong>新工单提醒</strong><small>创建工单后发送站内通知</small></span><input type="checkbox" checked></label><label><span><strong>即将超时提醒</strong><small>截止前 4 小时提醒管理员</small></span><input type="checkbox" checked></label><label><span><strong>用户反馈同步</strong><small>处理结果同步至反馈记录</small></span><input type="checkbox" checked></label></div></aside>
            </section>

            <section v-else-if="subPage === 'ticket-create'" class="editor-layout compact-editor ticket-editor-page"><article class="panel form-panel ticket-editor-panel"><div class="section-title"><h2>工单信息</h2><p>填写问题内容并设置处理优先级</p></div><div class="form-grid"><label class="form-field full"><span>工单标题 *</span><input v-model="subPageData.title" placeholder="概括需要处理的问题"></label><label class="form-field"><span>来源 *</span><select v-model="subPageData.source"><option>内部创建</option><option>用户反馈</option><option>系统告警</option><option>评论管理</option></select></label><label class="form-field"><span>工单类型 *</span><select v-model="subPageData.type"><option>系统异常</option><option>内容纠错</option><option>功能建议</option><option>图片问题</option><option>数据问题</option></select></label><label class="form-field"><span>优先级 *</span><select v-model="subPageData.priority"><option>普通</option><option>中</option><option>高</option></select></label><label class="form-field"><span>关联用户</span><input v-model="subPageData.user" placeholder="选填，例如：用户 138****0000"></label><label class="form-field full"><span>问题描述 *</span><textarea v-model="subPageData.description" placeholder="说明问题表现、影响范围和期望结果"></textarea></label></div></article></section>

            <section v-else-if="subPage === 'ticket-handle'" class="ticket-process-layout"><article class="panel ticket-context-panel"><div class="section-title"><div><h2>{{ subPageData.title }}</h2><p>{{ subPageData.id }} · {{ subPageData.created }}</p></div><span class="state-pill" :class="subPageData.status">{{ subPageData.status }}</span></div><div class="ticket-context-grid"><div><span>来源</span><strong>{{ subPageData.source }}</strong></div><div><span>类型</span><strong>{{ subPageData.type }}</strong></div><div><span>优先级</span><strong>{{ subPageData.priority }}</strong></div><div><span>关联用户</span><strong>{{ subPageData.user || '无' }}</strong></div></div><div class="ticket-description"><span>问题说明</span><p>{{ subPageData.title }}</p></div></article><aside class="panel ticket-process-panel"><div class="panel-heading bordered"><h2>处理结果</h2></div><div class="ticket-process-form"><label class="form-field"><span>更新状态 *</span><select v-model="subPageData.status"><option>待处理</option><option>处理中</option><option>已解决</option><option>已关闭</option></select></label><label class="form-field"><span>处理结论 *</span><textarea v-model="subPageData.resolution" placeholder="填写排查过程与解决结果"></textarea></label><label class="form-field"><span>内部备注</span><textarea v-model="subPageData.note" placeholder="仅管理员可见"></textarea></label></div></aside></section>

            <section v-else-if="subPage === 'ticket-more'" class="panel ticket-more-panel"><div class="section-title"><div><h2>{{ subPageData.id }}</h2><p>{{ subPageData.title }}</p></div></div><div class="ticket-more-actions"><button type="button" @click="handlePrototypeAction(`工单编号 ${subPageData.id} 已复制`)"><span><AdminIcon name="document" :size="19" /></span><strong>复制工单编号</strong><small>复制编号用于沟通与检索</small></button><button type="button" @click="handlePrototypeAction(`工单 ${subPageData.id} 已关闭`)"><span><AdminIcon name="check" :size="19" /></span><strong>关闭工单</strong><small>停止后续处理并归档记录</small></button><button type="button" class="danger" @click="handlePrototypeAction(`工单 ${subPageData.id} 已删除`)"><span><AdminIcon name="trash" :size="19" /></span><strong>删除工单</strong><small>永久移除当前工单记录</small></button></div></section>

            <section v-else class="ticket-detail-layout"><div class="ticket-detail-main"><article class="panel ticket-detail-card"><div class="ticket-detail-hero"><div><span class="ticket-id-label">{{ subPageData.id }}</span><h2>{{ subPageData.title }}</h2></div><span class="state-pill" :class="subPageData.status">{{ subPageData.status }}</span></div><div class="ticket-detail-grid"><div><span>来源</span><strong>{{ subPageData.source }}</strong></div><div><span>类型</span><strong>{{ subPageData.type }}</strong></div><div><span>优先级</span><strong>{{ subPageData.priority }}</strong></div><div><span>创建时间</span><strong>{{ subPageData.created }}</strong></div><div v-if="subPageData.user"><span>提交用户</span><strong>{{ subPageData.user }}</strong></div></div><div class="ticket-description"><span>问题描述</span><p>{{ subPageData.title }}</p></div></article><article class="panel timeline-panel"><div class="panel-heading bordered"><h2>处理记录</h2></div><div class="timeline"><p class="done"><i/><span><strong>工单已创建</strong><small>{{ subPageData.created }}</small></span></p><p :class="subPageData.status !== '待处理' ? 'done' : ''"><i/><span><strong>{{ subPageData.status === '待处理' ? '等待开始处理' : '管理员开始处理' }}</strong><small>系统自动记录状态变化</small></span></p><p :class="['已解决','已关闭'].includes(subPageData.status) ? 'done' : ''"><i/><span><strong>完成处理</strong><small>{{ ['已解决','已关闭'].includes(subPageData.status) ? '处理已完成' : '等待处理结果' }}</small></span></p></div></article></div><aside class="panel ticket-detail-side"><div class="panel-heading bordered"><h2>工单概览</h2></div><dl><div><dt>当前状态</dt><dd>{{ subPageData.status }}</dd></div><div><dt>处理优先级</dt><dd>{{ subPageData.priority }}</dd></div><div><dt>负责人</dt><dd>当前管理员</dd></div><div><dt>处理时限</dt><dd>24 小时</dd></div></dl><button v-if="subPageData.status !== '已关闭'" class="primary-button full-button" @click="openSubPage('ticket-handle', subPageData)">进入处理</button><button class="secondary-button full-button" @click="openSubPage('ticket-more', subPageData)">更多操作</button></aside></section>
          </template>

          <!-- 日志设置二级页面 -->
          <template v-else-if="subPageGroup === 'log'">
            <section class="log-settings-layout">
              <div class="log-settings-main">
                <article class="panel form-panel">
                  <div class="section-title"><div><h2>日志记录</h2><p>设置系统需要记录的日志范围及保存周期</p></div></div>
                  <div class="setting-form-rows">
                    <label><span><strong>日志保留时间</strong><small>超过期限的日志将按日自动清理</small></span><select v-model="logRetentionDays"><option>7 天</option><option>30 天</option><option>90 天</option><option>180 天</option></select></label>
                    <label><span><strong>最低记录级别</strong><small>低于所选级别的运行信息不写入日志</small></span><select v-model="logMinimumLevel"><option>仅错误</option><option>警告及以上</option><option>信息及以上</option><option>记录全部</option></select></label>
                    <label><span><strong>慢请求阈值</strong><small>接口耗时超过阈值时记录为性能异常</small></span><select v-model="slowRequestThreshold"><option>500 ms</option><option>1000 ms</option><option>2000 ms</option><option>3000 ms</option></select></label>
                  </div>
                </article>
                <article class="panel form-panel">
                  <div class="section-title"><div><h2>记录范围</h2><p>控制需要写入系统日志的操作类型</p></div></div>
                  <div class="setting-rows log-setting-switches">
                    <label><span><strong>定时任务日志</strong><small>记录任务开始、结束、耗时及执行结果</small></span><input v-model="logTaskEnabled" type="checkbox"></label>
                    <label><span><strong>管理员登录日志</strong><small>记录登录账号、时间、IP 地址及登录结果</small></span><input v-model="logLoginEnabled" type="checkbox"></label>
                    <label><span><strong>异常自动告警</strong><small>发现错误日志时同步生成后台通知</small></span><input v-model="logAlertEnabled" type="checkbox"></label>
                  </div>
                </article>
              </div>
              <aside class="panel log-setting-summary">
                <div class="panel-heading bordered"><h2>当前配置</h2></div>
                <dl><div><dt>保留期限</dt><dd>{{ logRetentionDays }}</dd></div><div><dt>记录级别</dt><dd>{{ logMinimumLevel }}</dd></div><div><dt>慢请求阈值</dt><dd>{{ slowRequestThreshold }}</dd></div><div><dt>异常告警</dt><dd>{{ logAlertEnabled ? '已开启' : '已关闭' }}</dd></div></dl>
                <div class="setting-notice"><AdminIcon name="alert" :size="18" /><p>设置保存后仅影响后续产生的日志，不会修改已有记录。</p></div>
              </aside>
            </section>
          </template>

          <!-- 管理员二级页面 -->
          <template v-else-if="subPageGroup === 'admin'">
            <section v-if="subPage === 'admin-log'" class="panel log-panel"><div class="filter-bar"><select><option>全部操作类型</option><option>内容编辑</option><option>审核操作</option><option>账号设置</option></select><label class="inline-search"><AdminIcon name="search" :size="15" /><input placeholder="搜索操作内容"></label><span class="result-count">近 30 天共 68 条记录</span></div><div class="log-list"><article v-for="(log,index) in ['编辑了品种“布偶猫”的性格描述','通过了“边境牧羊犬资料补充”审核','新增标签“适合新手”','修改了评论自动审核规则','登录管理平台']" :key="log"><span class="log-dot"/><div><strong>{{ log }}</strong><p>操作 IP：192.168.1.{{ 12 + index }} · {{ index === 0 ? '今天 14:26' : `${index} 天前 10:35` }}</p></div><button>查看详情</button></article></div><div class="pagination"><span>显示最近 30 天记录</span><button disabled aria-label="上一页"><AdminIcon name="chevron-left" :size="13" /></button><button class="active">1</button><button>2</button><button aria-label="下一页"><AdminIcon name="chevron-right" :size="13" /></button></div></section>
            <section v-else-if="subPage === 'role-manage'" class="role-manage-layout"><aside class="panel role-nav"><div class="panel-heading bordered"><h2>角色列表</h2><button class="text-button"><AdminIcon name="plus" :size="14" />新建</button></div><div class="role-list"><button class="active"><span><i>超</i><span><strong>超级管理员</strong><small>1 位成员</small></span></span></button><button><span><i>编</i><span><strong>内容编辑</strong><small>3 位成员</small></span></span></button><button><span><i>审</i><span><strong>审核员</strong><small>2 位成员</small></span></span></button><button><span><i>服</i><span><strong>客服专员</strong><small>1 位成员</small></span></span></button></div></aside><article class="panel permission-panel"><div class="section-title"><div><h2>超级管理员</h2><p>拥有管理平台全部功能权限</p></div><button class="secondary-button">编辑角色信息</button></div><div class="permission-groups"><section v-for="group in ['工作台','品种与标签','内容审核','互动管理','系统管理']" :key="group"><label><input type="checkbox" checked><strong>{{ group }}</strong><span>全选</span></label><div><label v-for="item in ['查看','新增','编辑','删除']" :key="item"><input type="checkbox" checked>{{ item }}</label></div></section></div></article></section>
            <section v-else class="editor-layout compact-editor account-settings-editor"><article class="panel form-panel"><div class="section-title"><h2>账号信息</h2><p>修改当前管理员的登录资料</p></div><div class="form-grid"><label class="form-field"><span>姓名 *</span><input :value="subPageData.name || ''" placeholder="请输入姓名"></label><label class="form-field"><span>登录账号 *</span><input :value="subPageData.account || ''" placeholder="请输入登录账号"></label><label class="form-field full"><span>手机号码</span><input placeholder="用于安全验证与找回密码"></label></div><div class="account-security-actions"><div><span class="security-action-icon"><AdminIcon name="shield" :size="19" /></span><span><strong>登录密码</strong><small>定期修改密码可提升账号安全性</small></span></div><button class="secondary-button" @click="handlePrototypeAction('修改密码功能已打开')">修改密码</button></div></article></section>
          </template>
        </template>

        <!-- 工作台 -->
        <template v-else-if="activeNav === '工作台'">
          <section class="welcome-row"><div><h1>下午好，管理员</h1></div></section>
          <section class="stats-grid">
            <button v-for="stat in stats" :key="stat.label" class="stat-card" :class="{ 'without-icon': !stat.icon }" type="button" @click="openStatPage(stat)"><div v-if="stat.icon" class="stat-icon"><AdminIcon :name="stat.icon" :size="42" /></div><div class="stat-content"><span class="stat-label">{{ stat.label }}</span><strong>{{ stat.label === '待审核内容' ? pendingReviewCount : stat.value }}</strong><div class="stat-compare"><span :class="stat.tone"><AdminIcon :name="stat.tone === 'down' ? 'arrow-down' : 'arrow-up'" :size="12" />{{ stat.delta }}</span><span>{{ stat.compare }}</span></div></div></button>
          </section>
          <section class="panel user-overview-panel">
            <div class="user-overview-heading"><div><span class="section-eyebrow">用户数据</span><h2>用户量概览</h2></div><div class="period-picker"><button class="period-button" type="button" :aria-expanded="userOverviewRangeOpen" @click="userOverviewRangeOpen = !userOverviewRangeOpen">{{ userOverviewRange }}<AdminIcon :name="userOverviewRangeOpen ? 'chevron-up' : 'chevron-down'" :size="13" /></button><div v-if="userOverviewRangeOpen" class="period-menu"><button v-for="range in ['近 7 日','近 30 日','近 90 日']" :key="range" type="button" :class="{ active: userOverviewRange === range }" @click="selectUserOverviewRange(range)"><span>{{ range }}</span><AdminIcon v-if="userOverviewRange === range" name="check" :size="13" /></button></div></div></div>
            <div class="user-metrics">
              <article><span>历史用户量</span><strong>{{ userOverview.total }}</strong><small>累计注册用户</small></article>
              <article><span>今日用户量</span><strong>{{ userOverview.today }}</strong><small>昨日 {{ userOverview.yesterday }} 人</small></article>
              <article class="change-metric"><span>较昨日变化</span><strong :class="userOverview.change >= 0 ? 'increase' : 'decrease'"><AdminIcon :name="userOverview.change >= 0 ? 'arrow-up' : 'arrow-down'" :size="16" />{{ Math.abs(userOverview.change) }} 人</strong><small>{{ userOverview.change >= 0 ? '今日用户量有所上涨' : '今日用户量有所下降' }}</small></article>
            </div>
            <div class="user-sparkline" :aria-label="`${userOverviewRange}用户量趋势`">
              <div v-for="(value,index) in userOverviewSeries.values" :key="`${userOverviewRange}-${index}`" class="spark-column"><span :style="{ height: `${value}%` }"/><small>{{ userOverviewSeries.labels[index] }}</small></div>
            </div>
          </section>
          <section class="analytics-grid">
            <article class="panel trend-panel"><div class="panel-heading"><h2>近 7 日百科访问趋势</h2><div class="segment-control"><button :class="{ active: chartMode === '访问量' }" @click="chartMode = '访问量'">访问量</button><button :class="{ active: chartMode === '搜索量' }" @click="chartMode = '搜索量'">搜索量</button></div></div><div class="chart-wrap"><svg class="trend-chart" viewBox="0 0 720 250" preserveAspectRatio="none" aria-label="近 7 日百科访问折线图"><defs><linearGradient id="dashboard-primary-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b65a18" stop-opacity=".2"/><stop offset="100%" stop-color="#b65a18" stop-opacity=".02"/></linearGradient><linearGradient id="dashboard-secondary-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6f9c76" stop-opacity=".14"/><stop offset="100%" stop-color="#6f9c76" stop-opacity=".01"/></linearGradient></defs><g class="grid-lines"><line v-for="y in [24,66,108,150,192]" :key="y" x1="48" :y1="y" x2="704" :y2="y" /></g><polygon class="dashboard-chart-area primary" :points="chartAreaPoints"/><polygon class="dashboard-chart-area secondary" :points="chartSecondaryAreaPoints"/><polyline class="chart-line primary" :points="chartPoints" /><polyline class="chart-line secondary" :points="chartSecondaryPoints" /><circle v-for="(value, index) in chartValues" :key="`primary-dot-${index}`" class="primary-dot" :cx="dashboardChartX(index)" :cy="198-value*1.45" r="4" /><circle v-for="(value, index) in chartSecondaryValues" :key="`secondary-dot-${index}`" class="secondary-dot" :cx="dashboardChartX(index)" :cy="198-value*1.45" r="4" /><g class="axis-labels"><text v-for="(day,index) in ['08-05','08-06','08-07','08-08','08-09','08-10','08-11']" :key="day" :x="dashboardChartX(index)" y="235">{{ day }}</text></g></svg><div class="chart-legend"><span><i class="line-key primary-line-key"/>{{ chartMode === '访问量' ? '访问量（PV）' : '搜索次数' }}</span><span><i class="line-key secondary-line-key"/>{{ chartMode === '访问量' ? '访问量（UV）' : '搜索用户' }}</span></div></div></article>
            <article class="panel popular-pets-panel"><div class="panel-heading"><h2>近期浏览量最高的宠物</h2><span class="panel-period">近 7 日</span></div><div class="popular-pet-columns"><section v-for="category in [{ type: '猫类', icon: 'image' }, { type: '犬类', icon: 'image' }]" :key="category.type" class="popular-pet-column"><div class="popular-column-title"><AdminIcon :name="category.icon" :size="18" /><strong>{{ category.type }}排行</strong></div><article v-for="(pet,index) in popularPets.filter(item => item.type === category.type)" :key="pet.name" class="category-pet-row"><span class="rank-number" :class="`rank-${index + 1}`">{{ index + 1 }}</span><img class="popular-pet-avatar" :src="pet.image" :alt="pet.name"><div><strong>{{ pet.name }}</strong></div><span class="popular-pet-count">{{ pet.views }}<small>次</small></span></article></section></div></article>
          </section>
          <section class="details-grid"><article class="panel table-panel"><div class="panel-heading"><h2>最近更新的品种</h2></div><div class="table-scroll"><table class="dashboard-breed-table"><thead><tr><th>品种</th><th>类型</th><th>更新时间</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="breed in breeds.slice(0,6)" :key="breed.name"><td><div class="breed-cell"><img class="breed-thumb" :src="breed.image" :alt="breed.name"><strong>{{ breed.name }}</strong></div></td><td>{{ breed.type }}</td><td>{{ breed.updatedAt }}</td><td><span class="status-tag">{{ breed.status }}</span></td><td><button class="text-button" @click="openSubPage('breed-edit', breed)">编辑</button></td></tr></tbody></table></div><button class="view-all" @click="selectNav('品种管理')">查看全部 <AdminIcon name="chevron-right" :size="15" /></button></article><article class="panel task-panel"><div class="panel-heading"><h2>待处理事项</h2></div><div class="task-list"><button v-for="task in pendingTasks" :key="task.text" class="task-item" @click="selectNav(task.nav)"><span class="task-icon"><AdminIcon :name="task.icon" :size="20" /></span><span><strong>{{ task.count }}</strong> {{ task.text }}</span><AdminIcon class="task-arrow" name="chevron-right" :size="18" /></button></div></article></section>
        </template>

        <!-- 宠物管理 -->
        <template v-else-if="activeNav === '宠物管理'">
          <section class="page-title-row"><div><h1>宠物管理</h1></div><div class="header-actions"><button class="secondary-button" @click="openSubPage('breed-import')">导入品种</button><button class="primary-button" @click="openSubPage('breed-create')"><AdminIcon name="plus" :size="16" />新增品种</button></div></section>
          <section class="panel data-panel breed-management-panel"><div class="filter-bar"><label class="inline-search"><AdminIcon name="search" :size="15" /><input v-model="breedKeyword" placeholder="搜索品种名称"></label><select v-model="breedType"><option>全部类型</option><option v-for="type in breedTypeOptions" :key="type" :value="type">{{ type }}</option></select><select v-model="breedStatus"><option>全部状态</option><option>已发布</option><option>草稿</option><option>已下架</option></select><button class="clear-button" @click="resetBreedFilters">重置</button><span class="result-count">共 {{ filteredBreeds.length }} 条结果</span></div><div class="table-scroll"><table class="management-table"><thead><tr><th><input type="checkbox"></th><th>品种名称</th><th>分类</th><th>状态</th><th>创建时间</th><th>更新时间</th><th>操作</th></tr></thead><tbody><tr v-for="breed in paginatedBreeds" :key="breed.name"><td><input type="checkbox"></td><td><div class="breed-cell"><img class="breed-thumb large" :src="breed.image" :alt="breed.name"><div><strong>{{ breed.name }}</strong></div></div></td><td>{{ breed.type }}</td><td><span class="state-pill" :class="breed.status">{{ breed.status }}</span></td><td>{{ breed.createdAt }}</td><td>{{ breed.updatedAt }}</td><td><div class="row-actions breed-row-actions"><button @click="openSubPage('breed-view', breed)">查看</button><button @click="openSubPage('breed-edit', breed)">编辑</button><button class="danger-text" @click="deleteBreedFromList(breed)">删除</button></div></td></tr><tr v-if="filteredBreeds.length === 0"><td colspan="7" class="empty-table-state">没有符合当前筛选条件的品种</td></tr></tbody></table></div><div class="pagination"><span>共 {{ filteredBreeds.length }} 条 · 第 {{ breedPage }}/{{ breedTotalPages }} 页</span><button :disabled="breedPage === 1" aria-label="上一页" @click="setListPage(breedPage, breedPage - 1, breedTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in breedTotalPages" :key="page" :class="{ active: breedPage === page }" @click="setListPage(breedPage, page, breedTotalPages)">{{ page }}</button><button :disabled="breedPage === breedTotalPages" aria-label="下一页" @click="setListPage(breedPage, breedPage + 1, breedTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></section>
        </template>

        <!-- 分类管理 -->
        <template v-else-if="activeNav === '分类管理' || activeNav === '标签管理'">
          <section class="page-title-row"><div><h1>分类设置</h1></div><div class="header-actions"><button class="primary-button" @click="openSubPage('category-create')"><AdminIcon name="plus" :size="16" />创建分类</button></div></section>
          <section class="panel category-list-panel"><div class="category-list-heading"><div><h2>分类列表</h2><p>管理宠物分类及每个分类下的分类标签</p></div><span>共 {{ categoryManagementRows.length }} 个分类</span></div><div class="table-scroll"><table class="management-table category-management-table"><thead><tr><th>分类名</th><th>分类标签</th><th>关联品种</th><th>操作</th></tr></thead><tbody><tr v-for="category in categoryManagementRows" :key="category.name"><td><button type="button" class="category-name-link" @click="openSubPage('category-edit', category)">{{ category.name }}</button></td><td><div class="category-tag-summary"><span v-for="group in category.groups" :key="group.name">{{ group.name }}<small>{{ group.options.length }}</small></span><em v-if="!category.groups.length">暂无标签</em></div></td><td>{{ category.breedCount }} 个</td><td><div class="row-actions"><button @click="openSubPage('category-edit', category)">编辑</button><button class="danger-text" @click="deleteCategory(category)">删除</button></div></td></tr><tr v-if="!categoryManagementRows.length"><td colspan="4" class="empty-table-state">暂无分类，请先创建分类</td></tr></tbody></table></div></section>
        </template>

        <!-- 评论管理 -->
        <template v-else-if="activeNav === '评论管理'">
          <section class="page-title-row"><div><h1>评论管理</h1></div><button class="secondary-button" @click="openSubPage('comment-rules')">评论规则</button></section>
          <section class="panel breed-comment-browser">
            <div class="breed-browser-heading"><div><span>按品种查看</span><h2>品种评论</h2><small>选择品种，集中查看该品种的全部评论</small></div><div class="breed-browser-tools"><div class="segment-control"><button v-for="type in ['全部品种','猫类','犬类']" :key="type" :class="{ active: breedEntryType === type }" @click="breedEntryType = type">{{ type }}</button></div><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="breedEntryKeyword" placeholder="搜索品种"></label></div></div>
            <div class="breed-browser-list">
              <button v-for="breed in filteredBreedCommentEntries" :key="breed.name" class="breed-browser-card" @click="openSubPage('breed-comments', breed)"><img class="breed-entry-avatar" :src="breed.image" :alt="breed.name"><span><strong>{{ breed.name }}</strong><small>{{ breed.type }} · {{ breed.count }} 条评论</small></span><i v-if="breed.pending">{{ breed.pending }} 条待处理</i><AdminIcon name="chevron-right" :size="15" /></button>
              <div v-if="!filteredBreedCommentEntries.length" class="breed-browser-empty"><AdminIcon name="search" :size="20" /><span>没有匹配的品种</span></div>
            </div>
            <div class="breed-browser-footer"><span>共 {{ filteredBreedCommentEntries.length }} 个品种</span><small>滚动区域可继续查看其他品种</small></div>
          </section>
          <section class="panel data-panel"><div class="tab-filter"><div><button v-for="tab in ['全部评论','正常','待复核','被举报','已隐藏']" :key="tab" :class="{active:commentTab===tab}" @click="commentTab=tab">{{ tab }}</button></div><label class="compact-search"><AdminIcon name="search" :size="14" /><input v-model="commentKeyword" placeholder="搜索评论、用户或品种"></label></div><div class="table-scroll"><table class="management-table comment-table"><thead><tr><th><input type="checkbox"></th><th>评论内容</th><th>用户</th><th>所属品种</th><th>点赞</th><th>发布时间</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="comment in paginatedComments" :key="comment.content"><td><input type="checkbox"></td><td><p class="comment-content">{{ comment.content }}</p></td><td>{{ comment.user }}</td><td><button class="target-link" @click="openSubPage('breed-comments', { name: comment.target, target: comment.target })">{{ comment.target }}<AdminIcon name="chevron-right" :size="12" /></button></td><td>{{ comment.likes }}</td><td>{{ comment.time }}</td><td><span class="state-pill" :class="comment.status">{{ comment.status }}</span></td><td><div class="row-actions"><button @click="openSubPage('comment-detail', comment)">查看</button><button v-if="comment.status !== '正常'" class="danger-text" @click="openSubPage('comment-handle', comment)">处理</button><button v-else @click="openSubPage('comment-handle', comment)">隐藏</button></div></td></tr><tr v-if="!filteredComments.length"><td colspan="8" class="empty-table-state">没有符合条件的评论</td></tr></tbody></table></div><div class="batch-bar"><span>共 {{ filteredComments.length }} 条</span><button disabled>批量隐藏</button><button disabled>批量删除</button><div class="pagination compact"><button :disabled="commentPage === 1" aria-label="上一页" @click="setListPage(commentPage, commentPage - 1, commentTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in commentTotalPages" :key="page" :class="{ active: commentPage === page }" @click="setListPage(commentPage, page, commentTotalPages)">{{ page }}</button><button :disabled="commentPage === commentTotalPages" aria-label="下一页" @click="setListPage(commentPage, commentPage + 1, commentTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></div></section>
        </template>

        <!-- 用户数据 -->
        <template v-else-if="activeNav === '用户数据'">
          <section class="page-title-row"><div><h1>用户数据</h1></div><div class="header-actions"><button class="secondary-button" @click="handlePrototypeAction('用户数据已开始导出')">导出用户数据</button><button class="primary-button" @click="handlePrototypeAction('用户分群配置已打开')">创建用户分群</button></div></section>
          <section class="mini-stats user-data-stats"><article><span>历史用户量</span><strong>48,620</strong><small class="success-text">本月新增 3,842</small></article><article><span>今日新增用户</span><strong>1,286</strong><small class="success-text">较昨日上涨 143 人</small></article><article><span>今日活跃用户</span><strong>8,690</strong><small>活跃率 17.9%</small></article><article><span>7 日留存率</span><strong>42.8%</strong><small class="success-text">较上周提升 2.6%</small></article></section>
          <section class="user-analytics-grid">
            <article class="panel user-growth-panel"><div class="panel-heading"><h2>用户增长趋势</h2><div class="segment-control"><button v-for="mode in ['新增用户','活跃用户']" :key="mode" :class="{ active: userGrowthMode === mode }" @click="userGrowthMode = mode">{{ mode }}</button></div></div><div class="user-growth-chart"><div class="chart-y-labels"><span>1,500</span><span>1,000</span><span>500</span><span>0</span></div><div class="growth-line-chart"><svg viewBox="0 0 700 160" preserveAspectRatio="none" aria-label="用户增长折线图"><defs><linearGradient id="user-growth-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c86f2b" stop-opacity=".28"/><stop offset="100%" stop-color="#c86f2b" stop-opacity=".03"/></linearGradient></defs><g class="growth-grid-lines"><line v-for="y in [12,58,104,150]" :key="y" x1="10" :y1="y" x2="690" :y2="y"/></g><polygon class="growth-area" :points="userGrowthAreaPoints"/><polyline class="growth-line" :points="userGrowthChartPoints"/><circle v-for="(point,index) in userGrowthChartCoordinates" :key="`${userGrowthMode}-${index}`" :cx="point.x" :cy="point.y" r="4"/></svg><div class="growth-line-labels"><small v-for="(_,index) in userGrowthData.values" :key="index">{{ index % 2 === 0 ? `08-${index+1}` : '' }}</small></div></div></div><div class="growth-summary"><span><i class="orange"/>{{ userGrowthMode }} {{ userGrowthData.total }}</span><span><i class="green"/>{{ userGrowthData.secondary }}</span><strong>{{ userGrowthData.average }}</strong></div></article>
            <article class="panel channel-panel"><div class="panel-heading bordered"><h2>用户来源渠道</h2><div class="period-picker channel-range-picker"><button class="text-button" type="button" :aria-expanded="userChannelRangeOpen" @click.stop="userChannelRangeOpen = !userChannelRangeOpen">{{ userChannelRange }}<AdminIcon :name="userChannelRangeOpen ? 'chevron-up' : 'chevron-down'" :size="13" /></button><div v-if="userChannelRangeOpen" class="period-menu channel-range-menu"><button v-for="range in ['近 7 日','近 30 日','近 90 日']" :key="range" type="button" :class="{ active: userChannelRange === range }" @click.stop="selectUserChannelRange(range)"><span>{{ range }}</span><AdminIcon v-if="userChannelRange === range" name="check" :size="13" /></button></div></div></div><div class="channel-chart"><div class="channel-ring" :style="userChannelRingStyle"><div><strong>{{ userChannelSeries.total }}</strong><span>新增用户</span></div></div><div class="channel-list"><p v-for="item in userChannelItems" :key="item.name"><i :class="item.tone"/><span>{{ item.name }}</span><strong>{{ item.value }}%</strong></p></div></div></article>
          </section>
          <section class="user-insight-grid"><article class="panel insight-card"><div><span>用户活跃时段</span><strong>20:00–22:00</strong><small>晚间为主要访问高峰</small></div><div class="hour-bars"><i v-for="height in [20,16,12,18,28,42,56,48,62,85,100,74]" :key="height" :style="{height:`${height}%`}"/></div></article><article class="panel insight-card"><div><span>人均浏览品种</span><strong>6.8 个</strong><small>较上月增加 0.9 个</small></div><div class="tiny-trend"><AdminIcon name="trend" :size="68" /></div></article></section>
          <section class="panel data-panel"><div class="panel-heading bordered"><h2>用户列表</h2><div class="header-actions"><select v-model="userStatusFilter"><option>全部用户状态</option><option>活跃</option><option>普通</option><option>沉默</option></select><select v-model="userSourceFilter"><option>全部注册来源</option><option>微信搜索</option><option>好友分享</option><option>小程序推荐</option><option>公众号</option></select><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="userListKeyword" placeholder="搜索昵称或用户编号"></label></div></div><div class="table-scroll"><table class="management-table user-table"><thead><tr><th>用户</th><th>注册来源</th><th>收藏品种</th><th>评论</th><th>注册时间</th><th>最近活跃</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="user in paginatedUsers" :key="user.id"><td><div class="admin-cell user-cell"><span>{{ user.avatar }}</span><div><strong>{{ user.name }}</strong><small>{{ user.id }}</small></div></div></td><td><span class="source-tag">{{ user.source }}</span></td><td>{{ user.favorites }}</td><td>{{ user.comments }}</td><td>{{ user.registered }}</td><td>{{ user.active }}</td><td><span class="state-pill" :class="user.status">{{ user.status }}</span></td><td><div class="row-actions"><button @click="openSubPage('user-detail', user)">查看详情</button><button class="more-button" aria-label="更多操作"><AdminIcon name="more" :size="16" /></button></div></td></tr><tr v-if="!filteredUsers.length"><td colspan="8"><div class="table-empty"><AdminIcon name="search" :size="22" /><strong>没有匹配的用户</strong><span>请调整用户状态、注册来源或搜索关键词</span></div></td></tr></tbody></table></div><div class="pagination"><span>共 {{ filteredUsers.length }} 位用户 · 第 {{ userCurrentPage }}/{{ userTotalPages }} 页</span><button :disabled="userCurrentPage === 1" aria-label="上一页" @click="changeUserPage(userCurrentPage - 1)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in userTotalPages" :key="page" :class="{ active: userCurrentPage === page }" @click="changeUserPage(page)">{{ page }}</button><button aria-label="下一页" :disabled="userCurrentPage === userTotalPages" @click="changeUserPage(userCurrentPage + 1)"><AdminIcon name="chevron-right" :size="13" /></button></div></section>
        </template>

        <!-- 用户反馈 -->
        <template v-else-if="activeNav === '用户反馈'">
          <section class="page-title-row"><div><h1>用户反馈</h1></div><button class="secondary-button" @click="openSubPage('feedback-export')">导出反馈</button></section>
          <section class="feedback-layout"><div class="feedback-main"><section class="panel data-panel"><div class="tab-filter"><div><button v-for="tab in ['全部反馈','待处理','处理中','已解决','已关闭']" :key="tab" :class="{active:feedbackTab===tab}" @click="feedbackTab=tab">{{ tab }}<span v-if="tab === '待处理'">9</span><span v-else-if="tab === '处理中'">6</span></button></div><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="feedbackKeyword" placeholder="搜索编号或反馈内容"></label></div><div class="feedback-list"><button v-for="feedback in filteredFeedbacks" :key="feedback.id" class="feedback-item" @click="openSubPage('feedback-detail', feedback)"><span class="feedback-type" :class="feedback.type">{{ feedback.type }}</span><div><strong>{{ feedback.content }}</strong><p>{{ feedback.id }} · {{ feedback.user }} · {{ feedback.time }}</p></div><span class="owner">负责人：{{ feedback.owner }}</span><span class="state-pill" :class="feedback.status">{{ feedback.status }}</span><AdminIcon class="task-arrow" name="chevron-right" :size="17" /></button><div v-if="!filteredFeedbacks.length" class="list-empty">没有符合条件的用户反馈</div></div></section></div><aside class="panel feedback-side"><div class="panel-heading bordered"><h2>反馈类型分布</h2></div><div class="ring-small"><div><strong>42</strong><span>本月反馈</span></div></div><div class="distribution-list"><p><i class="orange"/><span>内容纠错</span><strong>38%</strong></p><p><i class="green"/><span>功能建议</span><strong>29%</strong></p><p><i class="purple"/><span>使用问题</span><strong>21%</strong></p><p><i class="gray"/><span>其他</span><strong>12%</strong></p></div><div class="service-note"><span>平均首次响应</span><strong>26 分钟</strong><small>优于上月 8 分钟</small></div></aside></section>
        </template>

        <!-- 工单管理 -->
        <template v-else-if="activeNav === '工单管理'">
          <section class="page-title-row"><div><h1>工单管理</h1></div><div class="header-actions"><button class="secondary-button" @click="openSubPage('ticket-settings')">工单设置</button><button class="primary-button" @click="openSubPage('ticket-create', { source: '内部创建', status: '待处理', priority: '普通' })"><AdminIcon name="plus" :size="16" />创建工单</button></div></section>
          <section class="panel data-panel"><div class="ticket-filter"><div class="category-tabs"><button v-for="tab in ['全部工单','待处理','处理中','已解决','已关闭']" :key="tab" :class="{ active: ticketTab === tab }" @click="ticketTab = tab">{{ tab }}<span v-if="tab === '待处理' || tab === '处理中'">{{ ticketStatusCount(tab) }}</span></button></div><select v-model="ticketSource"><option>全部来源</option><option>用户反馈</option><option>系统告警</option><option>内容审核</option><option>评论管理</option><option>内部创建</option></select><select v-model="ticketType"><option>全部工单类型</option><option>系统异常</option><option>内容纠错</option><option>功能建议</option><option>图片问题</option><option>使用问题</option><option>评论举报</option><option>功能问题</option><option>数据问题</option><option>内容需求</option><option>内容建议</option></select><select v-model="ticketPriority"><option>全部优先级</option><option>高</option><option>中</option><option>普通</option></select><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="ticketKeyword" placeholder="搜索编号、标题或用户"></label></div><div class="table-scroll"><table class="management-table ticket-table"><thead><tr><th>工单号</th><th>标题 / 反馈内容</th><th>来源</th><th>类型</th><th>优先级</th><th>创建时间</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="order in paginatedWorkOrders" :key="order.id"><td><button class="ticket-id" @click="openSubPage('ticket-view', order)">{{ order.id }}</button></td><td><div class="ticket-content"><p class="ticket-title">{{ order.title }}</p><small v-if="order.user">提交用户：{{ order.user }}</small></div></td><td><span class="ticket-source" :class="{ feedback: order.source === '用户反馈' }">{{ order.source }}</span></td><td><span class="ticket-type">{{ order.type }}</span></td><td><span class="priority-pill" :class="order.priority">{{ order.priority }}</span></td><td>{{ order.created }}</td><td><span class="state-pill" :class="order.status">{{ order.status }}</span></td><td><div class="row-actions"><button @click="openSubPage('ticket-view', order)">查看</button><button v-if="order.status !== '已关闭'" @click="openSubPage('ticket-handle', order)">处理</button><button class="more-button" aria-label="更多操作" @click="openSubPage('ticket-more', order)"><AdminIcon name="more" :size="16" /></button></div></td></tr><tr v-if="!filteredWorkOrders.length"><td colspan="8" class="empty-table-state">没有符合条件的工单</td></tr></tbody></table></div><div class="pagination"><span>共 {{ filteredWorkOrders.length }} 条工单</span><button :disabled="ticketPage === 1" aria-label="上一页" @click="setListPage(ticketPage, ticketPage - 1, ticketTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in ticketTotalPages" :key="page" :class="{ active: ticketPage === page }" @click="setListPage(ticketPage, page, ticketTotalPages)">{{ page }}</button><button :disabled="ticketPage === ticketTotalPages" aria-label="下一页" @click="setListPage(ticketPage, ticketPage + 1, ticketTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></section>
        </template>

        <!-- 系统日志 -->
        <template v-else-if="activeNav === '系统日志'">
          <section class="page-title-row"><div><h1>系统日志</h1></div><div class="header-actions"><button class="secondary-button" @click="openSubPage('log-settings')">日志设置</button><button class="secondary-button" @click="handlePrototypeAction('系统日志已开始导出')">导出日志</button></div></section>
          <section class="system-health-banner panel"><div class="health-status"><span class="health-pulse"/><div><strong>系统运行正常</strong><small>所有核心服务均可用</small></div></div><div><span>运行时长</span><strong>32 天 18 小时</strong></div><div><span>最后检查</span><strong>刚刚</strong></div><button @click="handlePrototypeAction('服务状态详情已展开')">查看服务状态</button></section>
          <section class="log-overview-grid"><article class="panel performance-panel"><div class="panel-heading bordered"><h2>接口性能</h2><div class="segment-control"><button class="active">响应时间</button><button>请求量</button><button>错误率</button></div></div><div class="performance-chart"><svg viewBox="0 0 720 210" preserveAspectRatio="none"><g class="grid-lines"><line v-for="y in [25,70,115,160]" :key="y" x1="35" :y1="y" x2="700" :y2="y"/></g><polyline points="35,128 90,112 145,120 200,88 255,105 310,96 365,72 420,91 475,84 530,65 585,78 640,54 700,62"/><circle v-for="(point,index) in [[35,128],[90,112],[145,120],[200,88],[255,105],[310,96],[365,72],[420,91],[475,84],[530,65],[585,78],[640,54],[700,62]]" :key="index" :cx="point[0]" :cy="point[1]" r="3"/></svg><div class="performance-labels"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>现在</span></div></div><div class="performance-footer"><span>P50 <strong>126 ms</strong></span><span>P95 <strong>438 ms</strong></span><span>P99 <strong>920 ms</strong></span><span>慢接口 <strong class="warning-text">3 个</strong></span></div></article><article class="panel service-panel"><div class="panel-heading bordered"><h2>服务运行状态</h2></div><div class="service-list"><p><i class="online"/><span><strong>百科内容服务</strong><small>平均响应 142 ms</small></span><b>正常</b></p><p><i class="online"/><span><strong>用户服务</strong><small>平均响应 186 ms</small></span><b>正常</b></p><p><i class="warning"/><span><strong>文件服务</strong><small>平均响应 582 ms</small></span><b class="warn">较慢</b></p><p><i class="online"/><span><strong>评论服务</strong><small>平均响应 155 ms</small></span><b>正常</b></p><p><i class="online"/><span><strong>数据库</strong><small>连接池使用 42%</small></span><b>正常</b></p></div></article></section>
          <section class="panel data-panel"><div class="log-tabs"><div class="category-tabs"><button v-for="tab in ['异常日志','全部日志','接口性能','定时任务']" :key="tab" :class="{ active: logTab === tab }" @click="logTab = tab">{{ tab }}</button></div><select v-model="logLevel"><option>全部级别</option><option>错误</option><option>警告</option><option>信息</option></select><select v-model="logService"><option>全部服务</option><option>百科内容服务</option><option>内容服务</option><option>用户服务</option><option>文件服务</option><option>评论服务</option><option>数据库</option><option>定时任务</option></select><label class="compact-search"><AdminIcon name="search" :size="15" /><input v-model="logKeyword" placeholder="搜索事件或追踪编号"></label></div><div class="table-scroll"><table class="management-table log-table"><thead><tr><th>时间</th><th>级别</th><th>服务</th><th>事件</th><th>详细信息</th><th>追踪编号</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="log in paginatedSystemLogs" :key="log.trace"><td>{{ log.time }}</td><td><span class="log-level" :class="log.level"><i/>{{ log.level }}</span></td><td>{{ log.service }}</td><td><strong>{{ log.event }}</strong></td><td>{{ log.detail }}</td><td><button class="trace-id" @click="handlePrototypeAction(`已复制追踪编号 ${log.trace}`)">{{ log.trace }}</button></td><td><span class="state-pill" :class="log.status">{{ log.status }}</span></td><td><div class="row-actions"><button @click="handlePrototypeAction(`正在查看 ${log.trace} 的日志详情`)">详情</button><button v-if="log.level === '错误'" @click="handlePrototypeAction(`已根据 ${log.trace} 创建工单草稿`)">创建工单</button></div></td></tr><tr v-if="!filteredSystemLogs.length"><td colspan="8" class="empty-table-state">没有符合条件的系统日志</td></tr></tbody></table></div><div class="pagination"><span>共 {{ filteredSystemLogs.length }} 条模拟日志</span><button :disabled="logPage === 1" aria-label="上一页" @click="setListPage(logPage, logPage - 1, logTotalPages)"><AdminIcon name="chevron-left" :size="13" /></button><button v-for="page in logTotalPages" :key="page" :class="{ active: logPage === page }" @click="setListPage(logPage, page, logTotalPages)">{{ page }}</button><button :disabled="logPage === logTotalPages" aria-label="下一页" @click="setListPage(logPage, logPage + 1, logTotalPages)"><AdminIcon name="chevron-right" :size="13" /></button></div></section>
        </template>

        <!-- 管理员 -->
        <template v-else>
          <section class="page-title-row"><div><h1>管理员</h1></div><button class="secondary-button" @click="openSubPage('admin-edit', admins[0])"><AdminIcon name="edit" :size="15" />编辑资料</button></section>
          <section class="panel single-admin-panel"><div class="single-admin-profile"><span class="single-admin-avatar"><AdminIcon name="user" :size="24" /></span><div><h2>当前管理员</h2><p>{{ admins[0].account }}</p></div><span class="state-pill 正常">正常</span></div><div class="single-admin-details"><div><span>姓名</span><strong>{{ admins[0].name }}</strong></div><div><span>登录账号</span><strong>{{ admins[0].account }}</strong></div><div><span>最后登录</span><strong>{{ admins[0].lastLogin }}</strong></div><div><span>账号类型</span><strong>唯一管理员</strong></div></div><div class="single-admin-security"><span><AdminIcon name="shield" :size="20" /></span><div><strong>账号安全</strong><p>建议定期修改密码，并妥善保管管理员登录凭证。</p></div><button class="secondary-button" @click="handlePrototypeAction('修改密码功能已打开')">修改密码</button></div></section>
        </template>
      </main>
    </section>
    <Transition name="toast"><div v-if="toastMessage" class="prototype-toast"><AdminIcon name="check" :size="17" />{{ toastMessage }}</div></Transition>
  </div>
</template>
