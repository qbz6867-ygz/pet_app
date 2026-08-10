const GROUPS_KEY = 'familyGroups'
const MEMBERSHIPS_KEY = 'familyMemberships'
const REQUESTS_KEY = 'familyJoinRequests'
const PET_SYNC_KEY = 'petFamilySync'
const MOCK_SEEDED_ACCOUNTS_KEY = 'familyMockSeededAccounts'
const MOCK_PET_SEEDED_ACCOUNTS_KEY = 'familyMockPetSeedV2Accounts'
const ADMIN_PREVIEW_MEMBERS_KEY = 'familyAdminPreviewMembersV1'

const ADMIN_PREVIEW_MEMBERS = [
  { suffix: 'lin', avatar: '林', name: '林悦', note: '', role: '成员' },
  { suffix: 'xu', avatar: '徐', name: '徐阳', note: '', role: '成员' }
]

const MOCK_FAMILIES = [
  {
    code: '572941',
    name: '周末遛宠小队',
    ownerId: 'mock:zhou',
    members: [
      { id: 'mock:zhou', avatar: '周', name: '周宁', note: '今天活跃', role: '管理员' },
      { id: 'mock:gu', avatar: '顾', name: '顾乔', note: '30 分钟前活跃', role: '成员' }
    ]
  },
  {
    code: '348216',
    name: '毛孩子大家庭',
    ownerId: 'mock:chen',
    members: [
      { id: 'mock:chen', avatar: '陈', name: '陈晨', note: '刚刚活跃', role: '管理员' },
      { id: 'mock:he', avatar: '何', name: '何南', note: '昨天活跃', role: '成员' }
    ]
  }
]

const read = (key, fallback) => uni.getStorageSync(key) || fallback
const write = (key, value) => uni.setStorageSync(key, value)

export const getAccountId = (session = {}) => (
  session.accountId ||
  (session.phone ? `phone:${session.phone}` : '') ||
  session.openId ||
  session.openid ||
  `account:${session.name || 'guest'}`
)

const getMemberFromSession = (session, role = '成员') => ({
  id: getAccountId(session),
  avatar: session.avatarText || (session.name || '用户').slice(0, 1),
  name: session.name || '宠物家长',
  note: '刚刚活跃',
  role
})

const getGroups = () => {
  const groups = read(GROUPS_KEY, {})
  Object.keys(groups).forEach(code => {
    const group = groups[code]
    group.code = group.code || code
    group.name = group.name || `${(group.members && group.members[0] && group.members[0].name) || '我的'}的家庭`
    group.members = Array.isArray(group.members) ? group.members : []
  })
  return groups
}

const getMemberships = () => {
  const memberships = read(MEMBERSHIPS_KEY, {})
  Object.keys(memberships).forEach(accountId => {
    const value = memberships[accountId]
    memberships[accountId] = Array.isArray(value) ? [...new Set(value)] : value ? [value] : []
  })
  return memberships
}

const generateFamilyCode = (groups) => {
  if (!groups['826413']) return '826413'
  let code = ''
  do code = String(Math.floor(100000 + Math.random() * 900000))
  while (groups[code])
  return code
}

const addMembership = (memberships, accountId, code) => {
  const codes = Array.isArray(memberships[accountId]) ? memberships[accountId] : []
  memberships[accountId] = codes.includes(code) ? codes : [...codes, code]
}

const removeMembership = (memberships, accountId, code) => {
  const codes = Array.isArray(memberships[accountId]) ? memberships[accountId] : []
  memberships[accountId] = codes.filter(item => item !== code)
}

const syncOwnedPetsToFamily = (accountId, code) => {
  const syncMap = read(PET_SYNC_KEY, {})
  let changed = false
  Object.keys(syncMap).forEach(petId => {
    const sync = syncMap[petId]
    if (sync.ownerId !== accountId || sync.syncMode !== 'all') return
    const codes = Array.isArray(sync.familyCodes) ? sync.familyCodes : []
    if (!codes.includes(code)) {
      sync.familyCodes = [...codes, code]
      changed = true
    }
  })
  if (changed) write(PET_SYNC_KEY, syncMap)
}

const removeFamilyFromPetSync = (code, ownerId = '') => {
  const syncMap = read(PET_SYNC_KEY, {})
  let changed = false
  Object.keys(syncMap).forEach(petId => {
    const sync = syncMap[petId]
    if (ownerId && sync.ownerId !== ownerId) return
    const codes = Array.isArray(sync.familyCodes) ? sync.familyCodes : []
    if (codes.includes(code)) {
      sync.familyCodes = codes.filter(item => item !== code)
      changed = true
    }
  })
  if (changed) write(PET_SYNC_KEY, syncMap)
}

