import { IConfig, Config } from "./config/config";
import { IDataStore, DataStore } from "./dataStore/dataStore";
import { ILocation, Location } from "./location";
import { IUserService, UserService } from "./authentication/userService";
import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import Failure from "./failure";

export interface IHttp {
    get<T>(resourceUri: string): Promise<T>;
    post<T, R>(resourceUri: string, data?: T): Promise<R>;
    put<T, R>(resourceUri: string, data?: T): Promise<R>;
}

export class Http implements IHttp {
    private client: AxiosInstance;

    public constructor(
        client?: AxiosInstance, 
        private config: IConfig = new Config(), 
        private dataStore: IDataStore = new DataStore(), 
        private location: ILocation = new Location(), 
        private userService: IUserService = new UserService()) {
           
        this.client = this.ConfigureClient(client);

        this.client.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
            return this.OnBeforeRequest(config);
        });
        
        this.client.interceptors.response.use(undefined, (error: any): any => {
            return this.OnResponseError(error);
        });
    }

    public async get<T>(resourceUri: string): Promise<T> {
        try {
            let rawResponse = await this.client.get(resourceUri);
            let response = <AxiosResponse>rawResponse;

            return this.ProcessResult<T>(response, [200]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    public async post<T, R>(resourceUri: string, data?: T): Promise<R> {
        try {
            let rawResponse = await this.client.post(resourceUri, data);
            let response = <AxiosResponse>(rawResponse);

            return this.ProcessResult<R>(response, [200, 201, 204]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    public async put<T, R>(resourceUri: string, data?: T): Promise<R> {
        try {
            let rawResponse = await this.client.put(resourceUri, data);
            let response = <AxiosResponse>(rawResponse);

            return this.ProcessResult<R>(response, [200, 204]);
        }
        catch (error) {
            throw this.CreateFailure(error);
        }
    }

    private ConfigureClient(client?: AxiosInstance): AxiosInstance {
        if (client) {
            return client;
        }

        let httpConfig = <AxiosRequestConfig>{};

        httpConfig.baseURL = this.config.apiUri;
        
        return Axios.create(httpConfig);
    }

    private OnBeforeRequest(config: AxiosRequestConfig): AxiosRequestConfig {
        let token = this.dataStore.accessToken;

        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }

        return config;
    }

    private OnResponseError(error: any): any {
        let response = error.response;
        
        if (response.status !== 401) {
            return error;
        }
        
        if (this.userService.IsAuthenticated === false) {
            // The user is not authenticated and has been able to issue a request to a secure resource

            // TODO: This really should redirect to the unauthorized page
            return error;
        }

        if (this.userService.SessionExpired === false) {
            // The user is authenticated has still has a valid session
            // They have invoked something they are not allowed to hit
            
            // TODO: This really should redirect to the unauthorized page
            return error;
        }
        
        const failure = new Failure("Your authentication session has expired.");

        // We will redirect the user to authenticate again because their session has expired
        let returnUri = this.location.getHref();
        let signInUri = this.location.getSignInUri(returnUri);

        // Redirect to the sign in page with a return back to the current page
        this.location.setHref(signInUri);
        
        throw failure;
    }

    private ProcessResult<T>(response: AxiosResponse, allowedStatusCodes: Array<number>): T {
        // In failure scenarios, the first parameter is actually an error with response as a property
        // This needs to be mapped correctly so that the rest of the method can execute correctly
        if ((<any>response).response) {
            response = <AxiosResponse>(<any>response).response;
        }

        if (!response.status) {
            if (response.data) {
                throw this.CreateFailure(response.data);
            }
            else {
                throw new Error("Unexpected status response");
            }
        }

        if (allowedStatusCodes.indexOf(response.status) === -1) {
            throw this.CreateFailure(response.data);
        }

        if (response.status === 204) {
            // There is no content in the response
            return <T><any>null;
        }

        if (!response.data) {
            // There is no content in the response
            return <T><any>null;
        }

        return <T>response.data;
    }

    private CreateFailure(error: any): Failure {
        if (error.visibleToUser) {
            // This already looks like a Failure type
            return <Failure>error;
        }

        console.error(error);
        
        if (typeof error === "string") {
            return new Failure(error);
        }
        
        if (typeof error.message === "string") {
            return new Failure(error.message);
        }
        
        throw error;
    }
}