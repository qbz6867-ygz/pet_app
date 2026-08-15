export const pets = [
  { id: 1, name: '旺财', type: '威尔士柯基犬', age: '2岁 4个月', icon: 'dog', avatar: '/static/pet-avatar-corgi.png', gender: '男孩', weight: '10.8' },
  { id: 2, name: '糯米', type: '英国短毛猫', age: '1岁 8个月', icon: 'cat', avatar: '/static/pet-avatar-british-shorthair.png', gender: '女孩', weight: '4.6' }
]

export const tasks = [
  { id: 1, time: '08:30', title: '早餐喂食', note: '犬粮 80g', petIds: [1], done: true },
  { id: 2, time: '12:30', title: '午间遛弯', note: '建议 30 分钟', petIds: [1], done: false },
  { id: 3, time: '19:00', title: '清洁梳毛', note: '检查皮肤状态', petIds: [1], done: false }
]

export const breeds = [
  { id: 1, name: '威尔士柯基犬', type: '犬类', icon: 'dog', image: '/static/breeds/welsh-corgi.jpg', summary: '短腿大耳、活泼亲人，运动充沛，需控制体重并保护腰背。', trait: '活泼、亲人', size: '小型犬', bodySize: '小型', coat: '短毛', activity: '较高', shedding: '较多', exercise: '中高', appetite: '中等', odor: '较轻', age: '12–15 年', intro: '短腿、大耳朵和灿烂笑容是它的标志。性格开朗，喜欢参与家庭活动，也很愿意和人互动。', care: '每天安排 45–60 分钟散步，控制体重并减少频繁上下楼，换毛期需要增加梳毛频率。' },
  { id: 2, name: '英国短毛猫', type: '猫类', icon: 'cat', image: '/static/breeds/british-shorthair.jpg', summary: '圆脸厚毛、安静稳重，适应独处，日常需注意活动和体重。', trait: '温和、安静', size: '中型猫', bodySize: '中型', coat: '短毛', activity: '较低', shedding: '一般', exercise: '中低', appetite: '较好', odor: '很轻', age: '14–18 年', intro: '圆脸、厚实被毛和沉稳气质很有辨识度，适应力强，独处时安静，也乐于陪伴家人。', care: '每周梳毛 2–3 次，准备益智玩具鼓励活动，并关注饮食热量与体重变化。' },
  { id: 3, name: '金毛寻回犬', type: '犬类', icon: 'dog', image: '/static/breeds/golden-retriever.jpg', summary: '金色长毛、聪明友善，对孩子有耐心，是可靠的家庭伙伴。', trait: '友善、聪明', size: '大型犬', bodySize: '大型', coat: '中长毛', activity: '较高', shedding: '较多', exercise: '高', appetite: '较大', odor: '中等', age: '10–12 年', intro: '性格温和、学习能力强，对儿童和其他宠物通常十分友善，是热情可靠的家庭伙伴。', care: '每天保证 60–90 分钟运动，定期清洁耳道并梳理长毛，训练时适合使用正向奖励。' },
  { id: 4, name: '布偶猫', type: '猫类', icon: 'cat', image: '/static/breeds/ragdoll.jpg', summary: '蓝眼长毛、温顺粘人，喜欢安静陪伴，柔软被毛需规律梳理。', trait: '温顺、粘人', size: '大型猫', bodySize: '大型', coat: '长毛', activity: '较低', shedding: '较多', exercise: '中低', appetite: '中等', odor: '很轻', age: '13–16 年', intro: '拥有蓝色眼睛和柔软长毛，性格温柔且依恋家人，喜欢在熟悉的人身边安静陪伴。', care: '每周梳毛 3–4 次以减少打结，设置低强度互动游戏，并注意饮水量与口腔护理。' },
  { id: 5, name: '柴犬', type: '犬类', icon: 'dog', image: '/static/breeds/shiba-inu.jpg', summary: '竖耳卷尾、爱干净有主见，对家人忠诚，需要耐心训练。', trait: '独立、忠诚', size: '中小型犬', bodySize: '中型', coat: '短毛', activity: '较高', shedding: '较多', exercise: '中高', appetite: '中等', odor: '较轻', age: '12–15 年', intro: '警觉、利落又很有主见，对家人忠诚。早期社会化能帮助它更从容地面对陌生环境。', care: '保持规律运动和边界清晰的训练，换毛季每天梳毛，并使用牵引绳保障户外安全。' },
  { id: 6, name: '贵宾犬', type: '犬类', icon: 'dog', image: '/static/breeds/poodle.jpg', summary: '卷毛少掉毛、聪明好学，喜欢互动，但需要定期修剪美容。', trait: '聪明、活跃', size: '中型犬', bodySize: '中型', coat: '中长毛', activity: '较高', shedding: '较少', exercise: '中高', appetite: '中等', odor: '较轻', age: '12–15 年', intro: '反应敏捷、学习速度快，喜欢互动和挑战。卷曲被毛掉毛少，但需要持续美容维护。', care: '每 4–6 周修剪被毛，搭配散步与益智训练，日常留意耳道、牙齿和泪痕清洁。' },
  { id: 7, name: '暹罗猫', type: '猫类', icon: 'cat', image: '/static/breeds/siamese.jpg', summary: '蓝眼重点色、聪明好奇，爱用叫声交流，也十分依赖陪伴。', trait: '亲人、爱交流', size: '中型猫', bodySize: '中型', coat: '短毛', activity: '较高', shedding: '较少', exercise: '中高', appetite: '中等', odor: '很轻', age: '12–16 年', intro: '身形修长、重点色明显，喜欢用声音表达需求。它重视陪伴，也热衷探索与互动。', care: '每天安排逗猫和攀爬活动，避免长时间独处，并定期检查牙齿与保持稳定作息。' },
  { id: 8, name: '缅因猫', type: '猫类', icon: 'cat', image: '/static/breeds/maine-coon.jpg', summary: '体格高大、长毛蓬松，性格温柔稳重，需要结实的攀爬空间。', trait: '温柔、稳重', size: '大型猫', bodySize: '大型', coat: '长毛', activity: '适中', shedding: '较多', exercise: '中等', appetite: '较大', odor: '很轻', age: '12–15 年', intro: '体格高大、长毛蓬松，却有温柔沉稳的性格，善于与家庭成员相处。', care: '每周至少梳毛 3 次，提供结实的猫爬架，控制体重并关注关节和心脏健康。' },
  { id: 9, name: '拉布拉多寻回犬', type: '犬类', icon: 'dog', image: '/static/breeds/labrador.jpg', summary: '结实友善、训练配合度高，热爱运动和食物，需控制饮食。', trait: '友善、可靠', size: '大型犬', bodySize: '大型', coat: '短毛', activity: '较高', shedding: '较多', exercise: '高', appetite: '较大', odor: '中等', age: '10–13 年', intro: '性格稳定、亲人且乐于配合，学习能力强，适合喜欢户外活动和互动训练的家庭。', care: '每天安排充足运动并控制饮食热量，定期清洁耳道，幼年期避免过度跳跃以保护关节。' },
  { id: 10, name: '边境牧羊犬', type: '犬类', icon: 'dog', image: '/static/breeds/border-collie.jpg', summary: '敏捷聪明、精力充沛，喜欢任务，需要持续运动和脑力挑战。', trait: '聪明、专注', size: '中型犬', bodySize: '中型', coat: '中长毛', activity: '较高', shedding: '一般', exercise: '高', appetite: '中等', odor: '较轻', age: '12–15 年', intro: '精力充沛、反应敏捷，对训练和任务有很高热情，需要持续的脑力挑战与规律陪伴。', care: '每天提供高强度运动和益智训练，定期梳理被毛，并通过社会化训练减少追逐和敏感行为。' },
  { id: 11, name: '法国斗牛犬', type: '犬类', icon: 'dog', image: '/static/breeds/french-bulldog.jpg', summary: '蝙蝠耳、亲人爱玩，适合城市生活，但不耐炎热和剧烈运动。', trait: '亲人、活泼', size: '小型犬', bodySize: '小型', coat: '短毛', activity: '适中', shedding: '一般', exercise: '中等', appetite: '中等', odor: '较轻', age: '10–12 年', intro: '体型紧凑、表情丰富，喜欢陪伴家人，运动需求适中，较适合城市家庭生活。', care: '避免炎热天气和剧烈运动，保持皮肤褶皱清洁，控制体重并留意呼吸、脊柱和关节状态。' },
  { id: 12, name: '萨摩耶犬', type: '犬类', icon: 'dog', image: '/static/breeds/samoyed.jpg', summary: '雪白长毛、外向友好，精力旺盛，需要大量运动和细致梳理。', trait: '友好、开朗', size: '中大型犬', bodySize: '大型', coat: '长毛', activity: '较高', shedding: '较多', exercise: '高', appetite: '中等', odor: '较轻', age: '12–14 年', intro: '白色双层被毛和“微笑”表情很有辨识度，性格外向，喜欢与家庭成员共同活动。', care: '保证规律运动并经常梳理双层被毛，炎热季节注意降温，洗护后必须彻底吹干。' },
  { id: 13, name: '美国短毛猫', type: '猫类', icon: 'cat', image: '/static/breeds/american-shorthair.jpg', summary: '体格结实、随和稳重，适应力强，日常护理较为轻松。', trait: '随和、稳重', size: '中型猫', bodySize: '中型', coat: '短毛', activity: '适中', shedding: '一般', exercise: '中等', appetite: '中等', odor: '很轻', age: '15–20 年', intro: '体格结实、适应力强，性格独立而友善，既能安静独处，也愿意参与家庭互动。', care: '每周梳毛并安排追逐和攀爬游戏，控制零食与体重，定期关注口腔和心脏健康。' },
  { id: 14, name: '波斯猫', type: '猫类', icon: 'cat', image: '/static/breeds/persian.jpg', summary: '圆脸长毛、安静优雅，偏爱室内生活，需要每日梳毛清洁。', trait: '安静、温顺', size: '中型猫', bodySize: '中型', coat: '长毛', activity: '较低', shedding: '较多', exercise: '中低', appetite: '中等', odor: '很轻', age: '12–17 年', intro: '长毛浓密、气质安静，喜欢稳定舒适的生活环境，通常更偏爱温和而规律的陪伴。', care: '每天梳毛并清洁眼周，定期进行专业洗护，注意通风降温和呼吸、皮肤及泌尿健康。' },
  { id: 15, name: '孟加拉猫', type: '猫类', icon: 'cat', image: '/static/breeds/bengal.jpg', summary: '豹纹醒目、聪明好动，喜欢攀爬追逐，需要丰富空间和互动。', trait: '活跃、好奇', size: '中型猫', bodySize: '中型', coat: '短毛', activity: '较高', shedding: '较少', exercise: '高', appetite: '中等', odor: '很轻', age: '12–16 年', intro: '豹纹被毛醒目，运动能力和探索欲都很强，喜欢攀爬、追逐以及与人进行高频互动。', care: '准备牢固猫爬架和丰富益智玩具，每天安排互动游戏，并保持门窗防护与稳定的活动空间。' },
  { id: 16, name: '斯芬克斯猫', type: '猫类', icon: 'cat', image: '/static/breeds/sphynx.jpg', summary: '近乎无毛、外向亲人，需要定期清洁皮肤并注意保暖防晒。', trait: '亲人、外向', size: '中型猫', bodySize: '中型', coat: '短毛', activity: '适中', shedding: '较少', exercise: '中等', appetite: '较大', odor: '较轻', age: '9–15 年', intro: '体表几乎无毛，触感温暖，性格亲人且喜欢靠近家人，对温度变化也更为敏感。', care: '定期擦洗皮肤和清洁耳道，冬季注意保暖、夏季避免暴晒，并关注心脏健康与饮食热量。' }
]

