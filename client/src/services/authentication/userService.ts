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

        // vuex seems to store values as strings so we need to convert it again even though TypeScript thinks the type is correct
        let storedValue = this.store.tokenExpires;

        let secondsSinceEpoch = Date.now() / 1000;

        if (storedValue <= secondsSinceEpoch) {
            console.log("The authentication token has expired");
            
            return true;
        }

        // This debug code is written this way so that the whole statement can be removed on release builds
        // The function call is required because Date does not provide a fluent interface on setTime
        console.debug("Token expires at " + (function(){let date = new Date();date.setTime(storedValue * 1000);return date;})());
        
        return false;
    }
}