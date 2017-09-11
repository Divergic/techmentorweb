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

        let currentTime = new Date();
        let currentInUtc = new Date(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours(), currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), currentTime.getUTCMilliseconds());
        let secondsSinceEpoch = Date.UTC(currentInUtc.getUTCFullYear(), currentInUtc.getUTCMonth(), currentInUtc.getUTCDate(), currentInUtc.getUTCHours(), currentInUtc.getUTCMinutes(), currentInUtc.getUTCSeconds(), currentInUtc.getUTCMilliseconds()) / 1000;
        let nowSinceEpoch = Date.now() / 1000;
        console.log(secondsSinceEpoch + " - " + nowSinceEpoch);

        if (storedValue <= secondsSinceEpoch) {
            return true;
        }

        return false;
    }
}