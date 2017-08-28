export default class Failure extends Error {
    
    public visibleToUser: boolean = true;

    constructor(message: string) {
        super(message);
    }
}