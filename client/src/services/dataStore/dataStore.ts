import store from "store";
import StoreData from "../dataStore/storeData";

export interface IDataStore {
    accessToken: string;
    profileId: string;
    idToken: string;
}

export class DataStore implements IDataStore {
    
    // This cannot be a setter because changes to vuex data must be done via Component.$state.commit()
    
    public get accessToken(): string {
        let options = <StoreData>store.get("vuex");

        if (!options) {
            return "";
        }

        return options.accessToken;
    }
    
    public get profileId(): string {
        let options = <StoreData>store.get("vuex");

        if (!options) {
            return "";
        }

        return options.profileId;
    }
    
    public get idToken(): string {
        let options = <StoreData>store.get("vuex");

        if (!options) {
            return "";
        }

        return options.idToken;
    }
}