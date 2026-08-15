import { pets } from './data.js'

const DELETED_PET_IDS_KEY = 'deletedPetIds'
const ADDED_PETS_KEY = 'addedPets'
const PET_OVERRIDES_KEY = 'petProfileOverrides'

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

export const getActivePets = () => getRawPets().map(pet => ({ ...pet, isOwned: true, canEdit: true }))

export const getPetById = petId => getActivePets().find(pet => Number(pet.id) === Number(petId)) || null

export const createPetProfile = profile => {
  const addedPets = uni.getStorageSync(ADDED_PETS_KEY)
  const currentAddedPets = Array.isArray(addedPets) ? addedPets : []
  const pet = { ...profile, id: Date.now() }
  uni.setStorageSync(ADDED_PETS_KEY, [...currentAddedPets, pet])
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
  return { success: true }
}
