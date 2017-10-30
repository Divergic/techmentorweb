import { IDataStore, DataStore } from "../dataStore/dataStore";

export interface IUserService {
    IsAuthenticated: boolean;
    IsAdministrator: boolean;
    SessionExpired: boolean;
}

export class UserService implements IUserService {
    
    public constructor(private store: IDataStore = new DataStore()) {
    }

    public get IsAuthenticated(): boolean {
        let token = this.store.accessToken;

        if (token) {
            return true;
        }

        return false;
    }

    public get IsAdministrator(): boolean {
        return this.store.isAdministrator;
    }

    public get SessionExpired(): boolean {
        if (this.IsAuthenticated === false) {
            // There is no authentication token
            return true;
        }

        // vuex seems to store values as strings so we need to convert it again even though TypeScript thinks the type is correct
        let storedValue = <number>this.store.tokenExpires | 0;

        let secondsSinceEpoch = Date.now() / 1000;

        if (storedValue <= secondsSinceEpoch) {
            console.warn("The authentication token has expired");
            
            return true;
        }
        
        let expiresAt = new Date();
        
        expiresAt.setTime(storedValue * 1000);
        
        console.info("Token expires at " + expiresAt);
        
        return false;
    }
}