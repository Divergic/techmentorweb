import * as Vuex from "vuex";
import StoreData from "./storeData";
import * as PersistedState from "vuex-persistedstate";

export default class StoreDataOptions implements Vuex.StoreOptions<StoreData> {
    public getters: Vuex.GetterTree<StoreData, StoreData> = {
        accessToken: (state: StoreData): string => {
            return state.accessToken;
        },
        email: (state: StoreData): string => {
            return state.email;
        },
        firstName: (state: StoreData): string => {
            return state.firstName;
        },
        idToken: (state: StoreData): string => {
            return state.idToken;
        },
        isAdministrator: (state: StoreData): boolean => {
            return state.isAdministrator;
        },
        lastName: (state: StoreData): string => {
            return state.lastName;
        },
        tokenExpires: (state: StoreData): number => {
            return state.tokenExpires;
        }
    };
    
    public mutations: Vuex.MutationTree<StoreData> = {
        accessToken: (state: StoreData, token: string) => {
            state.accessToken = token;
        },
        email: (state: StoreData, email: string) => {
            state.email = email;
        },
        firstName: (state: StoreData, firstName: string) => {
            state.firstName = firstName;
        },
        idToken: (state: StoreData, token: string) => {
            state.idToken = token;
        },
        isAdministrator: (state: StoreData, isAdministrator: boolean) => {
            state.isAdministrator = isAdministrator;
        },
        lastName: (state: StoreData, lastName: string) => {
            state.lastName = lastName;
        },
        tokenExpires: (state: StoreData, expires: number) => {
            state.tokenExpires = expires;
        }
    };

    public plugins: Vuex.Plugin<PersistedState>[] = [
        PersistedState()
    ];
}