const ensureMockFamilies = session => {
  const accountId = getAccountId(session)
  const seededAccounts = read(MOCK_SEEDED_ACCOUNTS_KEY, [])
  if (seededAccounts.includes(accountId)) return

  const groups = getGroups()
  const memberships = getMemberships()
  const currentMember = getMemberFromSession(session)
  MOCK_FAMILIES.forEach(mock => {
    if (!groups[mock.code]) {
      groups[mock.code] = {
        ...mock,
        members: mock.members.map(member => ({ ...member })),
        createdAt: Date.now()
      }
    }
    if (!groups[mock.code].members.some(member => member.id === accountId)) {
      groups[mock.code].members.push({ ...currentMember })
    }
    addMembership(memberships, accountId, mock.code)
  })
  write(GROUPS_KEY, groups)
  write(MEMBERSHIPS_KEY, memberships)
  write(MOCK_SEEDED_ACCOUNTS_KEY, [...seededAccounts, accountId])
}

const ensureMockFamilyPets = session => {
  const accountId = getAccountId(session)
  const seededAccounts = read(MOCK_PET_SEEDED_ACCOUNTS_KEY, [])
  if (seededAccounts.includes(accountId)) return

  const personalFamily = getFamiliesForAccount(session).find(group => group.ownerId === accountId)
  if (!personalFamily) return

  const addedPets = read('addedPets', [])
  if (!addedPets.some(pet => Number(pet.id) === 900003)) {
    addedPets.push({
      id: 900003,
      name: '团子',
      type: '布偶猫',
      age: '1岁 2个月',
      icon: 'cat',
      avatar: '',
      gender: '女孩',
      weight: '4.2'
    })
  }

  const syncMap = read(PET_SYNC_KEY, {})
  if (!syncMap['1'] || syncMap['1'].ownerId === accountId) {
    syncMap['1'] = { ownerId: accountId, syncMode: 'specific', familyCodes: [personalFamily.code] }
  }
  syncMap['2'] = { ownerId: 'mock:zhou', syncMode: 'specific', familyCodes: ['572941'] }
  syncMap['900003'] = { ownerId: 'mock:chen', syncMode: 'specific', familyCodes: ['348216'] }

  write('addedPets', addedPets)
  write(PET_SYNC_KEY, syncMap)
  write(MOCK_PET_SEEDED_ACCOUNTS_KEY, [...seededAccounts, accountId])
}

export const getFamiliesForAccount = (session = {}) => {
  const accountId = getAccountId(session)
  const groups = getGroups()
  const memberships = getMemberships()
  return (memberships[accountId] || []).map(code => groups[code]).filter(Boolean)
}

export const getCurrentFamily = (session = {}, requestedCode = '') => {
  const families = getFamiliesForAccount(session)
  const family = requestedCode
    ? families.find(item => item.code === requestedCode)
    : families.find(item => item.ownerId === getAccountId(session)) || families[0]
  return family ? { active: true, ...family } : { active: false, code: '', name: '', members: [] }
}

export const createFamily = (session = {}, requestedName = '') => {
  const groups = getGroups()
  const memberships = getMemberships()
  const accountId = getAccountId(session)

  const code = generateFamilyCode(groups)
  const owner = getMemberFromSession(session, '管理员')
  const name = requestedName.trim() || `${owner.name}的家庭`
  const group = { code, name, ownerId: owner.id, members: [owner], createdAt: Date.now() }

  groups[code] = group
  addMembership(memberships, owner.id, code)
  write(GROUPS_KEY, groups)
  write(MEMBERSHIPS_KEY, memberships)
  syncOwnedPetsToFamily(accountId, code)
  return { active: true, ...group }
}

export const ensureAccountFamily = (session = {}) => {
  if (!session.loggedIn) return []
  return getFamiliesForAccount(session)
}

export const ensureAdminPreviewMembers = (session = {}) => {
  if (!session.loggedIn) return
  const accountId = getAccountId(session)
  const groups = getGroups()
  const memberships = getMemberships()
  const seededFamilies = read(ADMIN_PREVIEW_MEMBERS_KEY, [])
  let groupsChanged = false
  let seedChanged = false

  ;(memberships[accountId] || []).forEach(code => {
    const group = groups[code]
    const seedId = `${accountId}:${code}`
    if (!group || group.ownerId !== accountId || seededFamilies.includes(seedId)) return

    ADMIN_PREVIEW_MEMBERS.forEach(preview => {
      const memberId = `preview:${code}:${preview.suffix}`
      if (group.members.some(member => member.id === memberId)) return
      group.members.push({ ...preview, id: memberId })
      groupsChanged = true
    })
    seededFamilies.push(seedId)
    seedChanged = true
  })

  if (groupsChanged) write(GROUPS_KEY, groups)
  if (seedChanged) write(ADMIN_PREVIEW_MEMBERS_KEY, seededFamilies)
}

export const renameFamily = (session = {}, code, rawName = '') => {
  const name = rawName.trim()
  const groups = getGroups()
  const group = groups[code]
  if (!name || !group || group.ownerId !== getAccountId(session)) return false
  group.name = name
  write(GROUPS_KEY, groups)
  return true
}

