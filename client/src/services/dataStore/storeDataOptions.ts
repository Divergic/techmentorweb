import * as Vuex from "vuex";
import StoreData from "./storeData";
import * as PersistedState from "vuex-persistedstate";

export default class StoreDataOptions implements Vuex.StoreOptions<StoreData> {
    public getters: Vuex.GetterTree<StoreData, StoreData> = {
        accessToken: (state: StoreData): string => {
            return state.accessToken;
        },
        profileId: (state: StoreData): string => {
            return state.profileId;
        },
        idToken: (state: StoreData): string => {
            return state.idToken;
        }
    };
    
    public mutations: Vuex.MutationTree<StoreData> = {
        accessToken: (state: StoreData, token: string) => {
            state.accessToken = token;
        },
        profileId: (state: StoreData, profileId: string) => {
            state.profileId = profileId;
        },
        idToken: (state: StoreData, token: string) => {
            state.idToken = token;
        }
    };

    public plugins: Vuex.Plugin<PersistedState>[] = [
        PersistedState()
    ];
}