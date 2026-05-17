import { create } from 'zustand'
import type { Place, FilterState, Collection, SwipeAction } from '@/types'
import { mockPlaces, mockCollections } from '@/lib/mock-data'

interface PlacesState {
  places: Place[]
  filteredPlaces: Place[]
  savedPlaces: string[]
  collections: Collection[]
  currentPlace: Place | null
  filters: FilterState
  isLoading: boolean
  error: string | null

  // Actions
  setPlaces: (places: Place[]) => void
  setFilters: (filters: Partial<FilterState>) => void
  applyFilters: () => void
  savePlace: (placeId: string) => void
  unsavePlace: (placeId: string) => void
  swipePlace: (placeId: string, action: SwipeAction['action']) => void
  setCurrentPlace: (place: Place | null) => void
  addCollection: (collection: Collection) => void
  removeFromCollection: (collectionId: string, placeId: string) => void
}

const defaultFilters: FilterState = {
  categories: [],
  radius: 5000,
  rating: 0,
  priceRange: [1, 4],
  openNow: false,
  amenities: [],
  vibes: [],
  timeBased: [],
}

export const usePlacesStore = create<PlacesState>((set, get) => ({
  places: mockPlaces,
  filteredPlaces: mockPlaces,
  savedPlaces: ['1', '5'],
  collections: mockCollections,
  currentPlace: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  setPlaces: (places) => set({ places, filteredPlaces: places }),

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
    get().applyFilters()
  },

  applyFilters: () => {
    const { places, filters } = get()
    let filtered = [...places]

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category))
    }

    if (filters.radius > 0) {
      filtered = filtered.filter(p => (p.distance || 0) <= filters.radius)
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating)
    }

    filtered = filtered.filter(
      p => p.priceLevel >= filters.priceRange[0] && p.priceLevel <= filters.priceRange[1]
    )

    if (filters.openNow) {
      filtered = filtered.filter(p => p.isOpen)
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p =>
        filters.amenities.some(a => p.amenities.includes(a))
      )
    }

    if (filters.vibes.length > 0) {
      filtered = filtered.filter(p =>
        filters.vibes.some(v => p.vibe.includes(v))
      )
    }

    set({ filteredPlaces: filtered })
  },

  savePlace: (placeId) => {
    set((state) => ({
      savedPlaces: state.savedPlaces.includes(placeId)
        ? state.savedPlaces
        : [...state.savedPlaces, placeId],
    }))
  },

  unsavePlace: (placeId) => {
    set((state) => ({
      savedPlaces: state.savedPlaces.filter(id => id !== placeId),
    }))
  },

  swipePlace: (placeId, action) => {
    if (action === 'save' || action === 'super_like') {
      get().savePlace(placeId)
    }
  },

  setCurrentPlace: (place) => set({ currentPlace: place }),

  addCollection: (collection) => {
    set((state) => ({
      collections: [...state.collections, collection],
    }))
  },

  removeFromCollection: (collectionId, placeId) => {
    set((state) => ({
      collections: state.collections.map(c =>
        c.id === collectionId
          ? { ...c, places: c.places.filter(id => id !== placeId) }
          : c
      ),
    }))
  },
}))
