import {create} from "zustand";

const usezkSyncStore = create((set) => ({
    zkSyncConfigStore: {},
    setZkSyncConfigStore: (config) => set({zkSyncConfigStore: config}),
}));
export default usezkSyncStore;
