import { apiClient } from './apiClient'

export interface GeocodingResult {
<<<<<<< HEAD
  formattedAddress: string | null
  latitude: number | null
  longitude: number | null
  placeId: string | null
  photoName?: string | null
  photoUrl?: string | null
}

export interface PlaceAutocompleteResult {
  description: string
  placeId: string
  mainText: string
  secondaryText: string
}

export interface PlaceResult {
  id: string | null
  name: string | null
  formattedAddress: string | null
  latitude: number | null
  longitude: number | null
  primaryCategory: string | null
  photoName?: string | null
  photoUrl?: string | null
=======
  formattedAddress?: string
  location?: {
    latitude?: number
    longitude?: number
  }
  placeId?: string
>>>>>>> eed698d6c6b8b21e736038e8e8b13dbdc8e85acc
}

export const mapsService = {
  searchDestination: async (address: string, token: string) => {
    return apiClient.get<{ ok: boolean; data: GeocodingResult }>(
      `/maps/geocoding/search?address=${encodeURIComponent(address)}`,
      token
    )
  },
}