import { IDataStore, DataStore } from "../dataStore/dataStore";

export interface IUserService {
    isAuthenticated: boolean;
    isAdministrator: boolean;
    sessionExpired: boolean;
}

export class UserService implements IUserService {
    
    public constructor(private store: IDataStore = new DataStore()) {
    }

    public get isAuthenticated(): boolean {
        let token = this.store.idToken;

        if (token) {
            return true;
        }

        return false;
    }

    public get isAdministrator(): boolean {
        return this.store.isAdministrator;
    }

    public get sessionExpired(): boolean {
        if (this.isAuthenticated == false) {
            // There is no authentication token
            return true;
        }

        let currentTime = new Date();
        
        // vuex seems to store values as strings so we need to convert it again even though TypeScript thinks the type is correct
        let storedValue = this.store.tokenExpires;

        if (storedValue <= currentTime) {
            return true;
        }

        return false;
    }
}