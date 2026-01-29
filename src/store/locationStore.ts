// Location store for geofencing and stadium boost
import { create } from 'zustand';
import { LocationState } from '../types';

interface LocationStore extends LocationState {
    // Actions
    setAtStadium: (isAtStadium: boolean, stadiumName?: string) => void;
    updateBoostMultiplier: (multiplier: number) => void;
    simulateStadiumPresence: (atStadium: boolean) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    isAtStadium: false,
    stadiumName: undefined,
    boostMultiplier: 1.0,
    lastChecked: undefined,

    setAtStadium: (isAtStadium, stadiumName) => {
        set({
            isAtStadium,
            stadiumName,
            boostMultiplier: isAtStadium ? 2.5 : 1.0,
            lastChecked: new Date().toISOString(),
        });
    },

    updateBoostMultiplier: (multiplier) => set({ boostMultiplier: multiplier }),

    // For demo/testing purposes
    simulateStadiumPresence: (atStadium) => {
        set({
            isAtStadium: atStadium,
            stadiumName: atStadium ? 'Ohio Stadium' : undefined,
            boostMultiplier: atStadium ? 3.0 : 1.0,
            lastChecked: new Date().toISOString(),
        });
    },
}));
