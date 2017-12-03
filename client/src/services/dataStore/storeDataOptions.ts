import * as Vuex from "vuex";
import StoreData from "./storeData";
import PersistedState from "vuex-persistedstate";

export default class StoreDataOptions implements Vuex.StoreOptions<StoreData> {
    public state: StoreData = new StoreData();

    public getters: Vuex.GetterTree<StoreData, StoreData> = {
        accessToken: (state: StoreData): string | null => {
            return state.accessToken;
        },
        email: (state: StoreData): string | null => {
            return state.email;
        },
        firstName: (state: StoreData): string | null => {
            return state.firstName;
        },
        idToken: (state: StoreData): string | null => {
            return state.idToken;
        },
        isAdministrator: (state: StoreData): boolean => {
            return state.isAdministrator;
        },
        lastName: (state: StoreData): string | null => {
            return state.lastName;
        },
        tokenExpires: (state: StoreData): number | null => {
            return state.tokenExpires;
        }
    };
    
    public mutations: Vuex.MutationTree<StoreData> = {
        accessToken: (state: StoreData, token: string | null) => {
            state.accessToken = token;
        },
        email: (state: StoreData, email: string | null) => {
            state.email = email;
        },
        firstName: (state: StoreData, firstName: string | null) => {
            state.firstName = firstName;
        },
        idToken: (state: StoreData, token: string | null) => {
            state.idToken = token;
        },
        isAdministrator: (state: StoreData, isAdministrator: boolean) => {
            state.isAdministrator = isAdministrator;
        },
        lastName: (state: StoreData, lastName: string | null) => {
            state.lastName = lastName;
        },
        tokenExpires: (state: StoreData, expires: number | null) => {
            state.tokenExpires = expires;
        }
    };

    public plugins: Vuex.Plugin<PersistedState>[] = [
        PersistedState()
    ];
}