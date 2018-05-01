export default class StoreData {
    public constructor() {
        this.accessToken = null;
        this.email = null;
        this.firstName = null;
        this.idToken = null;
        this.isAdministrator = false;
        this.lastName = null;
        this.tokenExpires = null;
        this.username = null;
    }

    accessToken: string | null;
    email: string | null;
    firstName: string | null;
    idToken: string | null;
    isAdministrator: boolean;
    lastName: string | null;
    tokenExpires: number | null;
    username: string | null;
}