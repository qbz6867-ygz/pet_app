import { pets } from './data.js'
import { ensureAccountFamily, getAccountId, getFamiliesForAccount } from './family.js'

const DELETED_PET_IDS_KEY = 'deletedPetIds'
const ADDED_PETS_KEY = 'addedPets'
const PET_SYNC_KEY = 'petFamilySync'
const PET_OVERRIDES_KEY = 'petProfileOverrides'

const getSession = () => uni.getStorageSync('authSession') || {}

const getDeletedPetIds = () => {
  const ids = uni.getStorageSync(DELETED_PET_IDS_KEY)
  return Array.isArray(ids) ? ids.map(Number) : []
}

const getRawPets = () => {
  const deletedIds = getDeletedPetIds()
  const addedPets = uni.getStorageSync(ADDED_PETS_KEY)
  const overrides = uni.getStorageSync(PET_OVERRIDES_KEY) || {}
  return [...pets, ...(Array.isArray(addedPets) ? addedPets : [])]
    .filter(pet => !deletedIds.includes(Number(pet.id)))
    .map(pet => ({ ...pet, ...(overrides[String(pet.id)] || {}) }))
}

const getSyncMap = () => uni.getStorageSync(PET_SYNC_KEY) || {}
const saveSyncMap = syncMap => uni.setStorageSync(PET_SYNC_KEY, syncMap)

const attachFamilySource = (pet, sync, families, accountId) => {
  const familyNames = families
    .filter(family => (sync.familyCodes || []).includes(family.code))
    .map(family => family.name)
  const canManageFromFamily = families.some(family => (
    (sync.familyCodes || []).includes(family.code) && family.ownerId === accountId
  ))
  return {
    ...pet,
    ownerId: sync.ownerId,
    isOwned: sync.ownerId === accountId,
    canEdit: sync.ownerId === accountId || canManageFromFamily,
    syncMode: sync.syncMode,
    familyCodes: [...(sync.familyCodes || [])],
    sourceFamilyNames: familyNames,
    sourceFamilyName: familyNames.join('、') || '仅自己可见',
    sourceLabel: familyNames.length ? familyNames.join('、') : '仅自己可见'
  }
}

export const getActivePets = () => {
  const session = getSession()
  const rawPets = getRawPets()
  if (!session.loggedIn) {
    return rawPets.map(pet => ({ ...pet, isOwned: true, canEdit: true, familyCodes: [], sourceFamilyNames: [], sourceFamilyName: '个人宠物', sourceLabel: '个人宠物' }))
  }

  ensureAccountFamily(session)
  const accountId = getAccountId(session)
  const families = getFamiliesForAccount(session)
  const familyCodes = families.map(family => family.code)
  const syncMap = getSyncMap()
  let changed = false

  rawPets.forEach(pet => {
    const key = String(pet.id)
    if (!syncMap[key]) {
      syncMap[key] = { ownerId: accountId, syncMode: 'all', familyCodes: [...familyCodes] }
      changed = true
    } else if (syncMap[key].ownerId === accountId && syncMap[key].syncMode === 'all') {
      const nextCodes = [...familyCodes]
      if (JSON.stringify(syncMap[key].familyCodes || []) !== JSON.stringify(nextCodes)) {
        syncMap[key].familyCodes = nextCodes
        changed = true
      }
    }
  })
  if (changed) saveSyncMap(syncMap)

  return rawPets
    .filter(pet => {
      const sync = syncMap[String(pet.id)]
      return sync.ownerId === accountId || (sync.familyCodes || []).some(code => familyCodes.includes(code))
    })
    .map(pet => attachFamilySource(pet, syncMap[String(pet.id)], families, accountId))
}

export const getPetById = petId => getActivePets().find(pet => Number(pet.id) === Number(petId)) || null

export const getPetsForFamily = familyCode => getActivePets().filter(pet => pet.familyCodes.includes(familyCode))

export const createPetProfile = profile => {
  const addedPets = uni.getStorageSync(ADDED_PETS_KEY)
  const currentAddedPets = Array.isArray(addedPets) ? addedPets : []
  const pet = { ...profile, id: Date.now() }
  uni.setStorageSync(ADDED_PETS_KEY, [...currentAddedPets, pet])

  const session = getSession()
  if (session.loggedIn) {
    ensureAccountFamily(session)
    const availableCodes = getFamiliesForAccount(session).map(family => family.code)
    const syncMap = getSyncMap()
    syncMap[String(pet.id)] = {
      ownerId: getAccountId(session),
      syncMode: 'all',
      familyCodes: availableCodes
    }
    saveSyncMap(syncMap)
  }
  return pet
}

export const updatePetProfile = (petId, updates = {}) => {
  const pet = getPetById(petId)
  if (!pet || !pet.canEdit) return false
  const overrides = uni.getStorageSync(PET_OVERRIDES_KEY) || {}
  overrides[String(petId)] = { ...(overrides[String(petId)] || {}), ...updates }
  uni.setStorageSync(PET_OVERRIDES_KEY, overrides)
  return true
}

export const deletePetProfile = petId => {
  const visiblePets = getActivePets()
  const pet = visiblePets.find(item => Number(item.id) === Number(petId))
  if (!pet || !pet.isOwned) return { success: false, reason: 'forbidden' }
  if (visiblePets.filter(item => item.isOwned).length <= 1) return { success: false, reason: 'last-pet' }

  const id = Number(petId)
  const deletedIds = getDeletedPetIds()
  if (!deletedIds.includes(id)) uni.setStorageSync(DELETED_PET_IDS_KEY, [...deletedIds, id])
  const syncMap = getSyncMap()
  delete syncMap[String(petId)]
  saveSyncMap(syncMap)
  return { success: true }
}