export const comments = [
  { name: '林安', avatar: '林', date: '今天', score: '4.1', quality: true, text: '信息很实用，尤其是运动量和日常养护建议，准备养宠前更有底了。' },
  { name: '周末养宠人', avatar: '周', date: '昨天', score: '4.7', quality: true, text: '我家的宠物也很符合这个性格描述，规律陪伴真的很重要。' },
  { name: '陈晨', avatar: '陈', date: '3 天前', score: '4.5', quality: false, text: '从幼年期开始养成好习惯，适应家庭生活很快，互动和训练都很有价值。' },
  { name: '北岛', avatar: '北', date: '7 月 20 日', score: '4.3', quality: false, text: '换毛期需要坚持梳毛，页面里的提醒对新手很有帮助。' },
  { name: '一只布丁', avatar: '布', date: '7 月 18 日', score: '4.6', quality: false, text: '性格描述和我实际接触到的情况很接近，适合准备养宠时快速判断。' },
  { name: '新手养宠', avatar: '许', date: '7 月 15 日', score: '4.2', quality: false, text: '内容简洁清楚，如果能长期记录饮食和运动变化，会更容易照顾好它。' }
]

export const guideSections = [
  { icon: 'home', title: '养宠前先做好评估', body: ['确认所有家庭成员是否同意养宠，并了解家中是否有人对动物毛发过敏。租房居住时，还要提前确认房屋是否允许饲养宠物。', '选择宠物不能只看外观，应结合居住空间、工作时间、家庭成员和养宠经验，了解不同品种的体型、活动量、掉毛程度和养护难度。'] },
  { icon: 'basket', title: '接宠物回家前的物品准备', body: ['提前准备适龄主粮、食盆和水碗、舒适睡垫、航空箱或宠物包、梳毛与清洁用品以及安全耐用的玩具。', '养猫还需要猫砂盆、猫砂、猫抓板和猫爬架；养狗则需要牵引绳、胸背带、拾便袋和排泄训练用品。'] },
  { icon: 'leaf', title: '给新成员适应环境的时间', body: ['宠物刚进入陌生环境时可能躲藏、紧张或食欲下降。最初几天应提供安静、安全的适应区域，不要频繁抱起或强迫亲近。'] },
  { icon: 'meal', title: '日常饮食与饮水', body: ['根据年龄、体重、活动量和主粮说明定时定量喂食。每天提供干净、新鲜的饮水，不随意喂食不确定是否安全的人类食物。'] },
  { icon: 'ball', title: '运动、陪伴与行为引导', body: ['狗狗需要规律散步，猫咪也需要通过逗猫棒、益智玩具和猫爬架释放精力。训练以奖励和正向引导为主。'] },
  { icon: 'broom', title: '清洁与居住环境', body: ['食盆、水碗、睡垫、玩具和排泄区域都需要定期清洁。根据毛发长度安排梳毛，并使用宠物专用洗护用品。'] },
  { icon: 'syringe', title: '疫苗、驱虫与健康观察', body: ['了解已有的疫苗、驱虫和健康记录，再根据专业宠物医生的建议安排后续计划。持续记录食欲、饮水、排便、精神状态和体重变化。'] },
  { icon: 'shield', title: '居家与外出安全', body: ['窗户和阳台应安装牢固防护，药品、清洁剂、电线和尖锐物品放在宠物无法接触的位置。外出时做好牵引与身份标识。'] },
  { icon: 'handshake', title: '把长期责任放在第一位', body: ['宠物需要稳定的生活规律、耐心的行为引导和持续的情绪陪伴。把它带回家，就应尽可能为它提供安全、健康和稳定的一生。'] }
]
