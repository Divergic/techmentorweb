import { IDataStore, DataStore } from "../dataStore/dataStore";

export interface IAuthentication {
    isAuthenticated: boolean;
}

export class Authentication implements IAuthentication {
    
    public constructor(private store: IDataStore = new DataStore()) {
    }

    public get isAuthenticated(): boolean {
        let token = this.store.idToken;

        if (token) {
            return true;
        }

        return false;
    }
}