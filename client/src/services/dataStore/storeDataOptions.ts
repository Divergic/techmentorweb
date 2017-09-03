import * as Vuex from "vuex";
import StoreData from "./storeData";
import * as PersistedState from "vuex-persistedstate";

export default class StoreDataOptions implements Vuex.StoreOptions<StoreData> {
    public getters: Vuex.GetterTree<StoreData, StoreData> = {
        accessToken: (state: StoreData): string => {
            return state.accessToken;
        },
        isAdministrator: (state: StoreData): boolean => {
            return state.isAdministrator;
        },
        idToken: (state: StoreData): string => {
            return state.idToken;
        }
    };
    
    public mutations: Vuex.MutationTree<StoreData> = {
        accessToken: (state: StoreData, token: string) => {
            state.accessToken = token;
        },
        isAdministrator: (state: StoreData, isAdministrator: boolean) => {
            state.isAdministrator = isAdministrator;
        },
        idToken: (state: StoreData, token: string) => {
            state.idToken = token;
        }
    };

    public plugins: Vuex.Plugin<PersistedState>[] = [
        PersistedState()
    ];
}