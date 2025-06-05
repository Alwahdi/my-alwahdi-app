import { create } from 'zustand';

export interface MapStateType {
  latitude: number | null;
  longitude: number | null;
  zoom: number;
  selectedLayers: string[];
  goToLocation: {
    latitude: number | null;
    longitude: number | null;
    zoom: number | null;
  };
}

interface MapStore {
  mapState: MapStateType;
  setMapState: (partialState: Partial<MapStateType>) => void;
  // Action to trigger map movement
  panTo: (latitude: number, longitude: number, zoom?: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  mapState: {
    latitude: null,
    longitude: null,
    zoom: 2, // Default zoom
    selectedLayers: ["Groundwater Levels"], // Default checked
    goToLocation: { latitude: null, longitude: null, zoom: null },
  },
  setMapState: (partialState) =>
    set((state) => ({ mapState: { ...state.mapState, ...partialState } })),
  panTo: (latitude, longitude, zoom) =>
    set((state) => ({
      mapState: {
        ...state.mapState,
        goToLocation: { latitude, longitude, zoom: zoom || state.mapState.zoom },
      },
    })),
}));