export const getMyPendingRequests = (session = {}) => {
  const accountId = getAccountId(session)
  return read(REQUESTS_KEY, []).filter(request => request.applicantId === accountId && request.status === 'pending')
}

export const getMyPendingRequest = (session = {}) => getMyPendingRequests(session)[0] || null

export const applyToFamily = (session = {}, rawCode = '') => {
  const code = rawCode.trim()
  const groups = getGroups()
  const group = groups[code]
  if (!group) return { ok: false, message: '未找到对应的家庭组' }

  const accountId = getAccountId(session)
  const memberships = getMemberships()
  if ((memberships[accountId] || []).includes(code)) return { ok: false, message: '当前账号已加入该家庭组' }

  const requests = read(REQUESTS_KEY, [])
  const existing = requests.find(request => request.applicantId === accountId && request.code === code && request.status === 'pending')
  if (existing) return { ok: false, message: '该家庭组的加入申请正在等待处理' }

  const applicant = getMemberFromSession(session)
  requests.unshift({
    id: `${Date.now()}-${accountId}`,
    code,
    familyName: group.name,
    applicantId: accountId,
    name: applicant.name,
    avatar: applicant.avatar,
    note: '通过家庭码申请加入',
    status: 'pending',
    createdAt: Date.now()
  })
  write(REQUESTS_KEY, requests)
  return { ok: true, familyName: group.name }
}

export const joinFamilyFromInvite = (session = {}, rawCode = '') => {
  const code = rawCode.trim()
  const groups = getGroups()
  const group = groups[code]
  if (!group) return { ok: false, message: '邀请链接对应的家庭组不存在' }

  const accountId = getAccountId(session)
  const memberships = getMemberships()
  if ((memberships[accountId] || []).includes(code)) return { ok: true, familyName: group.name, alreadyJoined: true }

  const member = getMemberFromSession(session)
  group.members.push(member)
  addMembership(memberships, accountId, code)
  syncOwnedPetsToFamily(accountId, code)
  write(GROUPS_KEY, groups)
  write(MEMBERSHIPS_KEY, memberships)
  return { ok: true, familyName: group.name }
}

export const getFamilyRequests = (session = {}, code = '') => {
  const family = getCurrentFamily(session, code)
  if (!family.active || family.ownerId !== getAccountId(session)) return []
  return read(REQUESTS_KEY, []).filter(request => request.code === family.code)
}

export const resolveFamilyRequest = (session = {}, code, requestId, accepted) => {
  const family = getCurrentFamily(session, code)
  if (!family.active || family.ownerId !== getAccountId(session)) return false

  const groups = getGroups()
  const memberships = getMemberships()
  const requests = read(REQUESTS_KEY, [])
  const request = requests.find(item => item.id === requestId && item.code === family.code && item.status === 'pending')
  if (!request) return false

  request.status = accepted ? 'accepted' : 'rejected'
  request.resolvedAt = Date.now()
  if (accepted && !(memberships[request.applicantId] || []).includes(family.code)) {
    groups[family.code].members.push({
      id: request.applicantId,
      avatar: request.avatar,
      name: request.name,
      note: '刚刚加入',
      role: '成员'
    })
    addMembership(memberships, request.applicantId, family.code)
    syncOwnedPetsToFamily(request.applicantId, family.code)
    write(GROUPS_KEY, groups)
    write(MEMBERSHIPS_KEY, memberships)
  }
  write(REQUESTS_KEY, requests)
  return true
}

export const removeFamilyMember = (session = {}, code, memberId) => {
  const family = getCurrentFamily(session, code)
  if (!family.active || family.ownerId !== getAccountId(session) || memberId === family.ownerId) return false
  const groups = getGroups()
  const memberships = getMemberships()
  groups[family.code].members = groups[family.code].members.filter(member => member.id !== memberId)
  removeMembership(memberships, memberId, family.code)
  removeFamilyFromPetSync(family.code, memberId)
  write(GROUPS_KEY, groups)
  write(MEMBERSHIPS_KEY, memberships)
  return true
}

export const dissolveFamilyGroup = (session = {}, code) => {
  const family = getCurrentFamily(session, code)
  if (!family.active || family.ownerId !== getAccountId(session)) return false
  const groups = getGroups()
  const memberships = getMemberships()
  const requests = read(REQUESTS_KEY, [])
  family.members.forEach(member => removeMembership(memberships, member.id, family.code))
  removeFamilyFromPetSync(family.code)
  requests.forEach(request => {
    if (request.code === family.code && request.status === 'pending') {
      request.status = 'rejected'
      request.resolvedAt = Date.now()
    }
  })
  delete groups[family.code]
  write(GROUPS_KEY, groups)
  write(MEMBERSHIPS_KEY, memberships)
  write(REQUESTS_KEY, requests)
  return true
}
