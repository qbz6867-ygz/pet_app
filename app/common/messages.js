export const messages = [
  {
    id: 1,
    icon: 'heart',
    title: '今日健康打卡还未完成',
    body: '旺财还有 1 项健康记录待确认，完成后可生成今日健康小结。',
    time: '10 分钟前',
    fullTime: '2026 年 7 月 30 日 15:50',
    category: '健康提醒',
    unread: true,
    petId: 1,
    petName: '旺财',
    summary: '今天的健康记录即将完成，补充最后一项后即可形成完整的每日健康档案。',
    details: [
      { label: '记录日期', value: '2026 年 7 月 30 日' },
      { label: '当前状态', value: '待完成' },
      { label: '待确认项目', value: '1 项' }
    ],
    advice: '建议在今天结束前完成确认，连续记录有助于更准确地观察旺财的饮食、饮水和精神状态变化。',
    actionText: '去完成今日打卡',
    actionUrl: '/pages/home/index',
    actionType: 'reLaunch'
  },
  {
    id: 2,
    icon: 'paw',
    title: '午间遛弯即将开始',
    body: '计划时间为 12:30，建议携带饮水并避开正午高温路段。',
    time: '今天 10:20',
    fullTime: '2026 年 7 月 30 日 10:20',
    category: '任务提醒',
    unread: true,
    petId: 1,
    petName: '旺财',
    summary: '旺财的午间遛弯任务即将开始，请根据天气和体感温度适当调整时长。',
    details: [
      { label: '计划时间', value: '12:30' },
      { label: '建议时长', value: '30 分钟' },
      { label: '任务状态', value: '即将开始' }
    ],
    advice: '外出前准备饮水，优先选择阴凉路线；如果地面温度较高，可缩短散步时间并增加室内互动。',
    actionText: '查看今日任务',
    actionUrl: '/pages/home/index',
    actionType: 'reLaunch'
  },
  {
    id: 3,
    icon: 'check',
    title: '驱虫记录已更新',
    body: '旺财本月体内外驱虫已经完成，下次建议日期为 2026.08.08。',
    time: '昨天 18:42',
    fullTime: '2026 年 7 月 29 日 18:42',
    category: '健康档案',
    unread: false,
    petId: 1,
    petName: '旺财',
    summary: '本次驱虫记录已归入旺财的健康档案，后续可根据建议日期安排下一次护理。',
    details: [
      { label: '完成日期', value: '2026 年 7 月 8 日' },
      { label: '护理类型', value: '体内外驱虫' },
      { label: '下次建议', value: '2026 年 8 月 8 日' }
    ],
    advice: '驱虫后请留意食欲、精神和排便状态。如出现持续不适，应及时咨询专业宠物医生。',
    actionText: '查看宠物资料',
    actionUrl: '/pages/pet/profile?id=1',
    actionType: 'navigateTo'
  },
  {
    id: 4,
    icon: 'meal',
    title: '本周饮食状态稳定',
    body: '近 7 天平均进食量处于正常范围，请继续保持规律喂养。',
    time: '7 月 26 日',
    fullTime: '2026 年 7 月 26 日 20:00',
    category: '每周小结',
    unread: false,
    petId: 1,
    petName: '旺财',
    summary: '旺财本周饮食状态整体稳定，进食规律，暂未发现明显的食量波动。',
    details: [
      { label: '统计周期', value: '近 7 天' },
      { label: '平均食量', value: '80 g / 天' },
      { label: '综合状态', value: '稳定' }
    ],
    advice: '继续保持固定喂食时间和合理份量，同时结合体重、活动量与排便情况综合观察。',
    actionText: '查看健康记录',
    actionUrl: '/pages/records/index',
    actionType: 'reLaunch'
  }
]
